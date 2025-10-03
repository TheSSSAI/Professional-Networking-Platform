import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../../shared/redis/redis.service';

@Injectable()
export class ConnectionManagerService {
  private readonly logger = new Logger(ConnectionManagerService.name);
  private readonly USER_SOCKETS_PREFIX = 'user:sockets:';
  private readonly SOCKET_USER_PREFIX = 'socket:user:';

  constructor(private readonly redisService: RedisService) {}

  /**
   * Registers a new socket connection for a user.
   * Creates a two-way mapping:
   * 1. A set of socket IDs for the user (user -> [sockets...])
   * 2. A key-value pair for the socket ID to the user ID (socket -> user)
   * @param userId The ID of the user connecting.
   * @param socketId The ID of the new socket connection.
   */
  async registerConnection(userId: string, socketId: string): Promise<void> {
    try {
      const userSocketsKey = `${this.USER_SOCKETS_PREFIX}${userId}`;
      const socketUserKey = `${this.SOCKET_USER_PREFIX}${socketId}`;

      const multi = this.redisService.getClient().multi();
      multi.sadd(userSocketsKey, socketId);
      multi.set(socketUserKey, userId);

      await multi.exec();
      this.logger.log(`Registered connection: userId=${userId}, socketId=${socketId}`);
    } catch (error) {
      this.logger.error(`Failed to register connection for userId=${userId}, socketId=${socketId}`, error.stack);
      // We don't re-throw as a connection failure shouldn't crash the gateway connection handler
    }
  }

  /**
   * Unregisters a socket connection upon disconnect.
   * Atomically removes the two-way mapping created during registration.
   * @param socketId The ID of the disconnected socket.
   */
  async unregisterConnection(socketId: string): Promise<void> {
    const socketUserKey = `${this.SOCKET_USER_PREFIX}${socketId}`;
    try {
      const userId = await this.redisService.getClient().get(socketUserKey);

      if (!userId) {
        this.logger.warn(`Could not find userId for disconnected socketId=${socketId}. It might have already been cleaned up.`);
        return;
      }

      const userSocketsKey = `${this.USER_SOCKETS_PREFIX}${userId}`;
      const multi = this.redisService.getClient().multi();
      multi.srem(userSocketsKey, socketId);
      multi.del(socketUserKey);

      await multi.exec();
      this.logger.log(`Unregistered connection: userId=${userId}, socketId=${socketId}`);
    } catch (error) {
      this.logger.error(`Failed to unregister connection for socketId=${socketId}`, error.stack);
    }
  }

  /**
   * Retrieves all active socket IDs for a given user.
   * @param userId The ID of the user.
   * @returns A promise that resolves to an array of socket IDs.
   */
  async getUserSocketIds(userId: string): Promise<string[]> {
    try {
      const userSocketsKey = `${this.USER_SOCKETS_PREFIX}${userId}`;
      const socketIds = await this.redisService.getClient().smembers(userSocketsKey);
      return socketIds || [];
    } catch (error) {
      this.logger.error(`Failed to get socket IDs for userId=${userId}`, error.stack);
      return [];
    }
  }

  /**
   * Retrieves the user ID associated with a given socket ID.
   * @param socketId The ID of the socket.
   * @returns A promise that resolves to the user ID, or null if not found.
   */
  async getUserIdFromSocketId(socketId: string): Promise<string | null> {
    try {
      const socketUserKey = `${this.SOCKET_USER_PREFIX}${socketId}`;
      return await this.redisService.getClient().get(socketUserKey);
    } catch (error) {
      this.logger.error(`Failed to get userId for socketId=${socketId}`, error.stack);
      return null;
    }
  }
}