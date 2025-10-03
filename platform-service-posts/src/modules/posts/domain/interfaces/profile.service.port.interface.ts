export type ProfileVisibility = 'PUBLIC' | 'PRIVATE';

export interface ProfileVisibilityResponse {
  visibility: ProfileVisibility;
}

/**
 * Interface (Port) for the Profile Service.
 * This defines the contract that the Posts service's domain layer uses to interact
 * with the Profile microservice. It is essential for retrieving profile data
 * needed to enforce content visibility rules.
 */
export abstract class IProfileServicePort {
  /**
   * Retrieves the visibility setting for a specific user's profile.
   * This is a critical step in the authorization logic for viewing posts,
   * determining whether a post's author has a public or private profile.
   *
   * @param userId The ID of the user whose profile visibility is being checked.
   * @returns A Promise that resolves to an object containing the user's profile visibility.
   * Should throw an error or return a default if the profile is not found.
   */
  abstract getProfileVisibility(
    userId: string,
  ): Promise<ProfileVisibilityResponse>;
}