/**
 * Defines the contract (port) for caching operations related to user connections.
 * This interface abstracts the underlying caching technology (e.g., Redis)
 * and is crucial for meeting the platform's performance NFRs (REQ-1-051).
 */
export interface IConnectionCacheRepository {
  /**
   * Retrieves a set of accepted connection IDs for a given user from the cache.
   * @param userId The ID of the user whose connections are to be retrieved.
   * @returns A Promise that resolves to an array of user IDs, or null if the cache misses.
   */
  getAcceptedConnectionIds(userId: string): Promise<string[] | null>;

  /**
   * Checks if two users are connected by querying the cached connection sets.
   * This provides a high-performance alternative to a database query for frequent checks.
   * @param userIdA The ID of the first user.
   * @param userIdB The ID of the second user.
   * @returns A Promise that resolves to a boolean indicating connection status, or null on a cache miss.
   */
  areUsersConnected(
    userIdA: string,
    userIdB: string,
  ): Promise<boolean | null>;

  /**
   * Populates or updates the cache with a user's list of accepted connection IDs.
   * This is typically called after a database query on a cache miss.
   * @param userId The ID of the user whose connections are being cached.
   * @param connectionIds An array of user IDs representing their first-degree connections.
   * @returns A Promise that resolves when the caching operation is complete.
   */
  cacheUserConnections(
    userId: string,
    connectionIds: string[],
  ): Promise<void>;

  /**
   * Invalidates and removes the connection cache for one or more users.
   * This must be called after any write operation (accept, remove) to ensure data consistency.
   * @param userIds An array of user IDs whose connection caches need to be invalidated.
   * @returns A Promise that resolves when the invalidation is complete.
   */
  invalidateConnectionCacheForUsers(userIds: string[]): Promise<void>;
}