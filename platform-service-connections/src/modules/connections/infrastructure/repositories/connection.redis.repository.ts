import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { IConnectionCacheRepository } from '../../domain/interfaces/connection-cache.repository.interface';

@Injectable()
export class ConnectionRedisRepository
  implements IConnectionCacheRepository, OnModuleDestroy
{
  private readonly logger = new Logger(ConnectionRedisRepository.name);
  private readonly CONNECTION_SET_KEY_PREFIX = 'connections:set:';
  private readonly CACHE_TTL_SECONDS = 60 * 60 * 24; // 24 hours

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  onModuleDestroy() {
    this.redis.disconnect();
  }

  private _getConnectionsSetKey(userId: string): string {
    return `${this.CONNECTION_SET_KEY_PREFIX}${userId}`;
  }

  async getAcceptedConnectionIds(
    userId: string,
  ): Promise<string[] | null> {
    const key = this._getConnectionsSetKey(userId);
    try {
      const exists = await this.redis.exists(key);
      if (!exists) {
        this.logger.log(`Cache miss for user connection set: ${userId}`);
        return null;
      }
      this.logger.log(`Cache hit for user connection set: ${userId}`);
      return this.redis.smembers(key);
    } catch (error) {
      this.logger.error(
        `Failed to get accepted connection IDs from Redis for user: ${userId}. Error: ${error.message}`,
        error.stack,
      );
      return null; // Fail gracefully, allowing fallback to DB
    }
  }

  async areUsersConnected(
    userIdA: string,
    userIdB: string,
  ): Promise<boolean | null> {
    const key = this._getConnectionsSetKey(userIdA);
    try {
      const exists = await this.redis.exists(key);
      if (!exists) {
        this.logger.log(`Cache miss for user connection set check: ${userIdA}`);
        return null;
      }
      this.logger.log(`Cache hit for user connection set check: ${userIdA}`);
      const isMember = await this.redis.sismember(key, userIdB);
      return isMember === 1;
    } catch (error) {
      this.logger.error(
        `Failed to check connection status in Redis between ${userIdA} and ${userIdB}. Error: ${error.message}`,
        error.stack,
      );
      return null; // Fail gracefully
    }
  }

  async cacheUserConnections(
    userId: string,
    connectionIds: string[],
  ): Promise<void> {
    const key = this._getConnectionsSetKey(userId);
    try {
      const pipeline = this.redis.pipeline();
      pipeline.del(key);
      if (connectionIds.length > 0) {
        pipeline.sadd(key, ...connectionIds);
      }
      pipeline.expire(key, this.CACHE_TTL_SECONDS);
      await pipeline.exec();

      this.logger.log(
        `Successfully cached ${connectionIds.length} connections for user: ${userId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to cache connections in Redis for user: ${userId}. Error: ${error.message}`,
        error.stack,
      );
    }
  }

  async invalidateConnectionCacheForUsers(userIds: string[]): Promise<void> {
    if (userIds.length === 0) {
      return;
    }

    const keys = userIds.map((id) => this._getConnectionsSetKey(id));
    try {
      const pipeline = this.redis.pipeline();
      keys.forEach((key) => pipeline.del(key));
      await pipeline.exec();
      this.logger.log(
        `Successfully invalidated connection cache for users: ${userIds.join(', ')}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to invalidate connection cache in Redis for users: ${userIds.join(', ')}. Error: ${error.message}`,
        error.stack,
      );
    }
  }
}