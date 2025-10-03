/**
 * Represents the domain event that is published when a new comment is successfully added to a post.
 * This event is consumed by downstream services, such as the Notifications Service,
 * to trigger side effects like sending notifications to the post author.
 *
 * This class is immutable.
 */
export class CommentAddedEvent {
  /**
   * The unique identifier of the comment that was added.
   */
  public readonly commentId: string;

  /**
   * The unique identifier of the post that was commented on.
   */
  public readonly postId: string;

  /**
   * The unique identifier of the author of the post.
   */
  public readonly postAuthorId: string;

  /**
   * The unique identifier of the author of the comment.
   */
  public readonly commentAuthorId: string;

  /**
   * The timestamp when the comment was created.
   */
  public readonly commentedAt: Date;

  constructor(payload: {
    commentId: string;
    postId: string;
    postAuthorId: string;
    commentAuthorId: string;
    commentedAt: Date;
  }) {
    this.commentId = payload.commentId;
    this.postId = payload.postId;
    this.postAuthorId = payload.postAuthorId;
    this.commentAuthorId = payload.commentAuthorId;
    this.commentedAt = payload.commentedAt;
  }
}