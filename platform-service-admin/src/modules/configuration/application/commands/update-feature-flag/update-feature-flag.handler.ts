import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { UpdateFeatureFlagCommand } from './update-feature-flag.command';
import { IFeatureFlagRepository } from '../../../../configuration/domain/interfaces/feature-flag.repository';
import { AuditService } from '../../../../audit/application/services/audit.service';
import { AdminActionType } from '../../../../audit/domain/enums/admin-action-type.enum';
import { FeatureFlag } from '../../../../configuration/domain/entities/feature-flag.entity';
// Assuming a domain event exists for feature flag updates. If not, this can be added.
// For now, let's assume it's a simple object published to the event bus.
class FeatureFlagUpdatedEvent {
  constructor(
    public readonly flagName: string,
    public readonly isEnabled: boolean,
  ) {}
}

@CommandHandler(UpdateFeatureFlagCommand)
export class UpdateFeatureFlagHandler
  implements ICommandHandler<UpdateFeatureFlagCommand>
{
  private readonly logger = new Logger(UpdateFeatureFlagHandler.name);

  constructor(
    @Inject(IFeatureFlagRepository)
    private readonly featureFlagRepository: IFeatureFlagRepository,
    private readonly auditService: AuditService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateFeatureFlagCommand): Promise<FeatureFlag> {
    this.logger.log(`Executing UpdateFeatureFlagCommand for flag: ${command.flagName}`);

    const { flagName, isEnabled, adminId } = command;

    const existingFlag = await this.featureFlagRepository.findByName(flagName);
    if (!existingFlag) {
      this.logger.error(`Feature flag with name "${flagName}" not found.`);
      throw new NotFoundException(`Feature flag with name "${flagName}" not found.`);
    }

    const oldState = existingFlag.isEnabled;
    if (oldState === isEnabled) {
      this.logger.log(`Feature flag "${flagName}" already has the desired state. No action taken.`);
      return existingFlag;
    }

    // Log the action first for audit purposes
    await this.auditService.logAction({
      adminId,
      actionType: AdminActionType.UPDATE_FEATURE_FLAG,
      targetId: flagName,
      targetType: 'FeatureFlag',
      details: {
        from: oldState,
        to: isEnabled,
      },
    });

    // Update the entity
    existingFlag.isEnabled = isEnabled;
    const updatedFlag = await this.featureFlagRepository.update(existingFlag);
    this.logger.log(`Successfully updated feature flag "${flagName}" to ${isEnabled}.`);

    // Publish an event to notify other services/parts of the system of the change
    this.eventBus.publish(
      new FeatureFlagUpdatedEvent(updatedFlag.flagName, updatedFlag.isEnabled),
    );

    return updatedFlag;
  }
}