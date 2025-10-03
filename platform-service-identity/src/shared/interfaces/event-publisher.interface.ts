export interface IDomainEvent {
  readonly name: string;
  readonly payload: any;
}

export const IEventPublisher = Symbol('IEventPublisher');

export interface IEventPublisher {
  /**
   * Publishes a domain event to the message bus.
   * @param event The domain event to publish.
   */
  publish(event: IDomainEvent): Promise<void>;
}