/**
 * Represents the domain event that is published when a new post is created.
 * This event is a cornerstone of the asynchronous news feed generation process.
 * Services like the Feed Service will listen for this event to fan-out the
 * new post to the feeds of the author's connections.
 */
export class PostCreatedEvent {
  /**
   * The unique identifier of the post that was created.
   */
  public readonly postId: string;

  /**
   * The unique identifier of the author who created the post.
   */
  public readonly authorId: string;

  /**
   * The timestamp when the post was created.
   */
  public readonly createdAt: Date;

  /**
   * Constructs a new PostCreatedEvent instance.
   * @param postId The ID of the created post.
   * @param authorId The ID of the post's author.
   * @param createdAt The creation timestamp.
   */
  constructor(postId: string, authorId: string, createdAt: Date) {
    this.postId = postId;
    this.authorId = authorId;
    this.createdAt = createdAt;
  }
}