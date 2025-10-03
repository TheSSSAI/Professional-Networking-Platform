import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IConnectionRepository } from '../../../../connections/domain/interfaces/connection.repository.interface';
import { IConnectionCacheRepository } from '../../../../connections/domain/interfaces/connection-cache.repository.interface';
import { IsConnectedQuery } from '../impl/is-connected.query';

@QueryHandler(IsConnectedQuery)
export class IsConnectedQueryHandler
  implements IQueryHandler<IsConnectedQuery, { areConnected: boolean }>
{
  private readonly logger = new Logger(IsConnectedQueryHandler.name);

  constructor(
    @Inject('ConnectionCacheRepository')
    private readonly cacheRepository: IConnectionCacheRepository,
    @Inject('ConnectionRepository')
    private readonly connectionRepository: IConnectionRepository,
  ) {}

  async execute(
    query: IsConnectedQuery,
  ): Promise<{ areConnected: boolean }> {
    const { userIdA, userIdB } = query;
    this.logger.debug(`Executing IsConnectedQuery between ${userIdA} and ${userIdB}`);

    try {
      // Step 1: Check cache for the specific user pair status first (if this cache exists)
      const cachedStatus = await this.cacheRepository.getConnectionStatus(userIdA, userIdB);
      if (cachedStatus !== null) {
        this.logger.debug(`Cache hit for connection status between ${userIdA} and ${userIdB}.`);
        return { areConnected: cachedStatus };
      }

      // Step 2: Fallback to checking the connection set of the user with fewer connections (if that data is available)
      // For simplicity, we'll check User A's connection set.
      const connectionIds = await this.cacheRepository.getAcceptedConnectionIds(userIdA);
      
      if (connectionIds) {
        this.logger.debug(`Cache hit for connection set for user ${userIdA}.`);
        const areConnected = connectionIds.includes(userIdB);
        // Asynchronously update the pair-specific cache
        this.cacheRepository.cacheConnectionStatus(userIdA, userIdB, areConnected).catch(err => {
            this.logger.warn(`Failed to update pair-specific cache for ${userIdA}-${userIdB}: ${err.message}`);
        });
        return { areConnected };
      }

      // Step 3: Cache miss, go to the database
      this.logger.debug(`Cache miss for both status and set. Querying database for ${userIdA} and ${userIdB}.`);
      const connection = await this.connectionRepository.findByUsers(userIdA, userIdB);
      const areConnected = !!(connection && connection.isAccepted());

      // Step 4: Asynchronously populate the caches for future requests
      this.populateCaches(userIdA, userIdB, areConnected);

      return { areConnected };
    } catch (error) {
      this.logger.error(`Error executing IsConnectedQuery: ${error.message}`, error.stack);
      throw new RpcException('An error occurred while checking connection status.');
    }
  }

  /**
   * Asynchronously populates the relevant caches after a database lookup.
   * This is a "fire-and-forget" operation from the perspective of the request handler.
   */
  private populateCaches(userIdA: string, userIdB: string, areConnected: boolean): void {
     // Populate the specific pair status cache
    this.cacheRepository.cacheConnectionStatus(userIdA, userIdB, areConnected)
      .catch(err => this.logger.error(`Failed to populate connection status cache for ${userIdA}-${userIdB}: ${err.message}`));
      
    // Re-fetch and populate the full connection set for one or both users.
    // This is a heavier operation and should be done judiciously.
    // For this example, we'll just populate for userIdA.
    this.connectionRepository.findAcceptedConnectionIdsForUser(userIdA)
      .then(ids => this.cacheRepository.cacheAcceptedConnectionIds(userIdA, ids))
      .catch(err => this.logger.error(`Failed to populate connection set cache for ${userIdA}: ${err.message}`));
  }
}