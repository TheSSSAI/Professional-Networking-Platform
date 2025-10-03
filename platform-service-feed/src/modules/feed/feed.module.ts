import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConnectionsClientModule } from '../../shared/grpc-clients/connections/connections-client.module';
import { RedisModule } from '../../shared/redis/redis.module';
import { FeedController } from './feed.controller';
import { FeedRepository } from './feed.repository';
import { FeedService } from './feed.service';

/**
 * @class FeedModule
 * @description The core feature module for the Feed service.
 * It encapsulates all logic related to feed generation and retrieval, wiring together
 * the gRPC controller, application service, and data repository. It also integrates
 * with external dependencies like the Connections gRPC client and Redis.
 */
@Module({
  imports: [
    ConfigModule,
    ConnectionsClientModule,
    RedisModule,
    // Register the CacheModule to provide an in-memory cache.
    // This is used by FeedService to cache responses from the Connections gRPC service,
    // mitigating performance bottlenecks from repeated network calls for the same user.
    CacheModule.register(),
  ],
  controllers: [
    // Register FeedController to handle incoming gRPC requests for the 'GetFeed' method.
    FeedController,
  ],
  providers: [
    // Provide the FeedService implementation using the IFeedService token.
    // This adheres to the Dependency Inversion Principle, allowing consumers
    // to depend on the interface rather than the concrete implementation.
    {
      provide: 'IFeedService',
      useClass: FeedService,
    },
    // Provide the FeedRepository implementation using the IFeedRepository token.
    // This abstracts the data access logic (Redis) from the application service.
    {
      provide: 'IFeedRepository',
      useClass: FeedRepository,
    },
  ],
  exports: [
    // Export the IFeedService provider. This makes the FeedService available
    // for dependency injection into other modules that import FeedModule,
    // such as the ConsumersModule.
    'IFeedService',
  ],
})
export class FeedModule {}