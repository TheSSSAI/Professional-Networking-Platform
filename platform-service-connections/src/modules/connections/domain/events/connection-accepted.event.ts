/**
 * @fileoverview Domain event representing the acceptance of a connection request.
 *
 * This event is published when a user accepts a pending connection request,
 * signifying the successful formation of a bidirectional professional relationship.
 * It is consumed by downstream services, such as the Notifications service, to
 * inform the original requester that their invitation has been accepted.
 *
 * This event is a critical part of the Event-Driven Architecture, ensuring
 * that the core connection logic is decoupled from side effects like notifications
 * or feed updates.
 *
 * Per REQ-1-016: "Verify the sender is notified when their request is accepted."
 * This event is the payload that triggers that notification.
 */

export class ConnectionAcceptedEvent {
  /**
   * The unique identifier of the user who accepted the connection request.
   * This is the user who was originally the recipient of the request.
   * @type {string}
   */
  public readonly accepterId: string;

  /**
   * The unique identifier of the user who originally sent the connection request.
   * This user will be the recipient of any notifications generated from this event.
   * @type {string}
   */
  public readonly requesterId: string;

  /**
   * The exact timestamp when the connection was accepted.
   * Stored in ISO 8601 format.
   * @type {string}
   */
  public readonly acceptedAt: string;

  /**
   * Constructs a new ConnectionAcceptedEvent.
   * The event is immutable after construction.
   *
   * @param {object} params - The parameters for the event.
   * @param {string} params.accepterId - The ID of the user who accepted the request.
   * @param {string} params.requesterId - The ID of the user who sent the request.
   */
  constructor(params: { accepterId: string; requesterId: string }) {
    this.accepterId = params.accepterId;
    this.requesterId = params.requesterId;
    this.acceptedAt = new Date().toISOString();
  }
}