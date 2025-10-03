import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AddWorkExperienceCommand } from '../../commands/add-work-experience.command';
import { IProfileRepository } from '../../../../domain/interfaces/profile-repository.interface';
import { ProfileNotFoundException } from '../../../../domain/exceptions/profile-not-found.exception';
import { WorkExperience } from '../../../../domain/entities/work-experience.entity';
import { Profile } from '../../../../domain/entities/profile.entity';

@CommandHandler(AddWorkExperienceCommand)
export class AddWorkExperienceHandler
  implements ICommandHandler<AddWorkExperienceCommand, WorkExperience>
{
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  /**
   * Executes the AddWorkExperienceCommand.
   * This handler retrieves the user's profile, adds a new work experience entry
   * by delegating business rule validation to the domain entity, and persists the changes.
   *
   * @param {AddWorkExperienceCommand} command - The command containing the user ID and new work experience data.
   * @returns {Promise<WorkExperience>} The newly created work experience entity.
   * @throws {ProfileNotFoundException} If the profile for the given user ID does not exist.
   * @throws {InvalidDateRangeException} If the start and end dates are logically inconsistent.
   */
  async execute(command: AddWorkExperienceCommand): Promise<WorkExperience> {
    const { userId, addWorkExperienceDto } = command;

    const profile: Profile | null = await this.profileRepository.findByUserId(
      userId,
    );
    if (!profile) {
      throw new ProfileNotFoundException(`Profile for user ${userId} not found`);
    }

    const newExperience = profile.addWorkExperience(addWorkExperienceDto);

    await this.profileRepository.save(profile);
    profile.commit(); // Dispatches domain events

    return newExperience;
  }
}