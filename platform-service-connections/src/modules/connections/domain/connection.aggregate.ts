import { v4 as uuidv4 } from 'uuid';
import { ConnectionStatus } from './connection-status.enum.ts';
import { ConnectionAcceptedEvent } from './events/connection-accepted.event.ts';
import { ConnectionRequestSentEvent } from './events/connection-request-sent.event.ts';

// A simple base class for domain events, often part of a shared domain kernel
export interface IDomainEvent {
  readonly dateTimeOccurred: Date;
  getAggregateId(): string;
}

// A simple base class for aggregate roots to manage domain events
export abstract class AggregateRoot<T> {
  public readonly id: string;
  protected readonly props: T;
  private readonly _domainEvents: IDomainEvent[] = [];

  protected constructor(props: T, id?: string) {
    this.id = id || uuidv4();
    this.props = props;
  }

  public getUncommittedEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
  }
}

export interface ConnectionProps {
  requesterId: string;
  addresseeId: string;
  status: ConnectionStatus;
  message?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ConnectionActionNotPermittedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConnectionActionNotPermittedException';
  }
}

export class ConnectionCannotBeModifiedException extends Error {
  constructor(status: ConnectionStatus) {
    super(`Connection cannot be modified as its status is already '${status}'.`);
    this.name = 'ConnectionCannotBeModifiedException';
  }
}

export class ConnectionAggregate extends AggregateRoot<ConnectionProps> {
  private constructor(props: ConnectionProps, id?: string) {
    super(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    );
  }

  get requesterId(): string {
    return this.props.requesterId;
  }

  get addresseeId(): string {
    return this.props.addresseeId;
  }

  get status(): ConnectionStatus {
    return this.props.status;
  }

  get message(): string | null | undefined {
    return this.props.message;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  /**
   * Factory method to create a new Connection request.
   * @param props - Properties for the new connection request.
   * @returns A new ConnectionAggregate instance.
   */
  public static create(
    props: Omit<ConnectionProps, 'status'>,
  ): ConnectionAggregate {
    if (props.requesterId === props.addresseeId) {
      throw new ConnectionActionNotPermittedException(
        'User cannot send a connection request to themselves.',
      );
    }

    const connection = new ConnectionAggregate({
      ...props,
      status: ConnectionStatus.PENDING,
    });

    // REQ-1-015: Enable users to send a connection request with a message.
    // This event signals that a request was sent, which the notification service can consume.
    const event = new ConnectionRequestSentEvent(
      connection.id,
      connection.requesterId,
      connection.addresseeId,
      connection.message,
    );
    connection.addDomainEvent(event);

    return connection;
  }

  /**
   * Factory method to reconstitute a Connection aggregate from persisted data.
   * @param id - The aggregate's unique identifier.
   * @param props - Properties from the database.
   * @returns An existing ConnectionAggregate instance.
   */
  public static reconstitute(
    id: string,
    props: ConnectionProps,
  ): ConnectionAggregate {
    return new ConnectionAggregate(props, id);
  }

  /**
   * Accepts a pending connection request.
   * @param accepterId - The ID of the user accepting the request.
   * @throws {ConnectionCannotBeModifiedException} if the connection status is not PENDING.
   * @throws {ConnectionActionNotPermittedException} if the accepter is not the addressee.
   */
  public accept(accepterId: string): void {
    // REQ-1-016: Provide an interface to accept requests.
    // Business rule: Only the addressee can accept.
    if (accepterId !== this.props.addresseeId) {
      throw new ConnectionActionNotPermittedException(
        'Only the recipient of the request can accept it.',
      );
    }

    // Business rule: Only pending requests can be accepted.
    if (this.props.status !== ConnectionStatus.PENDING) {
      throw new ConnectionCannotBeModifiedException(this.props.status);
    }

    this.props.status = ConnectionStatus.ACCEPTED;
    this.props.updatedAt = new Date();

    // REQ-1-016: Notify the sender when the request is accepted.
    const event = new ConnectionAcceptedEvent(
      this.id,
      this.props.addresseeId, // The user who accepted
      this.props.requesterId, // The user who originally sent the request
    );
    this.addDomainEvent(event);
  }

  /**
   * Declines a pending connection request.
   * @param declinerId - The ID of the user declining the request.
   * @throws {ConnectionCannotBeModifiedException} if the connection status is not PENDING.
   * @throws {ConnectionActionNotPermittedException} if the decliner is not the addressee.
   */
  public decline(declinerId: string): void {
    // REQ-1-016: Provide an interface to decline requests.
    // Business rule: Only the addressee can decline.
    if (declinerId !== this.props.addresseeId) {
      throw new ConnectionActionNotPermittedException(
        'Only the recipient of the request can decline it.',
      );
    }

    // Business rule: Only pending requests can be declined.
    if (this.props.status !== ConnectionStatus.PENDING) {
      throw new ConnectionCannotBeModifiedException(this.props.status);
    }

    this.props.status = ConnectionStatus.DECLINED;
    this.props.updatedAt = new Date();
  }

  /**
   * Validates if a user is part of this connection.
   * @param userId - The ID of the user to check.
   * @returns {boolean}
   */
  public isUserPartOfConnection(userId: string): boolean {
    return this.requesterId === userId || this.addresseeId === userId;
  }
}