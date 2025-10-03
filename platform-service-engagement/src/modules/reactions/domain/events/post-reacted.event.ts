/**
 * Represents the domain event that is published when a user reacts to a post.
 * This event is used to decouple the act of reacting from downstream processes,
 * such as sending notifications or updating aggregated counts in read models.
 *
 * This class is immutable.
 */
export class PostReactedEvent {
  /**
   * The unique identifier of the post that received the reaction.
   */
  public readonly postId: string;

  /**
   * The unique identifier of the author of the post.
   */
  public readonly postAuthorId: string;

  /**
   * The unique identifier of the user who performed the reaction.
   */
  public readonly reactorId: string;

  /**
   * The type of reaction (e.g., 'LIKE').
   */
  public readonly reactionType: string;

  /**
   * The timestamp when the reaction occurred.
   */
  public readonly reactedAt: Date;

  constructor(payload: {
    postId: string;
    postAuthorId: string;
    reactorId: string;
    reactionType: string;
    reactedAt: Date;
  }) {
    this.postId = payload.postId;
    this.postAuthorId = payload.postAuthorId;
    this.reactorId = payload.reactorId;
    this.reactionType = payload.reactionType;
    this.reactedAt = payload.reactedAt;
  }
}