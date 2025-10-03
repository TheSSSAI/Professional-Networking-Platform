import {
    CommandHandler,
    ICommandHandler,
    EventBus,
} from '@nestjs/cqrs';
import { Inject, Logger, ForbiddenException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IEndorsementsRepository } from '../../../domain/i-endorsements.repository';
import { SkillEndorsedEvent } from '../../../domain/events/skill-endorsed.event';
import { AddEndorsementDto } from '../../dtos/add-endorsement.dto';
import { SkillEndorsement } from '../../../domain/skill-endorsement.entity';


// Placeholder interfaces for external service validators.
// These would typically be in a shared infrastructure module.
export const CONNECTIONS_VALIDATOR_TOKEN = 'CONNECTIONS_VALIDATOR_TOKEN';
export interface IConnectionsValidator {
    areUsersConnected(userAId: string, userBId: string): Promise<boolean>;
}

export const PROFILE_SKILL_VALIDATOR_TOKEN = 'PROFILE_SKILL_VALIDATOR_TOKEN';
export interface IProfileSkillValidator {
    doesSkillExistOnProfile(userId: string, skillId: string): Promise<{ exists: boolean, skillName: string }>;
}


export class AddEndorsementCommand {
    constructor(
        public readonly dto: AddEndorsementDto,
        public readonly endorserId: string,
    ) {}
}

@CommandHandler(AddEndorsementCommand)
export class AddEndorsementHandler implements ICommandHandler<AddEndorsementCommand, void> {
    private readonly logger = new Logger(AddEndorsementHandler.name);

    constructor(
        @Inject('IEndorsementsRepository')
        private readonly endorsementsRepository: IEndorsementsRepository,
        @Inject(CONNECTIONS_VALIDATOR_TOKEN)
        private readonly connectionsValidator: IConnectionsValidator,
        @Inject(PROFILE_SKILL_VALIDATOR_TOKEN)
        private readonly profileSkillValidator: IProfileSkillValidator,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: AddEndorsementCommand): Promise<void> {
        const { profileOwnerId, skillId } = command.dto;
        const { endorserId } = command;

        this.logger.log(`Executing AddEndorsementCommand: User ${endorserId} endorsing skill ${skillId} on profile ${profileOwnerId}`);
        
        try {
            // Business Rule: A user cannot endorse their own skill.
            if (endorserId === profileOwnerId) {
                throw new ForbiddenException('Users cannot endorse their own skills.');
            }

            // Business Rule: Endorser must be a first-degree connection of the endorsed user.
            const areConnected = await this.connectionsValidator.areUsersConnected(endorserId, profileOwnerId);
            if (!areConnected) {
                throw new ForbiddenException('Only first-degree connections can endorse skills.');
            }

            // Data Integrity: The skill must exist on the target profile.
            const skillValidation = await this.profileSkillValidator.doesSkillExistOnProfile(profileOwnerId, skillId);
            if (!skillValidation.exists) {
                throw new RpcException('Skill not found on the specified profile.');
            }

            // The business rule "a user can only endorse a specific skill of another user once"
            // is enforced by a unique constraint in the database. The create operation will fail
            // if a duplicate is attempted.
            
            const newEndorsement = SkillEndorsement.create({
                endorserId,
                endorsedUserId: profileOwnerId,
                skillId
            });

            await this.endorsementsRepository.create(newEndorsement);

            // Publish event for downstream services (e.g., Notifications)
            this.eventBus.publish(
                new SkillEndorsedEvent(
                    profileOwnerId,
                    endorserId,
                    skillValidation.skillName,
                ),
            );

            this.logger.log(`Successfully added endorsement from ${endorserId} for skill ${skillId} on profile ${profileOwnerId}`);

        } catch (error) {
            this.logger.error(
                `Failed to execute AddEndorsementCommand from ${endorserId} to ${profileOwnerId}. Error: ${error.message}`,
                error.stack,
            );
            if (error instanceof RpcException || error instanceof ForbiddenException) {
                throw new RpcException(error.message || error.getResponse());
            }
            // Catch potential unique constraint violation from Prisma
            if (error.code === 'P2002') { // Prisma unique constraint violation code
                 this.logger.warn(`User ${endorserId} attempted to endorse skill ${skillId} on profile ${profileOwnerId} again.`);
                 // We can choose to fail silently or throw a specific exception.
                 // Failing silently is often acceptable for idempotent "add" actions.
                 return;
            }
            throw new RpcException('An unexpected error occurred while adding the endorsement.');
        }
    }
}