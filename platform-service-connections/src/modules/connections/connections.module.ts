import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { SNSClient } from '@aws-sdk/client-sns';

import { PrismaService } from '../../../prisma/prisma.service';
import { ConnectionsGrpcController } from './presentation/connections.grpc.controller';

// Guards
import { ConnectionActionGuard } from './presentation/guards/connection-action.guard';

// Command Handlers
import { AcceptRequestCommandHandler } from './application/commands/handlers/accept-request.handler';
import { RemoveConnectionCommandHandler } from './application/commands/handlers/remove-connection.handler';
import { SendRequestCommandHandler } from './application/commands/handlers/send-request.handler';
import { DeclineRequestCommandHandler } from './application/commands/handlers/decline-request.handler';

// Query Handlers
import { GetConnectionsQueryHandler } from './application/queries/handlers/get-connections.handler';
import { IsConnectedQueryHandler } from './application/queries/handlers/is-connected.handler';
import { GetPendingRequestsQueryHandler } from './application/queries/handlers/get-pending-requests.handler';

// Repositories
import { ConnectionPrismaRepository } from './infrastructure/repositories/connection.prisma.repository';
import { ConnectionRedisRepository } from './infrastructure/repositories/connection.redis.repository';

// Publishers
import { SnsEventPublisher } from './infrastructure/publishers/sns-event.publisher';

// DI Tokens
import { IConnectionRepository } from './domain/interfaces/connection.repository.interface';
import { IConnectionCacheRepository } from './domain/interfaces/connection-cache.repository.interface';
import { IEventPublisherPort } from './domain/interfaces/event-publisher.port.interface';
import { REDIS_CLIENT, SNS_CLIENT } from '../../../shared/constants';

const commandHandlers = [
  AcceptRequestCommandHandler,
  DeclineRequestCommandHandler,
  RemoveConnectionCommandHandler,
  SendRequestCommandHandler,
];

const queryHandlers = [
  GetConnectionsQueryHandler,
  IsConnectedQueryHandler,
  GetPendingRequestsQueryHandler,
];

const infrastructureProviders: Provider[] = [
  PrismaService,
  {
    provide: IConnectionRepository,
    useClass: ConnectionPrismaRepository,
  },
  {
    provide: IConnectionCacheRepository,
    useClass: ConnectionRedisRepository,
  },
  {
    provide: IEventPublisherPort,
    useClass: SnsEventPublisher,
  },
];

const factoryProviders: Provider[] = [
  {
    provide: REDIS_CLIENT,
    useFactory: (configService: ConfigService) => {
      const redisUrl = configService.get<string>('REDIS_URL');
      if (!redisUrl) {
        throw new Error('REDIS_URL is not defined in environment variables');
      }
      return new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      });
    },
    inject: [ConfigService],
  },
  {
    provide: SNS_CLIENT,
    useFactory: (configService: ConfigService) => {
      const region = configService.get<string>('AWS_REGION');
      const endpoint = configService.get<string>('AWS_SNS_ENDPOINT'); // For localstack
      if (!region) {
        throw new Error('AWS_REGION is not defined in environment variables');
      }
      return new SNSClient({
        region,
        ...(endpoint && { endpoint }), // Use endpoint if defined (for local development)
      });
    },
    inject: [ConfigService],
  },
];

@Module({
  imports: [CqrsModule, ConfigModule],
  controllers: [ConnectionsGrpcController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...infrastructureProviders,
    ...factoryProviders,
    ConnectionActionGuard,
  ],
})
export class ConnectionsModule {}