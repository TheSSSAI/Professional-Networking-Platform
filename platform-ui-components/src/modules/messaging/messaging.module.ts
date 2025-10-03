import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { MessagingGateway } from './gateways/messaging.gateway';
import { MessagingService } from './services/messaging.service';
import { ConnectionManagerService } from './services/connection-manager.service';
import { MessagingGrpcController } from './controllers/messaging.grpc.controller';
import { PrismaMessageRepository } from './repositories/message.prisma.repository';
import { ConnectionGuard } from './guards/connection.guard';

import { RedisModule } from '../../shared/redis/redis.module';
import { ConnectionsClientModule } from '../../shared/grpc-clients/connections/connections-client.module';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
    // RedisModule is global, but explicit import is also fine for clarity
    RedisModule.register(),
    ConnectionsClientModule,
  ],
  controllers: [MessagingGrpcController],
  providers: [
    MessagingGateway,
    MessagingService,
    ConnectionManagerService,
    ConnectionGuard,
    PrismaService,
    {
      provide: 'IMessageRepository',
      useClass: PrismaMessageRepository,
    },
  ],
  exports: [MessagingService],
})
export class MessagingModule {}