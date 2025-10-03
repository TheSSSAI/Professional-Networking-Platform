/**
 * @interface IFeedRepository
 * @description Defines the contract for the data access layer for user feeds.
 * This interface abstracts all interactions with the underlying persistence store (Redis),
 * providing a clean, technology-agnostic contract for the application service to use.
 * This is the port for the persistence adapter in a Ports and Adapters architecture.
 */
export interface IFeedRepository {
  /**
   * Adds a post to the feeds of multiple users in a single, atomic batch operation.
   * This method is a core part of the fan-out-on-write strategy and is designed
   * for high performance by leveraging Redis Pipelines. It also trims each feed
   * to a maximum configured size.
   *
   * @param updates - An array of objects, each representing a user feed to update.
   * @returns {Promise<void>} A promise that resolves when the batch operation is complete.
   * @throws {InfrastructureException} If the underlying data store is unavailable.
   */
  addPostToFeeds(
    updates: { userId: string; postId: string; score: number }[],
  ): Promise<void>;

  /**
   * Retrieves a paginated list of post IDs from a specific user's feed.
   * The results are ordered in reverse chronological order (newest first).
   *
   * @param userId - The unique identifier of the user whose feed is to be retrieved.
   * @param start - The starting index for the range query (0-based).
   * @param stop - The ending index for the range query.
   * @returns {Promise<string[]>} A promise that resolves to an array of post IDs.
   * @throws {InfrastructureException} If the underlying data store is unavailable.
   */
  getFeedPage(userId: string, start: number, stop: number): Promise<string[]>;
}

export const IFeedRepository = Symbol('IFeedRepository');