import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';

/**
 * A global module for Redis connectivity.
 * It provides and exports the RedisService, which encapsulates the Redis client instance.
 * By marking it as @Global(), the RedisService is available for injection
 * throughout the application, simplifying access to Redis for caching,
 * session management, and WebSocket state management.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}