/**
 * Interface (Port) for an Event Publisher.
 * This defines a generic contract for publishing domain events to a message bus.
 * It abstracts the specific messaging technology (e.g., AWS SNS, RabbitMQ, Kafka)
 * from the application layer, adhering to Clean Architecture principles.
 */
export abstract class IEventPublisherPort {
  /**
   * Publishes a domain event to the message bus.
   * The implementation of this method will handle serialization and dispatching
   * the event to the appropriate topic or exchange.
   *
   * @param event The domain event object to be published. The event should be a plain class instance.
   * @returns A Promise that resolves when the event has been successfully published.
   * It should throw an error if publishing fails after exhausting retry policies.
   */
  abstract publish<T extends object>(event: T): Promise<void>;
}