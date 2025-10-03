/**
 * @file Defines the event payloads for post and interaction-related events.
 * @version 1.0.0
 * @since 1.0.0
 * @see {@link US-048}
 * @see {@link US-052}
 * @see {@link US-054}
 * @see {@link US-056}
 * @see {@link US-059}
 * @see {@link SEQ-247}
 * @see {@link SEQ-262}
 * @see {@link SEQ-263}
 */

/**
 * Published when a new post is created.
 * This is a critical event consumed by the Feed Service to perform fan-out-on-write.
 *
 * @interface PostCreatedEventPayloadV1
 * @version 1.0.0
 */
export interface PostCreatedEventPayloadV1 {
  /**
   * The version of this event payload.
   * @type {'1.0'}
   */
  eventVersion: '1.0';

  /**
   * The unique identifier for this event instance.
   * @type {string}
   */
  eventId: string;

  /**
   * The timestamp when the event occurred, in ISO 8601 format.
   * @type {string}
   */
  eventTimestamp: string;

  /**
   * The unique identifier of the created post.
   * @type {string} - UUID
   */
  postId: string;

  /**
   * The unique identifier of the user who authored the post.
   * @type {string} - UUID
   */
  authorId: string;
}

/**
 * Published when a post is deleted.
 * Consumed by services to perform cleanup, such as removing from feeds or search indexes.
 *
 * @interface PostDeletedEventPayloadV1
 * @version 1.0.0
 */
export interface PostDeletedEventPayloadV1 {
  /**
   * The version of this event payload.
   * @type {'1.0'}
   */
  eventVersion: '1.0';

  /**
   * The unique identifier for this event instance.
   * @type {string}
   */
  eventId: string;

  /**
   * The timestamp when the event occurred, in ISO 8601 format.
   * @type {string}
   */
  eventTimestamp: string;

  /**
   * The unique identifier of the deleted post.
   * @type {string} - UUID
   */
  postId: string;
}

/**
 * Published when a user reacts to a post.
 * Consumed by the Notifications Service to alert the post's author.
 *
 * @interface PostReactedEventPayloadV1
 * @version 1.0.0
 */
export interface PostReactedEventPayloadV1 {
  /**
   * The version of this event payload.
   * @type {'1.0'}
   */
  eventVersion: '1.0';
  eventId: string;
  eventTimestamp: string;

  /**
   * The unique identifier of the post that was reacted to.
   * @type {string} - UUID
   */
  postId: string;

  /**
   * The unique identifier of the post's author.
   * @type {string} - UUID
   */
  postAuthorId: string;

  /**
   * The unique identifier of the user who performed the reaction.
   * @type {string} - UUID
   */
  reactorId: string;

  /**
   * The type of reaction (e.g., 'LIKE', 'CELEBRATE').
   * @type {string}
   */
  reactionType: string;
}

/**
 * Published when a user adds a comment to a post.
 * Consumed by the Notifications Service to alert the post's author.
 *
 * @interface CommentAddedEventPayloadV1
 * @version 1.0.0
 */
export interface CommentAddedEventPayloadV1 {
  /**
   * The version of this event payload.
   * @type {'1.0'}
   */
  eventVersion: '1.0';
  eventId: string;
  eventTimestamp: string;

  /**
   * The unique identifier of the comment that was added.
   * @type {string} - UUID
   */
  commentId: string;

  /**
   * The unique identifier of the post that was commented on.
   * @type {string} - UUID
   */
  postId: string;

  /**
   * The unique identifier of the post's author.
   * @type {string} - UUID
   */
  postAuthorId: string;

  /**
   * The unique identifier of the user who wrote the comment.
   * @type {string} - UUID
   */
  commenterId: string;
}

/**
 * Published when a user reports a piece of content.
 * Consumed by the Admin/Moderation Service to add the item to the review queue.
 *
 * @interface ContentReportedEventPayloadV1
 * @version 1.0.0
 */
export interface ContentReportedEventPayloadV1 {
  /**
   * The version of this event payload.
   * @type {'1.0'}
   */
  eventVersion: '1.0';
  eventId: string;
  eventTimestamp: string;

  /**
   * The unique identifier of the content that was reported.
   * @type {string} - UUID
   */
  contentId: string;

  /**
   * The type of content that was reported (e.g., 'POST', 'COMMENT').
   * @type {string}
   */
  contentType: string;

  /**
   * The unique identifier of the user who made the report.
   * @type {string} - UUID
   */
  reporterId: string;

  /**
   * The reason provided by the user for the report.
   * @type {string}
   */
  reason: string;
}