/**
 * Query to validate a JWT access token.
 * This class encapsulates the token string that needs to be validated.
 */
export class ValidateTokenQuery {
  /**
   * @param accessToken The JWT access token string to validate.
   */
  constructor(public readonly accessToken: string) {}
}