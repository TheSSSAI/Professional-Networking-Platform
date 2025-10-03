/**
 * @enum Visibility
 * @description Represents the user-configurable visibility setting for their profile, as required by REQ-1-014.
 * This is a core Value Object in the Profile domain, dictating access control rules for profile data.
 */
export enum Visibility {
  /**
   * The user's full profile is visible to all other logged-in users on the platform.
   */
  PUBLIC = 'PUBLIC',

  /**
   * The user's full profile is visible only to their first-degree connections.
   * Non-connections will see a minimal, public subset of the profile.
   */
  PRIVATE = 'PRIVATE',
}