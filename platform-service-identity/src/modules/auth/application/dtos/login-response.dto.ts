/**
 * Data Transfer Object for the response of a successful login or token refresh.
 * It contains the necessary tokens for session management and may indicate
 * if a multi-factor authentication step is required.
 */
export class LoginResponseDto {
  /**
   * The short-lived JSON Web Token used for authenticating API requests.
   */
  accessToken: string;

  /**
   * The long-lived JSON Web Token used to obtain a new access token.
   */
  refreshToken: string;

  /**
   * A flag indicating if a Multi-Factor Authentication (MFA) step is required.
   * If true, the `mfaSessionToken` will be provided instead of access/refresh tokens.
   */
  mfaRequired: boolean;

  /**
   * A temporary, short-lived token issued after a successful password verification
   * for an MFA-enabled account. This token must be sent along with the TOTP code
   * to complete the login process.
   */
  mfaSessionToken?: string;
}