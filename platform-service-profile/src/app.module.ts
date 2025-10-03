import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { ProfileModule } from '@modules/profile/profile.module';
import databaseConfig from './config/database.config';
import awsConfig from './config/aws.config';
import cacheConfig from './config/cache.config';
import grpcConfig from './config/grpc.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, awsConfig, cacheConfig, grpcConfig],
      // Add validation schema if needed using Joi
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: configService.get<string>('cache.redisUrl'),
          ttl: configService.get<number>('cache.ttl'),
        }),
      }),
    }),
    EventEmitterModule.forRoot(),
    ProfileModule,
    // Other global modules like a HealthModule could be imported here
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}