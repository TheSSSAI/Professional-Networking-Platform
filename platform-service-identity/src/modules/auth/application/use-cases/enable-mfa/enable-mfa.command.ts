/**
 * Command to initiate the Multi-Factor Authentication (MFA) setup process for a user.
 * This class encapsulates the ID of the user for whom MFA should be enabled.
 */
export class EnableMfaCommand {
  /**
   * @param userId The unique identifier of the user enabling MFA.
   * @param email The email of the user, used for generating the QR code issuer name.
   */
  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}