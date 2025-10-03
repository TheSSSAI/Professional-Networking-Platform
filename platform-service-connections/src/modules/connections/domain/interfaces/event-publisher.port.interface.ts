/**
 * Defines the contract (port) for publishing domain events.
 * This interface abstracts the underlying event bus or messaging system (e.g., SNS, Kafka, RabbitMQ),
 * allowing the application layer to publish events without being coupled to a specific technology.
 * This is a key component of the Event-Driven Architecture pattern.
 */
export interface IEventPublisherPort {
  /**
   * Publishes a domain event to the message bus.
   * @template T - The type of the event payload, which must be an object.
   * @param event The event object to be published. The event should have a consistent structure,
   * typically including an event name/type and a data payload.
   * @returns A Promise that resolves when the event has been successfully published.
   */
  publish<T extends { eventName: string; payload: object }>(
    event: T,
  ): Promise<void>;
}