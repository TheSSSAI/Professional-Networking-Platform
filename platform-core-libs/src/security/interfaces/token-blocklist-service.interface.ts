/**
 * Defines the contract for a service that manages the JWT blocklist.
 * This abstraction allows for different underlying storage mechanisms
 * (e.g., Redis, in-memory cache) without changing the consuming components like JwtAuthGuard.
 */
export interface ITokenBlocklistService {
  /**
   * Checks if a given token identifier (jti) exists in the blocklist.
   * This is called for every authenticated request to ensure the token has not been revoked.
   *
   * @param {string} jti - The unique identifier (JWT ID) of the token to check.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the token is blocklisted, `false` otherwise.
   * @remarks This method should fail securely. If the underlying storage is unavailable,
   * it should log the error and return `false` to avoid locking out users.
   */
  isBlocked(jti: string): Promise<boolean>;

  /**
   * Adds a token identifier (jti) to the blocklist.
   * This is called during security-sensitive events like user logout or password change.
   * The entry in the blocklist must have a Time-To-Live (TTL) that matches the
   * original token's remaining lifetime to prevent the blocklist from growing indefinitely.
   *
   * @param {string} jti - The unique identifier (JWT ID) of the token to add to the blocklist.
   * @param {number} expiry - The Unix timestamp (in seconds) when the original token expires.
   *                         The service will use this to calculate the TTL for the blocklist entry.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  addToBlocklist(jti: string, expiry: number): Promise<void>;
}

/**
 * A symbol used as a dependency injection token for the ITokenBlocklistService.
 * This allows for loose coupling and easy replacement of the implementation.
 *
 * @example
 * ```
 * constructor(
 *   @Inject(TOKEN_BLOCKLIST_SERVICE)
 *   private readonly tokenBlocklistService: ITokenBlocklistService,
 * ) {}
 * ```
 */
export const TOKEN_BLOCKLIST_SERVICE = Symbol('ITokenBlocklistService');