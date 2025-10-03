import { randomUUID } from 'crypto';
import { SkillEndorsedEvent } from './events/skill-endorsed.event';

// In a real-world DDD scenario, the event handling logic would be in a shared 'AggregateRoot' base class.
// For this isolated generation, it's included directly in the entity.
interface IEvent {
  readonly dateTimeOccurred: Date;
  getAggregateId(): string;
}

export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class EndorsementInvalidException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

export interface SkillEndorsementProps {
  id: string;
  endorserId: string;
  endorsedUserId: string;
  skillId: string;
  createdAt: Date;
}

export class SkillEndorsement {
  private readonly _id: string;
  private readonly _endorserId: string;
  private readonly _endorsedUserId: string;
  private readonly _skillId: string;
  private readonly _createdAt: Date;

  private readonly _events: IEvent[] = [];

  private constructor(props: SkillEndorsementProps) {
    this._id = props.id;
    this._endorserId = props.endorserId;
    this._endorsedUserId = props.endorsedUserId;
    this._skillId = props.skillId;
    this._createdAt = props.createdAt;
  }

  /**
   * Creates a new SkillEndorsement entity.
   * The business rule that an endorser must be a first-degree connection is enforced
   * in the Application Service layer, as it requires an external dependency check.
   * @param props - The properties to create a new skill endorsement.
   * @returns A new SkillEndorsement instance.
   */
  public static create(props: {
    endorserId: string;
    endorsedUserId: string;
    skillId: string;
  }): SkillEndorsement {
    if (props.endorserId === props.endorsedUserId) {
        throw new EndorsementInvalidException('A user cannot endorse their own skill.');
    }

    const endorsement = new SkillEndorsement({
      id: randomUUID(),
      endorserId: props.endorserId,
      endorsedUserId: props.endorsedUserId,
      skillId: props.skillId,
      createdAt: new Date(),
    });

    // Note: The SkillEndorsedEvent requires the skill name, which is not part of this entity.
    // The Application Service (Command Handler) will be responsible for fetching this data and constructing the event.
    endorsement.addDomainEvent(
      new SkillEndorsedEvent(
        endorsement.id,
        endorsement.endorsedUserId,
        endorsement.endorserId,
        '', // skillName to be filled by application service
      ),
    );

    return endorsement;
  }

  /**
   * Reconstitutes a SkillEndorsement entity from the data store.
   * @param props - The properties of an existing skill endorsement.
   * @returns An instance of the SkillEndorsement entity.
   */
  public static reconstitute(props: SkillEndorsementProps): SkillEndorsement {
    return new SkillEndorsement(props);
  }

  // --- Getters ---
  public get id(): string {
    return this._id;
  }
  public get endorserId(): string {
    return this._endorserId;
  }
  public get endorsedUserId(): string {
    return this._endorsedUserId;
  }
  public get skillId(): string {
    return this._skillId;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }

  // --- Domain Event Management ---
  public getUncommittedEvents(): IEvent[] {
    return this._events;
  }

  public clearEvents(): void {
    this._events.length = 0;
  }

  private addDomainEvent(event: IEvent): void {
    this._events.push(event);
  }
}