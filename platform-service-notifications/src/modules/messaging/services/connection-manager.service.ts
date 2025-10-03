import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { RedisService } from '../../../shared/redis/redis.service';
import { Redis } from 'ioredis';

@Injectable()
export class ConnectionManagerService implements OnModuleDestroy {
  private readonly logger = new Logger(ConnectionManagerService.name);
  private readonly redisClient: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redisClient = this.redisService.getClient();
  }

  private getUserSocketsKey(userId: string): string {
    return `user-sockets:${userId}`;
  }

  private getSocketUserKey(socketId: string): string {
    return `socket-user:${socketId}`;
  }

  /**
   * Registers a new socket connection for a user.
   * Creates a forward mapping (userId -> set of socketIds) and a reverse mapping (socketId -> userId).
   * @param userId The ID of the authenticated user.
   * @param socketId The ID of the new socket connection.
   */
  async register(userId: string, socketId: string): Promise<void> {
    try {
      this.logger.log(`Registering socket ${socketId} for user ${userId}`);
      const pipeline = this.redisClient.pipeline();
      pipeline.sadd(this.getUserSocketsKey(userId), socketId);
      pipeline.set(this.getSocketUserKey(socketId), userId);
      await pipeline.exec();
    } catch (error) {
      this.logger.error(
        `Failed to register socket ${socketId} for user ${userId}`,
        error.stack,
      );
    }
  }

  /**
   * Unregisters a socket connection upon disconnect.
   * Uses the reverse mapping to find the user and efficiently remove the socket from their set.
   * @param socketId The ID of the disconnected socket.
   */
  async unregister(socketId: string): Promise<void> {
    try {
      this.logger.log(`Unregistering socket ${socketId}`);
      const userId = await this.redisClient.get(
        this.getSocketUserKey(socketId),
      );
      if (userId) {
        const pipeline = this.redisClient.pipeline();
        pipeline.srem(this.getUserSocketsKey(userId), socketId);
        pipeline.del(this.getSocketUserKey(socketId));
        await pipeline.exec();
        this.logger.log(
          `Successfully unregistered socket ${socketId} for user ${userId}`,
        );
      } else {
        this.logger.warn(
          `Could not find user for disconnected socket ${socketId}. It may have already been cleaned up.`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to unregister socket ${socketId}`,
        error.stack,
      );
    }
  }

  /**
   * Retrieves all active socket IDs for a given user.
   * @param userId The ID of the user.
   * @returns An array of socket ID strings.
   */
  async getSocketIds(userId: string): Promise<string[]> {
    try {
      return await this.redisClient.smembers(this.getUserSocketsKey(userId));
    } catch (error) {
      this.logger.error(
        `Failed to get socket IDs for user ${userId}`,
        error.stack,
      );
      return [];
    }
  }

  /**
   * Retrieves the user ID associated with a given socket ID.
   * @param socketId The ID of the socket.
   * @returns The user ID string, or null if not found.
   */
  async getUserId(socketId: string): Promise<string | null> {
    try {
      return await this.redisClient.get(this.getSocketUserKey(socketId));
    } catch (error) {
      this.logger.error(
        `Failed to get user ID for socket ${socketId}`,
        error.stack,
      );
      return null;
    }
  }

  onModuleDestroy() {
    this.logger.log('Disconnecting from Redis...');
    this.redisService.disconnect();
  }
}