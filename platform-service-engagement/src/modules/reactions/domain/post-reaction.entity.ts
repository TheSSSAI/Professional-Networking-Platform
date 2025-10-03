import { randomUUID } from 'crypto';
import { PostReactedEvent } from './events/post-reacted.event';

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

export class ReactionTypeInvalidException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

export interface PostReactionProps {
  id: string;
  userId: string;
  postId: string;
  reactionType: string;
  createdAt: Date;
}

export class PostReaction {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _postId: string;
  private _reactionType: string;
  private readonly _createdAt: Date;

  private readonly _events: IEvent[] = [];

  private constructor(props: PostReactionProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._postId = props.postId;
    this._reactionType = props.reactionType;
    this._createdAt = props.createdAt;
  }

  /**
   * Creates a new PostReaction entity.
   * @param props - The properties to create a new post reaction.
   * @returns A new PostReaction instance.
   * @throws {ReactionTypeInvalidException} if the reactionType is invalid.
   */
  public static create(props: {
    userId: string;
    postId: string;
    reactionType: string;
  }): PostReaction {
    this.validateReactionType(props.reactionType);

    const reaction = new PostReaction({
      id: randomUUID(),
      userId: props.userId,
      postId: props.postId,
      reactionType: props.reactionType,
      createdAt: new Date(),
    });

    // Note: The PostReactedEvent requires the postAuthorId, which is not part of this entity.
    // The Application Service (Command Handler) will be responsible for fetching this data and constructing the event.
    // Here we add a simpler event as a placeholder for the domain action.
    reaction.addDomainEvent(
      new PostReactedEvent(
        reaction.id,
        reaction.postId,
        '', // postAuthorId to be filled by application service
        reaction.userId,
        reaction.reactionType,
      ),
    );

    return reaction;
  }

  /**
   * Reconstitutes a PostReaction entity from the data store.
   * @param props - The properties of an existing post reaction.
   * @returns An instance of the PostReaction entity.
   */
  public static reconstitute(props: PostReactionProps): PostReaction {
    return new PostReaction(props);
  }
  
  /**
   * Updates the reaction type.
   * @param newReactionType - The new type of reaction.
   */
  public updateReactionType(newReactionType: string): void {
    PostReaction.validateReactionType(newReactionType);
    this._reactionType = newReactionType;
  }

  private static validateReactionType(reactionType: string): void {
    if (!reactionType || reactionType.trim().length === 0) {
      throw new ReactionTypeInvalidException(
        'Reaction type cannot be empty.',
      );
    }
    // In a real application, this might validate against an enum of allowed reaction types.
    // e.g., if (!Object.values(AllowedReactionTypes).includes(reactionType))
  }

  // --- Getters ---
  public get id(): string {
    return this._id;
  }
  public get userId(): string {
    return this._userId;
  }
  public get postId(): string {
    return this._postId;
  }
  public get reactionType(): string {
    return this._reactionType;
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