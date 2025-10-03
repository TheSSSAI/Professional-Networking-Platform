/**
 * Represents the domain event that is published when a post is deleted.
 * This event is used to ensure eventual consistency across the microservices ecosystem.
 * Services such as Engagement, Search, and Feed will listen for this event to
 * perform cleanup operations on their own data stores (e.g., deleting associated
 * comments and reactions, removing the post from search indexes and cached feeds).
 */
export class PostDeletedEvent {
  /**
   * The unique identifier of the post that was deleted.
   */
  public readonly postId: string;

  /**
   * The unique identifier of the author of the deleted post.
   * This can be useful for downstream services that partition data by author.
   */
  public readonly authorId: string;

  /**
   * Constructs a new PostDeletedEvent instance.
   * @param postId The ID of the deleted post.
   * @param authorId The ID of the post's author.
   */
  constructor(postId: string, authorId: string) {
    this.postId = postId;
    this.authorId = authorId;
  }
}