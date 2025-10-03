/**
 * Defines the possible lifecycle states of a user account.
 * This corresponds to the `UserStatus` enum in `schema.prisma`.
 */
export enum UserStatus {
  /**
   * The user has registered but not yet verified their email. Login is disabled.
   */
  INACTIVE = 'INACTIVE',

  /**
   * The user is fully verified and can access the platform.
   */
  ACTIVE = 'ACTIVE',

  /**
   * The user has voluntarily deactivated their account. Login is disabled but can be reactivated.
   */
  DEACTIVATED = 'DEACTIVATED',

  /**
   * The user has been banned by an administrator. Login is permanently disabled.
   */
  BANNED = 'BANNED',
}