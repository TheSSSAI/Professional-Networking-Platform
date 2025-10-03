/**
 * Represents the domain event that is published when a user's skill is endorsed by a connection.
 * This allows other services, such as the Notifications Service, to react to this event
 * without being tightly coupled to the endorsement creation logic.
 *
 * This class is immutable.
 */
export class SkillEndorsedEvent {
  /**
   * The unique identifier of the user who received the endorsement.
   */
  public readonly endorsedUserId: string;

  /**
   * The unique identifier of the user who gave the endorsement.
   */
  public readonly endorserId: string;

  /**
   * The unique identifier of the skill that was endorsed.
   */
  public readonly skillId: string;

  /**
   * The name of the skill that was endorsed.
   * Denormalized for consumers that may need the name without another lookup.
   */
  public readonly skillName: string;

  /**
   * The timestamp when the endorsement was given.
   */
  public readonly endorsedAt: Date;

  constructor(payload: {
    endorsedUserId: string;
    endorserId: string;
    skillId: string;
    skillName: string;
    endorsedAt: Date;
  }) {
    this.endorsedUserId = payload.endorsedUserId;
    this.endorserId = payload.endorserId;
    this.skillId = payload.skillId;
    this.skillName = payload.skillName;
    this.endorsedAt = payload.endorsedAt;
  }
}