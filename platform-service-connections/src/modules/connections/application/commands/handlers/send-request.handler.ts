import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IConnectionRepository } from '../../../../connections/domain/interfaces/connection.repository.interface';
import { IEventPublisherPort } from '../../../../connections/domain/interfaces/event-publisher.port.interface';
import { ConnectionAggregate } from '../../../../connections/domain/connection.aggregate';
import { SendRequestCommand } from '../impl/send-request.command';

@CommandHandler(SendRequestCommand)
export class SendRequestCommandHandler
  implements ICommandHandler<SendRequestCommand, void>
{
  private readonly logger = new Logger(SendRequestCommandHandler.name);

  constructor(
    @Inject('ConnectionRepository')
    private readonly connectionRepository: IConnectionRepository,
    @Inject('EventPublisher')
    private readonly eventPublisher: IEventPublisherPort,
  ) {}

  async execute(command: SendRequestCommand): Promise<void> {
    this.logger.log(`Executing SendRequestCommand from ${command.senderId} to ${command.recipientId}`);

    const { senderId, recipientId, message } = command;

    if (senderId === recipientId) {
        throw new RpcException('Cannot send a connection request to yourself.');
    }

    try {
      // Business Rule (REQ-1-090): Check for existing connection/request in either direction.
      const existingConnection = await this.connectionRepository.findByUsers(
        senderId,
        recipientId,
      );

      if (existingConnection) {
        throw new RpcException('A connection or pending request already exists between these users.');
      }

      const connectionAggregate = ConnectionAggregate.create(
        senderId,
        recipientId,
        message,
      );

      await this.connectionRepository.save(connectionAggregate);

      connectionAggregate.getUncommittedEvents().forEach((event) => {
        this.eventPublisher.publish(event.constructor.name, event);
      });

      connectionAggregate.commit();
      
      this.logger.log(`Successfully executed SendRequestCommand from ${senderId} to ${recipientId}`);
    } catch (error) {
      this.logger.error(`Error executing SendRequestCommand: ${error.message}`, error.stack);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException('An error occurred while sending the connection request.');
    }
  }
}