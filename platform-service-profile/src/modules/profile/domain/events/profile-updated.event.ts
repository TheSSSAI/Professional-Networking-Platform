/**
 * @class ProfileUpdatedEvent
 * @description This event is dispatched whenever a user's profile is created or updated.
 * It serves as a trigger for downstream services, such as the Search service, to
 * update their own data stores. Following the principles of event-driven architecture
 * and CQRS, this event is lightweight and only contains the identifier of the
 * aggregate that was changed.
 */
export class ProfileUpdatedEvent {
  /**
   * The unique identifier of the user whose profile was updated.
   * This corresponds to the `userId` of the profile aggregate root.
   */
  public readonly userId: string;

  /**
   * @constructor
   * @param {string} userId - The unique identifier of the user.
   */
  constructor(userId: string) {
    this.userId = userId;
  }
}