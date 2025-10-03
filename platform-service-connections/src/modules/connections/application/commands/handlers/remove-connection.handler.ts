import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IConnectionRepository } from '../../../../connections/domain/interfaces/connection.repository.interface';
import { RemoveConnectionCommand } from '../impl/remove-connection.command';
import { IConnectionCacheRepository } from '../../../../connections/domain/interfaces/connection-cache.repository.interface';
import { ConnectionStatus } from '../../../../connections/domain/connection-status.enum';
import { IEventPublisherPort } from '../../../../connections/domain/interfaces/event-publisher.port.interface';
import { ConnectionRemovedEvent } from '../../../domain/events/connection-removed.event';

@CommandHandler(RemoveConnectionCommand)
export class RemoveConnectionCommandHandler
  implements ICommandHandler<RemoveConnectionCommand, void>
{
  private readonly logger = new Logger(RemoveConnectionCommandHandler.name);

  constructor(
    @Inject('ConnectionRepository')
    private readonly connectionRepository: IConnectionRepository,
    @Inject('ConnectionCacheRepository')
    private readonly cacheRepository: IConnectionCacheRepository,
    @Inject('EventPublisher')
    private readonly eventPublisher: IEventPublisherPort,
  ) {}

  async execute(command: RemoveConnectionCommand): Promise<void> {
    this.logger.log(`Executing RemoveConnectionCommand for user ${command.removerId} on connection with ${command.connectionToRemoveId}`);

    const { removerId, connectionToRemoveId } = command;

    try {
      const connection = await this.connectionRepository.findByUsers(
        removerId,
        connectionToRemoveId,
      );

      if (!connection) {
        throw new RpcException('Connection not found.');
      }
      
      if (connection.getStatus() !== ConnectionStatus.ACCEPTED) {
          throw new RpcException('Cannot remove a connection that is not in an accepted state.');
      }

      // Authorization check: Ensure the person removing the connection is part of it.
      if (
        connection.getRequesterId() !== removerId &&
        connection.getAddresseeId() !== removerId
      ) {
        throw new RpcException('Permission denied. You can only remove your own connections.');
      }

      await this.connectionRepository.delete(connection.getId());

      this.logger.log(`Connection removed for ${removerId} and ${connectionToRemoveId}. Invalidating caches.`);

      const userIds = [connection.getRequesterId(), connection.getAddresseeId()];

      await Promise.all([
        this.cacheRepository.invalidateConnectionCacheForUsers(userIds),
        this.cacheRepository.invalidateConnectionStatusCache(userIds[0], userIds[1])
      ]);

      // Per SDS, publish an internal event for services like Feed, but not a user-facing notification.
      const event = new ConnectionRemovedEvent(removerId, connectionToRemoveId);
      this.eventPublisher.publish(ConnectionRemovedEvent.name, event);

      this.logger.log(`Successfully executed RemoveConnectionCommand for user ${removerId}`);
    } catch (error) {
      this.logger.error(`Error executing RemoveConnectionCommand: ${error.message}`, error.stack);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException('An error occurred while removing the connection.');
    }
  }
}