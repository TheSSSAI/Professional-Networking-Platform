import { Global, Module } from '@nestjs/common';
import { RedisProvider } from './redis.provider';

/**
 * A global module that provides and exports the Redis client instance.
 * By making it global, any module in the application can inject the Redis client
 * without needing to import RedisModule explicitly. This is ideal for a shared,
 * cross-cutting concern like a database connection.
 */
@Global()
@Module({
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {}