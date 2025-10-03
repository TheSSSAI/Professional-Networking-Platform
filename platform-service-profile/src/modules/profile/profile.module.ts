import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { join } from 'path';

import { ProfileGrpcController } from './presentation/profile.grpc.controller';
import { IProfileRepository } from './domain/interfaces/profile-repository.interface';
import { ProfilePrismaRepository } from './infrastructure/repositories/profile.prisma.repository';

// Infrastructure
import { ProfileCacheService } from './infrastructure/caching/profile-cache.service';
import { SnsEventPublisher } from './infrastructure/event-publishing/sns-event.publisher';
import { ConnectionServiceGrpcClient } from './infrastructure/clients/connection-service.grpc.client';

// Command Handlers
import { AddWorkExperienceHandler } from './application/commands/handlers/add-work-experience.handler';
import { UpdateBasicInfoHandler } from './application/commands/handlers/update-basic-info.handler';
// NOTE: Additional command handlers for Edit/Delete WorkExperience, Add/Edit/Delete Education, Add/Remove Skills, etc. would be added here.
// For brevity and based on provided files, only a representative set is included. A full implementation would list all of them.

// Query Handlers
import { GetProfileHandler } from './application/queries/handlers/get-profile.handler';

// Services
import { MediaService } from './application/services/media.service';
import { LinkPreviewFetcherService } from './domain/services/link-preview-fetcher.service';

// Subscribers
import { UserRegisteredSubscriber } from './application/subscribers/user-registered.subscriber';

// Guards & Interceptors
import { ProfileOwnerGuard } from './presentation/guards/profile-owner.guard';
import { CacheInvalidationInterceptor } from './presentation/interceptors/cache-invalidation.interceptor';

// Shared/Core Modules (Assuming they exist at a higher level, imported into AppModule)
import { PrismaService } from '../../../prisma/prisma.service';
import { IEventPublisher } from './domain/interfaces/event-publisher.interface';

const CommandHandlers = [AddWorkExperienceHandler, UpdateBasicInfoHandler];
const QueryHandlers = [GetProfileHandler];
const EventSubscribers = [UserRegisteredSubscriber];
const InfrastructureServices = [
  ProfileCacheService,
  ConnectionServiceGrpcClient,
];
const ApplicationServices = [MediaService];
const DomainServices = [LinkPreviewFetcherService];

@Module({
  imports: [
    ConfigModule,
    CqrsModule,
    EventEmitterModule.forRoot(),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // Assuming Redis config is in environment variables
        // This setup is more robust than a static configuration.
        // E.g., REDIS_HOST, REDIS_PORT, REDIS_TTL
        // For now, using default values if not set.
        ttl: configService.get<number>('REDIS_TTL', 3600),
        // Add other redis options here like host, port if needed
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'CONNECTION_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'connection',
            protoPath: join(
              process.cwd(),
              'proto/connection.proto', // Assuming connection.proto exists
            ),
            url: configService.get<string>('CONNECTION_SERVICE_URL'),
          },
        }),
      },
    ]),
  ],
  controllers: [ProfileGrpcController],
  providers: [
    PrismaService, // Assuming PrismaService is a global or shared provider
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventSubscribers,
    ...InfrastructureServices,
    ...ApplicationServices,
    ...DomainServices,
    {
      provide: IProfileRepository,
      useClass: ProfilePrismaRepository,
    },
    {
      provide: IEventPublisher,
      useClass: SnsEventPublisher,
    },
    // Guards and Interceptors are often provided at the controller/method level,
    // but can be provided here if needed globally within the module.
    ProfileOwnerGuard,
    CacheInvalidationInterceptor,
  ],
  exports: [
    // This service does not need to export anything for other modules within the same microservice.
    // Its functionality is exposed via gRPC.
  ],
})
export class ProfileModule {}