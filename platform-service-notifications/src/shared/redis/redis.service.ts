import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClient;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis(this.configService.get<string>('REDIS_URL'), {
      maxRetriesPerRequest: null, // Let the client handle retries indefinitely
      enableReadyCheck: false,
    });
  }

  onModuleInit() {
    this.client.on('connect', () => {
      this.logger.log('Successfully connected to Redis.');
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis connection error:', error);
      // In a production environment, this should trigger alerts.
      // The ioredis client will attempt to reconnect automatically.
    });
  }

  async onModuleDestroy() {
    this.logger.log('Closing Redis connection...');
    await this.client.quit();
    this.logger.log('Redis connection closed gracefully.');
  }

  /**
   * Provides access to the underlying ioredis client instance.
   * @returns The ioredis client.
   */
  getClient(): RedisClient {
    return this.client;
  }

  /**
   * A utility function for clearing the Redis cache, often used in e2e tests.
   */
  async flushAll() {
    if (process.env.NODE_ENV !== 'test') {
      this.logger.warn('FLUSHALL command is disabled in non-test environments.');
      return;
    }
    this.logger.log('Flushing all data from Redis for test environment...');
    await this.client.flushall();
    this.logger.log('Redis flushed.');
  }
}