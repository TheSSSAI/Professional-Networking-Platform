import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConnectionsClientModule } from 'src/shared/grpc-clients/connections/connections-client.module.ts';
import { ConversationsController } from './controllers/conversations.controller';
import { MessagingGateway } from './gateways/messaging.gateway';
import { ConnectionAuthGuard } from './guards/connection-auth.guard';
import { ConversationPrismaRepository } from './repositories/conversation.prisma.repository';
import { IConversationRepository } from './repositories/conversation.repository.interface';
import { MessagePrismaRepository } from './repositories/message.prisma.repository';
import { IMessageRepository } from './repositories/message.repository.interface';
import { ConnectionManagerService } from './services/connection-manager.service';
import { MessagingService } from './services/messaging.service';

/**
 * The main feature module for the Messaging service.
 * It encapsulates all related components: gateways, controllers, services, repositories, and guards.
 *
 * Imports:
 * - ConnectionsClientModule: To provide the gRPC client for authorization checks.
 * - JwtModule: To provide JwtService for authenticating WebSocket connections.
 *
 * Providers:
 * - MessagingGateway: The main WebSocket gateway for real-time communication.
 * - MessagingService: Core business logic for messaging.
 * - ConnectionManagerService: Manages user-to-socket mappings in Redis.
 * - ConnectionAuthGuard: Secures WebSocket events by checking connection status.
 * - Repository Implementations: Binds repository interfaces (IMessageRepository, IConversationRepository)
 *   to their concrete Prisma implementations.
 *
 * Controllers:
 * - ConversationsController: Exposes gRPC endpoints for fetching message history.
 */
@Module({
  imports: [
    ConnectionsClientModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ConversationsController],
  providers: [
    MessagingGateway,
    MessagingService,
    ConnectionManagerService,
    ConnectionAuthGuard,
    {
      provide: IMessageRepository,
      useClass: MessagePrismaRepository,
    },
    {
      provide: IConversationRepository,
      useClass: ConversationPrismaRepository,
    },
  ],
})
export class MessagingModule {}