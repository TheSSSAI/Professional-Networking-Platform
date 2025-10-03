export const ITokenBlocklistService = Symbol('ITokenBlocklistService');

/**
 * Defines the contract for managing a token blocklist.
 * This is crucial for immediate token revocation on events like logout or password change (REQ-1-005).
 */
export interface ITokenBlocklistService {
  /**
   * Adds a token's unique identifier (jti) to the blocklist.
   * @param jti The unique identifier of the JWT to block.
   * @param exp The original expiration timestamp of the token, used to set the TTL in the cache.
   */
  addToBlocklist(jti: string, exp: number): Promise<void>;

  /**
   * Checks if a token's unique identifier (jti) is in the blocklist.
   * @param jti The unique identifier of the JWT to check.
   * @returns A promise that resolves to true if the token is blocklisted, false otherwise.
   */
  isBlocklisted(jti: string): Promise<boolean>;
}