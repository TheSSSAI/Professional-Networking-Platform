/**
 * Command to refresh an access token.
 * This class encapsulates the refresh token needed to issue a new access token.
 */
export class RefreshTokenCommand {
  /**
   * @param refreshToken The long-lived refresh token.
   * @param userId The ID of the user requesting the token refresh.
   */
  constructor(
    public readonly refreshToken: string,
    public readonly userId: string,
  ) {}
}