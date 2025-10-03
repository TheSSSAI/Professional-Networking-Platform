/**
 * Command to request a password reset.
 * This class encapsulates the email address of the user who forgot their password.
 */
export class RequestPasswordResetCommand {
  /**
   * @param email The email address of the user requesting a password reset.
   */
  constructor(public readonly email: string) {}
}