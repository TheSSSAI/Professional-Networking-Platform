/**
 * Command to verify a user's email address.
 * This class encapsulates the verification token received from the email link.
 */
export class VerifyEmailCommand {
  /**
   * @param token The email verification token from the URL.
   */
  constructor(public readonly token: string) {}
}