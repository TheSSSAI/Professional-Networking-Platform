import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient } from 'ioredis';

/**
 * @class RedisService
 * @description A service that provides and manages a singleton instance of the ioredis client.
 * It implements NestJS lifecycle hooks to handle the connection lifecycle gracefully.
 * It retrieves connection details from the environment via ConfigService to ensure
 * security and portability. It also includes robust logging for connection events,
 * which is crucial for monitoring and debugging in a production environment.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private _client: RedisClient;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.error('REDIS_URL is not defined in the environment variables.');
      throw new Error('REDIS_URL is not defined.');
    }

    this._client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      // Add other options as needed for production, e.g., TLS
    });

    this.logger.log('RedisService initialized and client created.');
  }

  /**
   * @method onModuleInit
   * @description NestJS lifecycle hook that sets up listeners for Redis client events.
   * ioredis connects automatically, so this hook is used for logging and monitoring
   * the connection status.
   */
  onModuleInit() {
    this.logger.log('Setting up Redis client event listeners...');

    this._client.on('connect', () => {
      this.logger.log('Successfully connected to Redis.');
    });

    this._client.on('error', (error) => {
      this.logger.error('Redis client error:', error.stack);
      // In a production scenario, this might trigger a health check failure
      // or an alert to an operations team.
    });

    this._client.on('reconnecting', () => {
      this.logger.warn('Redis client is reconnecting...');
    });

    this._client.on('close', () => {
      this.logger.warn('Redis connection has been closed.');
    });
  }

  /**
   * @method onModuleDestroy
   * @description NestJS lifecycle hook that gracefully disconnects the Redis client
   * when the application is shutting down.
   */
  async onModuleDestroy() {
    this.logger.log('Disconnecting Redis client...');
    if (this._client) {
      // 'quit' waits for pending replies, 'disconnect' does not.
      // 'quit' is safer for graceful shutdown.
      await this._client.quit();
      this.logger.log('Redis client disconnected successfully.');
    }
  }

  /**
   * @method getClient
   * @description Provides access to the underlying ioredis client instance.
   * This is useful for parts of the application that need direct access to Redis commands,
   * such as the Socket.IO Redis adapter.
   * @returns {RedisClient} The ioredis client instance.
   */
  public getClient(): RedisClient {
    return this._client;
  }

  /**
   * @getter client
   * @description Public getter for the Redis client instance.
   */
  public get client(): RedisClient {
    return this._client;
  }
}