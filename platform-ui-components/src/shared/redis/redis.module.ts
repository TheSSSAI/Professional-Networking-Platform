import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({})
export class RedisModule {
  static register(): DynamicModule {
    const redisProvider = {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService): Redis => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          // Add other Redis options here if needed, e.g., password, db
          maxRetriesPerRequest: null, // Let ioredis handle reconnection logic
          enableReadyCheck: false,
        });
      },
      inject: [ConfigService],
    };

    return {
      module: RedisModule,
      imports: [ConfigModule],
      providers: [redisProvider, RedisService],
      exports: [redisProvider, RedisService],
    };
  }
}