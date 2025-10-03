/**
 * @file Defines the event payloads for connection-related lifecycle events.
 * @version 1.0.0
 * @since 1.0.0
 * @see {@link US-039}
 * @see {@link US-042}
 * @see {@link US-047}
 */

/**
 * Published when a user sends a new connection request to another user.
 * This event is consumed by the notifications service to alert the recipient.
 *
 * @interface ConnectionRequestSentEventPayloadV1
 * @version 1.0.0
 */
export interface ConnectionRequestSentEventPayloadV1 {
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
   * The unique identifier of the user who sent the request.
   * @type {string} - UUID
   */
  senderId: string;

  /**
   * The unique identifier of the user who received the request.
   * @type {string} - UUID
   */
  recipientId: string;

  /**
   * The unique identifier for the connection request itself.
   * @type {string} - UUID
   */
  connectionRequestId: string;
}

/**
 * Published when a user accepts a connection request.
 * This event is consumed by the notifications service to alert the original sender
 * and potentially by other services to update relationship caches.
 *
 * @interface ConnectionRequestAcceptedEventPayloadV1
 * @version 1.0.0
 */
export interface ConnectionRequestAcceptedEventPayloadV1 {
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
   * The array of user IDs involved in the new connection.
   * @type {string[]} - UUIDs
   */
  userIds: [string, string];
}

/**
 * Published when a user removes an existing connection.
 * This event can be consumed by services like the Feed Service to clean up
 * feeds or by the Search Service to update connection degree information.
 *
 * @interface ConnectionRemovedEventPayloadV1
 * @version 1.0.0
 */
export interface ConnectionRemovedEventPayloadV1 {
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
   * The array of user IDs who are no longer connected.
   * @type {string[]} - UUIDs
   */
  userIds: [string, string];
}