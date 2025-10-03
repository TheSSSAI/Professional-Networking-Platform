import { Module } from '@nestjs/common';
import { FeedModule } from '../modules/feed/feed.module';
import { PostCreatedConsumer } from './post-created.consumer';

/**
 * @class ConsumersModule
 * @description Encapsulates all background consumers that process asynchronous events.
 * This module is responsible for initializing and providing event-driven entry points to the application.
 */
@Module({
  imports: [
    // Import FeedModule to make IFeedService available for injection into consumers.
    FeedModule,
  ],
  providers: [
    // Register PostCreatedConsumer as a provider to be instantiated by the NestJS dependency injection container.
    // This allows it to run its lifecycle hooks (e.g., OnModuleInit) and consume SQS messages.
    PostCreatedConsumer,
  ],
})
export class ConsumersModule {}