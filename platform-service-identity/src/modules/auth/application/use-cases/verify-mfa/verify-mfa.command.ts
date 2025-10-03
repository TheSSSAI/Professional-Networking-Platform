/**
 * Command to verify a Time-based One-Time Password (TOTP) code during the second
 * step of an MFA-enabled login.
 */
export class VerifyMfaCommand {
  /**
   * @param mfaSessionToken A temporary, short-lived JWT issued after successful
   *                        password validation for an MFA-enabled user.
   * @param totpCode The 6-digit code from the user's authenticator app.
   */
  constructor(
    public readonly mfaSessionToken: string,
    public readonly totpCode: string,
  ) {}
}