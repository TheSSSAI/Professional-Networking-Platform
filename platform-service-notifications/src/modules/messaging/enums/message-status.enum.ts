/**
 * @file Defines the enumeration for the lifecycle status of a message.
 * @description This enum represents the different states a message can be in,
 * from being sent by the user to being read by the recipient, as required by REQ-1-027.
 * @namespace Platform.Services.Messaging
 */

/**
 * Represents the lifecycle status of a message.
 */
export enum MessageStatus {
  /**
   * The message has been successfully persisted by the server but not yet delivered to the recipient's client.
   */
  SENT = 'sent',

  /**
   * The message has been successfully delivered to an active client of the recipient.
   */
  DELIVERED = 'delivered',

  /**
   * The message has been actively viewed by the recipient in their chat window.
   */
  READ = 'read',
}