import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

/**
 * A global module for Redis connectivity.
 * It provides and exports the RedisService, which encapsulates the Redis client instance.
 * Making it global allows any part of the application to inject RedisService
 * without explicitly importing RedisModule, which is useful for cross-cutting concerns
 * like caching, session management, and the Socket.IO backplane.
 * It depends on ConfigModule to retrieve Redis connection details from the environment.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: RedisService,
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        if (!redisUrl) {
          throw new Error('REDIS_URL environment variable not set');
        }
        return new RedisService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}