import { FeedResponseDto } from '../dto/feed-response.dto';

/**
 * @interface IFeedService
 * @description Defines the contract for the core application logic of the Feed service.
 * This interface represents the primary port for interacting with the service's capabilities,
 * such as retrieving feeds and initiating the fan-out process.
 */
export interface IFeedService {
  /**
   * Retrieves a paginated list of post IDs for a given user's feed.
   * This method orchestrates the retrieval from the data layer.
   *
   * @param userId - The unique identifier of the user.
   * @param page - The page number for pagination.
   * @param limit - The number of items per page.
   * @returns {Promise<FeedResponseDto>} A promise that resolves to a DTO containing the list of post IDs.
   */
  getFeed(
    userId: string,
    page: number,
    limit: number,
  ): Promise<FeedResponseDto>;

  /**
   * Orchestrates the fan-out of a new post to the feeds of the author's connections.
   * This is the entry point for the core write-path logic, triggered by a 'PostCreated' event.
   * It is responsible for fetching connections and delegating the write operation to the repository.
   *
   * @param authorId - The unique identifier of the post's author.
   * @param postId - The unique identifier of the new post.
   * @param createdAt - The creation timestamp of the post.
   * @returns {Promise<void>} A promise that resolves when the fan-out process has been successfully initiated.
   * @throws {ExternalServiceException} If the connection service is unavailable.
   */
  fanOutPostToConnections(
    authorId: string,
    postId: string,
    createdAt: Date,
  ): Promise<void>;
}

export const IFeedService = Symbol('IFeedService');