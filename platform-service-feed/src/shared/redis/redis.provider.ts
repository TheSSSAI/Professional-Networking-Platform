import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

/**
 * A custom NestJS provider for creating and configuring the Redis client.
 *
 * This provider uses a factory to instantiate the `ioredis` client,
 * ensuring that the connection details are sourced from the application's
 * configuration service. It also sets up logging for key connection events
 * (`connect`, `error`), providing observability into the state of this
 * critical infrastructure dependency.
 *
 * The created client instance is provided under the `REDIS_CLIENT` token,
 * making it injectable into any service or repository that needs to
 * interact with Redis.
 */
export const redisProvider: FactoryProvider<Redis> = {
  provide: REDIS_CLIENT,
  useFactory: async (configService: ConfigService): Promise<Redis> => {
    const logger = new Logger('RedisProvider');
    const redisUrl = configService.get<string>('REDIS_URL');

    if (!redisUrl) {
      logger.error('REDIS_URL is not defined in the configuration.');
      throw new Error('REDIS_URL is not defined in the configuration.');
    }

    const client = new Redis(redisUrl, {
      // Recommended settings for production environments
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      // Add other ioredis options as needed
    });

    client.on('connect', () => {
      logger.log('Successfully connected to Redis.');
    });

    client.on('error', (error) => {
      logger.error('Failed to connect to Redis.', error.stack);
      // In a real-world scenario, you might want to gracefully shut down the app
      // or implement more sophisticated health checks if the Redis connection is critical.
    });

    try {
      // Ping the server to ensure the connection is established on startup.
      await client.ping();
      logger.log('Redis ping successful.');
    } catch (error) {
      logger.error('Initial Redis ping failed.', error.stack);
      // Depending on the application's requirements, you might want to throw here
      // to prevent the application from starting without a valid Redis connection.
      throw new Error(`Could not establish initial connection to Redis: ${error.message}`);
    }

    return client;
  },
  inject: [ConfigService],
};