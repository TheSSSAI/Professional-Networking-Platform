import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessagingModule } from './modules/messaging/messaging.module';
import { PrismaModule } from './shared/database/prisma.module';
import { RedisModule } from './shared/redis/redis.module';

/**
 * The root module of the Messaging Service application.
 *
 * This module is the composition root that assembles all feature modules
 * and shared infrastructure modules into a single application.
 *
 * It imports:
 * - ConfigModule: For managing environment variables, configured to be global.
 * - PrismaModule: Provides the PrismaClient for database interactions throughout the app.
 * - RedisModule: Provides the Redis client for caching and WebSocket state management.
 * - MessagingModule: The core feature module containing all business logic for messaging.
 */
@Module({
  imports: [
    // Configure environment variables to be available globally
    ConfigModule.forRoot({
      isGlobal: true,
      // Optionally, specify a path to a .env file
      // envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // Shared infrastructure modules
    PrismaModule,
    RedisModule,

    // Feature module
    MessagingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}