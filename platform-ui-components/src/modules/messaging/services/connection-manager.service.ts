import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../../../shared/redis/redis.service';
import Redis from 'ioredis';

const USER_SOCKETS_PREFIX = 'user_sockets';
const SOCKET_USER_PREFIX = 'socket_user';

/**
 * @class ConnectionManagerService
 * @description Manages the distributed state of WebSocket connections using Redis.
 * This service provides an abstraction layer for tracking which user IDs are connected
 * via which socket IDs, which is essential for a horizontally scaled WebSocket deployment.
 */
@Injectable()
export class ConnectionManagerService implements OnModuleInit {
  private readonly logger = new Logger(ConnectionManagerService.name);
  private redisClient: Redis;

  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    this.redisClient = this.redisService.getClient();
    this.logger.log('ConnectionManagerService initialized.');
  }

  /**
   * Registers a new WebSocket connection, mapping a user ID to a socket ID.
   * This operation is atomic, using a Redis transaction to ensure consistency.
   * It creates both a forward mapping (user -> set of sockets) and a reverse
   * mapping (socket -> user) for efficient lookups and cleanup.
   *
   * @param {string} userId - The ID of the user who connected.
   * @param {string} socketId - The unique ID of the WebSocket connection.
   * @returns {Promise<void>}
   */
  async registerConnection(userId: string, socketId: string): Promise<void> {
    this.logger.log(
      `Registering connection: userId=${userId}, socketId=${socketId}`,
    );
    try {
      const userSocketsKey = this.getUserSocketsKey(userId);
      const socketUserKey = this.getSocketUserKey(socketId);

      // Use a pipeline (transaction) to ensure atomicity
      const pipeline = this.redisClient.pipeline();
      pipeline.sadd(userSocketsKey, socketId);
      pipeline.set(socketUserKey, userId);
      await pipeline.exec();

      this.logger.log(
        `Successfully registered connection for userId=${userId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to register connection for userId=${userId}, socketId=${socketId}`,
        error.stack,
      );
      // Depending on the desired robustness, you might want to throw this error
      // to let the gateway disconnect the user.
      throw error;
    }
  }

  /**
   * Unregisters a WebSocket connection upon disconnect.
   * This operation is atomic, finding the user associated with the socket and
   * then cleaning up both the forward and reverse mappings in a single transaction.
   *
   * @param {string} socketId - The unique ID of the disconnected WebSocket.
   * @returns {Promise<void>}
   */
  async unregisterConnection(socketId: string): Promise<void> {
    this.logger.log(`Unregistering connection: socketId=${socketId}`);
    try {
      const socketUserKey = this.getSocketUserKey(socketId);
      const userId = await this.redisClient.get(socketUserKey);

      if (!userId) {
        this.logger.warn(
          `Attempted to unregister a socketId (${socketId}) that had no associated user. It might have been already cleaned up.`,
        );
        return;
      }

      const userSocketsKey = this.getUserSocketsKey(userId);

      // Use a pipeline (transaction) to ensure atomicity
      const pipeline = this.redisClient.pipeline();
      pipeline.srem(userSocketsKey, socketId);
      pipeline.del(socketUserKey);
      await pipeline.exec();

      this.logger.log(
        `Successfully unregistered connection for socketId=${socketId} (userId=${userId})`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to unregister connection for socketId=${socketId}`,
        error.stack,
      );
      // Do not rethrow here, as the connection is already closing. Logging is sufficient.
    }
  }

  /**
   * Retrieves all active socket IDs for a given user.
   * This is essential for broadcasting messages to all devices a user is logged into.
   *
   * @param {string} userId - The ID of the user.
   * @returns {Promise<string[]>} A promise that resolves to an array of socket IDs.
   */
  async getUserSockets(userId: string): Promise<string[]> {
    try {
      const userSocketsKey = this.getUserSocketsKey(userId);
      const socketIds = await this.redisClient.smembers(userSocketsKey);
      if (socketIds.length > 0) {
        this.logger.verbose(
          `Found ${socketIds.length} active sockets for userId=${userId}`,
        );
      }
      return socketIds;
    } catch (error) {
      this.logger.error(
        `Failed to get sockets for userId=${userId}`,
        error.stack,
      );
      return []; // Fail safely by returning an empty array
    }
  }

  /**
   * Generates the Redis key for the set of a user's sockets.
   * @param {string} userId
   * @returns {string}
   */
  private getUserSocketsKey(userId: string): string {
    return `${USER_SOCKETS_PREFIX}:${userId}`;
  }

  /**
   * Generates the Redis key for the socket-to-user reverse lookup.
   * @param {string} socketId
   * @returns {string}
   */
  private getSocketUserKey(socketId: string): string {
    return `${SOCKET_USER_PREFIX}:${socketId}`;
  }
}