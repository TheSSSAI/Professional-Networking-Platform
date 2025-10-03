import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IConnectionRepository } from '../../../../connections/domain/interfaces/connection.repository.interface';
import { IEventPublisherPort } from '../../../../connections/domain/interfaces/event-publisher.port.interface';
import { ConnectionAggregate } from '../../../../connections/domain/connection.aggregate';
import { AcceptRequestCommand } from '../impl/accept-request.command';
import { IConnectionCacheRepository } from '../../../../connections/domain/interfaces/connection-cache.repository.interface';
import { ConnectionStatus } from '../../../../connections/domain/connection-status.enum';

@CommandHandler(AcceptRequestCommand)
export class AcceptRequestCommandHandler
  implements ICommandHandler<AcceptRequestCommand, void>
{
  private readonly logger = new Logger(AcceptRequestCommandHandler.name);

  constructor(
    @Inject('ConnectionRepository')
    private readonly connectionRepository: IConnectionRepository,
    @Inject('ConnectionCacheRepository')
    private readonly cacheRepository: IConnectionCacheRepository,
    @Inject('EventPublisher')
    private readonly eventPublisher: IEventPublisherPort,
  ) {}

  async execute(command: AcceptRequestCommand): Promise<void> {
    this.logger.log(`Executing AcceptRequestCommand for user ${command.accepterId} from ${command.requesterId}`);

    const { accepterId, requesterId } = command;

    try {
      const existingConnection = await this.connectionRepository.findByUsers(
        requesterId,
        accepterId,
      );

      if (!existingConnection) {
        throw new RpcException('Connection request not found.');
      }
      
      if (existingConnection.getStatus() !== ConnectionStatus.PENDING) {
        throw new RpcException('Connection request is not in a pending state.');
      }

      const connectionAggregate = ConnectionAggregate.from(existingConnection);
      
      connectionAggregate.accept(accepterId);

      await this.connectionRepository.save(connectionAggregate);

      this.logger.log(`Connection accepted between ${requesterId} and ${accepterId}. Invalidating caches.`);
      
      // Invalidate caches for both users to reflect the new connection status
      await Promise.all([
          this.cacheRepository.invalidateConnectionCacheForUsers([accepterId, requesterId]),
          this.cacheRepository.invalidateConnectionStatusCache(accepterId, requesterId)
      ]);
      
      connectionAggregate.getUncommittedEvents().forEach((event) => {
        this.eventPublisher.publish(event.constructor.name, event);
      });
      
      connectionAggregate.commit();

      this.logger.log(`Successfully executed AcceptRequestCommand for user ${accepterId}`);
    } catch (error) {
      this.logger.error(`Error executing AcceptRequestCommand: ${error.message}`, error.stack);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException('An error occurred while accepting the connection request.');
    }
  }
}