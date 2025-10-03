/**
 * @file Defines the event payloads for account-related lifecycle events.
 * @version 1.0.0
 * @since 1.0.0
 * @see {@link US-013}
 * @see {@link US-015}
 * @see {@link US-016}
 * @see {@link SEQ-249}
 */

/**
 * Published when a user's account is successfully deactivated.
 * This event is consumed by various services to update their state,
 * such as removing the user from search indexes and anonymizing their content.
 *
 * @interface AccountDeactivatedEventPayloadV1
 * @version 1.0.0
 */
export interface AccountDeactivatedEventPayloadV1 {
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
   * The unique identifier of the user whose account was deactivated.
   * @type {string} - UUID
   */
  userId: string;
}

/**
 * Published when a user initiates a permanent account deletion request.
 * This event is typically used to schedule the final data purge job.
 *
 * @interface AccountDeletionRequestedEventPayloadV1
 * @version 1.0.0
 */
export interface AccountDeletionRequestedEventPayloadV1 {
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
   * The unique identifier of the user who requested deletion.
   * @type {string} - UUID
   */
  userId: string;

  /**
   * The timestamp when the final purge is scheduled to occur, in ISO 8601 format.
   * @type {string}
   */
  scheduledPurgeAt: string;
}

/**
 * Published when a user cancels a pending account deletion request.
 * This event is used to cancel the scheduled data purge job.
 *
 * @interface AccountDeletionCancelledEventPayloadV1
 * @version 1.0.0
 */
export interface AccountDeletionCancelledEventPayloadV1 {
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
   * The unique identifier of the user who cancelled the deletion.
   * @type {string} - UUID
   */
  userId: string;
}

/**
 * Published when the grace period for an account deletion has expired,
 * triggering the distributed data purge SAGA.
 *
 * @interface AccountPurgeInitiatedEventPayloadV1
 * @version 1.0.0
 */
export interface AccountPurgeInitiatedEventPayloadV1 {
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
   * The unique identifier of the user whose data is to be purged.
   * @type {string} - UUID
   */
  userId: string;

  /**
   * The email address of the user being purged. This may be used
   * for final logging or to add to a blocklist.
   * @type {string}
   */
  email: string;
}