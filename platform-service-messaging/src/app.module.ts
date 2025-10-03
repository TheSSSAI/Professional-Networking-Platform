import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './shared/database/prisma.module';
import { RedisModule } from './shared/redis/redis.module';
import { MessagingModule } from './modules/messaging/messaging.module';

/**
 * The root module of the application.
 *
 * It composes the application by importing all necessary modules:
 * - ConfigModule: For environment variable management. It's configured to be global.
 * - ThrottlerModule: For global rate limiting to protect against abuse.
 * - PrismaModule: The global module for database access.
 * - RedisModule: The global module for Redis access.
 * - MessagingModule: The primary feature module for this microservice.
 *
 * It also provides the ThrottlerGuard globally to enforce rate limiting on all endpoints by default.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    PrismaModule,
    RedisModule,
    MessagingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}