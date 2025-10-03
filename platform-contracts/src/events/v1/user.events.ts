/**
 * @file Defines the event payloads for user and profile-related events.
 * @version 1.0.0
 * @since 1.0.0
 * @see {@link US-001}
 * @see {@link US-010}
 * @see {@link SEQ-242}
 * @see {@link SEQ-246}
 * @see {@link SEQ-260}
 */

/**
 * Published when a new user successfully completes the registration form.
 * Consumed by the Notifications Service to send a verification email.
 *
 * @interface UserRegisteredEventPayloadV1
 * @version 1.0.0
 */
export interface UserRegisteredEventPayloadV1 {
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
   * The unique identifier of the newly registered user.
   * @type {string} - UUID
   */
  userId: string;

  /**
   * The email address of the new user, needed to send the verification email.
   * @type {string}
   */
  email: string;

  /**
   * The verification token to be included in the email link.
   * @type {string}
   */
  verificationToken: string;
}

/**
 * Published when a user's profile data has been updated.
 * Consumed by the Search Service to trigger re-indexing of the user's document
 * in OpenSearch, supporting the CQRS pattern.
 *
 * @interface UserProfileUpdatedEventPayloadV1
 * @version 1.0.0
 */
export interface UserProfileUpdatedEventPayloadV1 {
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
   * The unique identifier of the user whose profile was updated.
   * @type {string} - UUID
   */
  userId: string;

  /**
   * An array of strings indicating which parts of the profile were updated.
   * e.g., ['basic_info', 'work_experience']. Allows consumers to perform
   * targeted updates.
   * @type {string[]}
   */
  updatedFields: string[];
}

/**
 * Published when a user requests to reset their password.
 * Consumed by the Notifications Service to send the password reset email.
 *
 * @interface PasswordResetRequestedEventPayloadV1
 * @version 1.0.0
 */
export interface PasswordResetRequestedEventPayloadV1 {
  /**
   * The version of this event payload.
   * @type {'1.0'}
   */
  eventVersion: '1.0';
  eventId: string;
  eventTimestamp: string;

  /**
   * The unique identifier of the user requesting the reset.
   * @type {string} - UUID
   */
  userId: string;

  /**
   * The email address to which the reset link should be sent.
   * @type {string}
   */
  email: string;

  /**
   * The secure, time-limited token to include in the reset link.
   * @type {string}
   */
  resetToken: string;
}