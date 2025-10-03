/**
 * Command to reset a user's password using a valid token.
 * This class encapsulates all data needed to complete the password reset process.
 */
export class ResetPasswordCommand {
  /**
   * @param token The password reset token from the URL.
   * @param newPassword The new password that meets complexity requirements.
   */
  constructor(
    public readonly token: string,
    public readonly newPassword: string,
  ) {}
}