/**
 * Custom error for password complexity validation failures.
 */
export class PasswordComplexityError extends Error {
  constructor(public readonly reasons: string[]) {
    super(`Password does not meet complexity requirements: ${reasons.join(', ')}`);
    this.name = 'PasswordComplexityError';
  }
}

/**
 * @class PasswordDomainService
 * @description Encapsulates the business logic for password management that does not belong
 * to the User entity itself, such as complexity validation. This is a stateless domain service.
 */
export class PasswordDomainService {
  private readonly minLength = 12;
  private readonly requiresUppercase = true;
  private readonly requiresLowercase = true;
  private readonly requiresNumber = true;
  private readonly requiresSpecialChar = true;

  /**
   * Validates a password against the system's complexity requirements.
   * @param password - The plaintext password to validate.
   * @throws {PasswordComplexityError} If the password does not meet the requirements.
   */
  public validateComplexity(password: string): void {
    const errors: string[] = [];

    if (!password) {
        throw new PasswordComplexityError(['Password cannot be empty.']);
    }

    if (password.length < this.minLength) {
      errors.push(`Password must be at least ${this.minLength} characters long.`);
    }
    if (this.requiresUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must include at least one uppercase letter.');
    }
    if (this.requiresLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must include at least one lowercase letter.');
    }
    if (this.requiresNumber && !/\d/.test(password)) {
      errors.push('Password must include at least one number.');
    }
    if (this.requiresSpecialChar && !/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must include at least one special character.');
    }

    if (errors.length > 0) {
      throw new PasswordComplexityError(errors);
    }
  }
}