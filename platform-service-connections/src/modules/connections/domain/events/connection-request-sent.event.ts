/**
 * @fileoverview Domain event representing the sending of a new connection request.
 *
 * This event is published when a user sends a new connection request to another user.
 * It serves as a trigger for downstream services, most notably the Notifications service,
 * to generate a real-time notification for the recipient of the request.
 *
 * Adhering to an Event-Driven Architecture, this decouples the core action of
 * creating a request from the side effect of notifying the recipient.
 *
 * Per REQ-1-015: "Verify the recipient receives the connection request along with the personalized message, if provided."
 * This event carries the necessary payload to fulfill that requirement.
 */

export class ConnectionRequestSentEvent {
  /**
   * The unique identifier of the user who sent the connection request.
   * @type {string}
   */
  public readonly senderId: string;

  /**
   * The unique identifier of the user who is the recipient of the connection request.
   * This is the user who will be notified about the new request.
   * @type {string}
   */
  public readonly recipientId: string;

  /**
   * The optional personalized message included with the connection request.
   * Can be null or undefined if no message was provided.
   * @type {string | undefined}
   */
  public readonly message?: string;

  /**
   * The exact timestamp when the request was sent.
   * Stored in ISO 8601 format.
   * @type {string}
   */
  public readonly sentAt: string;

  /**
   * Constructs a new ConnectionRequestSentEvent.
   * The event is immutable after construction.
   *
   * @param {object} params - The parameters for the event.
   * @param {string} params.senderId - The ID of the user sending the request.
   * @param {string} params.recipientId - The ID of the user receiving the request.
   * @param {string} [params.message] - The optional personalized message.
   */
  constructor(params: {
    senderId: string;
    recipientId: string;
    message?: string;
  }) {
    this.senderId = params.senderId;
    this.recipientId = params.recipientId;
    this.message = params.message;
    this.sentAt = new Date().toISOString();
  }
}