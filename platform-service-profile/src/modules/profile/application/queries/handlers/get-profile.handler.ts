import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileQuery } from '../../queries/get-profile.query';
import { Inject } from '@nestjs/common';
import { IProfileRepository } from '../../../../domain/interfaces/profile-repository.interface';
import { ProfileNotFoundException } from '../../../../domain/exceptions/profile-not-found.exception';
import { Profile } from '../../../../domain/entities/profile.entity';
import { IConnectionService } from '../../../domain/interfaces/connection-service.interface';
import { IProfileCacheService } from '../../../domain/interfaces/profile-cache-service.interface';

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery, Profile> {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('IProfileCacheService')
    private readonly profileCacheService: IProfileCacheService,
  ) {}

  /**
   * Executes the GetProfileQuery.
   * This handler is responsible for fetching a user profile, applying visibility rules,
   * and utilizing a cache-aside pattern for performance.
   *
   * @param {GetProfileQuery} query - The query containing the target user ID and the requesting user ID.
   * @returns {Promise<Profile>} The full or partial profile entity, depending on visibility rules.
   * @throws {ProfileNotFoundException} If the profile for the target user ID does not exist.
   */
  async execute(query: GetProfileQuery): Promise<Profile> {
    const { targetUserId, requestingUserId } = query;

    // 1. Check Cache
    const cachedProfile = await this.profileCacheService.get(targetUserId);
    if (cachedProfile) {
      return this.applyVisibilityRules(cachedProfile, requestingUserId);
    }

    // 2. Cache Miss: Fetch from Repository
    const profile = await this.profileRepository.findByUserId(targetUserId);
    if (!profile) {
      throw new ProfileNotFoundException(
        `Profile for user ${targetUserId} not found`,
      );
    }

    // 3. Populate Cache
    await this.profileCacheService.set(targetUserId, profile);

    // 4. Apply visibility rules and return
    return this.applyVisibilityRules(profile, requestingUserId);
  }

  /**
   * Applies the business rules for profile visibility.
   * @param profile - The full profile entity to be filtered.
   * @param requestingUserId - The ID of the user attempting to view the profile.
   * @returns A promise resolving to the full or a partial profile.
   */
  private async applyVisibilityRules(
    profile: Profile,
    requestingUserId: string,
  ): Promise<Profile> {
    // Rule: User can always see their own full profile.
    if (profile.userId === requestingUserId) {
      return profile;
    }

    // Rule: Public profiles are visible to everyone.
    if (profile.isPublic()) {
      return profile;
    }

    // Rule: Private profiles are only fully visible to first-degree connections.
    if (profile.isPrivate()) {
      const areConnected = await this.connectionService.areUsersConnected({
        userAId: profile.userId,
        userBId: requestingUserId,
      });

      if (areConnected) {
        return profile;
      }
    }

    // Default: If none of the above, return a minimal profile.
    return profile.getMinimalProfile();
  }
}