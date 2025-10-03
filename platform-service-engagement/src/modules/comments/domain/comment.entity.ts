import { randomUUID } from 'crypto';
import { CommentAddedEvent } from './events/comment-added.event';

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

export class CommentContentInvalidException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

export interface CommentProps {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Comment {
  private readonly _id: string;
  private _content: string;
  private readonly _authorId: string;
  private readonly _postId: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private readonly _events: IEvent[] = [];

  public static readonly MAX_CONTENT_LENGTH = 1500;

  private constructor(props: CommentProps) {
    this._id = props.id;
    this._content = props.content;
    this._authorId = props.authorId;
    this._postId = props.postId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Creates a new Comment entity.
   * @param props - The properties to create a new comment.
   * @returns A new Comment instance.
   * @throws {CommentContentInvalidException} if the content is invalid.
   */
  public static create(props: {
    content: string;
    authorId: string;
    postId: string;
  }): Comment {
    this.validateContent(props.content);

    const now = new Date();
    const comment = new Comment({
      id: randomUUID(),
      content: props.content,
      authorId: props.authorId,
      postId: props.postId,
      createdAt: now,
      updatedAt: now,
    });

    comment.addDomainEvent(
      new CommentAddedEvent(
        comment.id,
        comment.postId,
        comment.authorId,
        comment.content,
      ),
    );

    return comment;
  }

  /**
   * Reconstitutes a Comment entity from the data store.
   * @param props - The properties of an existing comment.
   * @returns An instance of the Comment entity.
   */
  public static reconstitute(props: CommentProps): Comment {
    return new Comment(props);
  }

  /**
   * Updates the content of the comment.
   * @param newContent - The new content for the comment.
   * @throws {CommentContentInvalidException} if the new content is invalid.
   */
  public updateContent(newContent: string): void {
    Comment.validateContent(newContent);
    this._content = newContent;
    this._updatedAt = new Date();
  }

  private static validateContent(content: string): void {
    if (!content || content.trim().length === 0) {
      throw new CommentContentInvalidException('Comment content cannot be empty.');
    }
    if (content.length > this.MAX_CONTENT_LENGTH) {
      throw new CommentContentInvalidException(
        `Comment content cannot exceed ${this.MAX_CONTENT_LENGTH} characters.`,
      );
    }
  }

  // --- Getters ---
  public get id(): string {
    return this._id;
  }
  public get content(): string {
    return this._content;
  }
  public get authorId(): string {
    return this._authorId;
  }
  public get postId(): string {
    return this._postId;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
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