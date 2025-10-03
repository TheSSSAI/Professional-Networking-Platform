/**
 * Command to log in a user.
 * This class encapsulates the credentials required for the user login use case.
 */
export class LoginUserCommand {
  /**
   * @param email The user's registered email address.
   * @param password The user's plaintext password.
   */
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}