/**
 * Command to register a new user.
 * This class encapsulates all the necessary data for the user registration use case.
 */
export class RegisterUserCommand {
  /**
   * @param email The new user's email address. Must be unique.
   * @param password The new user's plaintext password. Must meet complexity requirements.
   * @param dateOfBirth The new user's date of birth, used for age verification.
   */
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly dateOfBirth: Date,
  ) {}
}