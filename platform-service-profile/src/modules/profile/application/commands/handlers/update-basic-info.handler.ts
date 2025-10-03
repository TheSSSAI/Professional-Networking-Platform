import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateBasicInfoCommand } from '../../commands/update-basic-info.command';
import { IProfileRepository } from '../../../../domain/interfaces/profile-repository.interface';
import { ProfileNotFoundException } from '../../../../domain/exceptions/profile-not-found.exception';
import { Profile } from '../../../../domain/entities/profile.entity';
import { SlugAlreadyExistsException } from '../../../../domain/exceptions/slug-already-exists.exception';

@CommandHandler(UpdateBasicInfoCommand)
export class UpdateBasicInfoHandler
  implements ICommandHandler<UpdateBasicInfoCommand, Profile>
{
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  /**
   * Executes the UpdateBasicInfoCommand.
   * This handler retrieves the user's profile, updates its basic information fields,
   * performs necessary validations (like URL slug uniqueness), and persists the changes.
   *
   * @param {UpdateBasicInfoCommand} command - The command containing the user ID and the data to update.
   * @returns {Promise<Profile>} The updated profile entity.
   * @throws {ProfileNotFoundException} If the profile for the given user ID does not exist.
   * @throws {SlugAlreadyExistsException} If the chosen custom URL slug is already in use.
   */
  async execute(command: UpdateBasicInfoCommand): Promise<Profile> {
    const { userId, updateBasicInfoDto } = command;

    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new ProfileNotFoundException(`Profile for user ${userId} not found`);
    }

    if (
      updateBasicInfoDto.customUrlSlug &&
      updateBasicInfoDto.customUrlSlug !== profile.customUrlSlug
    ) {
      const isSlugTaken = await this.profileRepository.isUrlSlugTaken(
        updateBasicInfoDto.customUrlSlug,
        userId,
      );
      if (isSlugTaken) {
        throw new SlugAlreadyExistsException(
          `The URL slug '${updateBasicInfoDto.customUrlSlug}' is already in use.`,
        );
      }
    }

    profile.updateBasicInfo(updateBasicInfoDto);

    await this.profileRepository.save(profile);
    profile.commit(); // Dispatches domain events

    return profile;
  }
}