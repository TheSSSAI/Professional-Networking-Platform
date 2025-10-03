import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '../../shared/database/prisma.module';
import { RedisModule } from '../../shared/redis/redis.module';
import { ConnectionsClientModule } from '../../shared/grpc-clients/connections-client.module';

import { MessagingController } from './controllers/messaging.controller';
import { MessagingGateway } from './gateways/messaging.gateway';
import { MessagingService } from './services/messaging.service';
import { ConnectionManagerService } from './services/connection-manager.service';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { ConnectionGuard } from './guards/connection.guard';
import { IMessageRepository } from './repositories/message.repository.interface';
import { MessagePrismaRepository } from './repositories/message.prisma.repository';
import { IConversationRepository } from './repositories/conversation.repository.interface';
import { ConversationPrismaRepository } from './repositories/conversation.prisma.repository';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    ConnectionsClientModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MessagingController],
  providers: [
    MessagingGateway,
    MessagingService,
    ConnectionManagerService,
    WsJwtGuard,
    ConnectionGuard,
    {
      provide: 'IMessageRepository',
      useClass: MessagePrismaRepository,
    },
    {
      provide: 'IConversationRepository',
      useClass: ConversationPrismaRepository,
    },
  ],
  exports: [MessagingService],
})
export class MessagingModule {}