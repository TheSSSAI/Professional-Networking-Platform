import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthGrpcController } from './presentation/auth.grpc.controller';

// Domain
import { PasswordDomainService } from './domain/services/password.domain-service';
import { IHashingService } from './domain/interfaces/hashing.service.interface';
import { ITokenBlocklistService } from './domain/interfaces/token-blocklist.service.interface';
import { IUnitOfWork } from './domain/interfaces/unit-of-work.interface';
import { IUserRepository } from './domain/interfaces/user.repository.interface';
import { IEventPublisher as IDomainEventPublisher } from 'src/shared/interfaces/event-publisher.interface';

// Application - Use Cases
import { RegisterUserHandler } from './application/use-cases/register-user/register-user.handler';
import { LoginUserHandler } from './application/use-cases/login-user/login-user.handler';
import { LogoutUserHandler } from './application/use-cases/logout-user/logout-user.handler';
import { ValidateTokenHandler } from './application/use-cases/validate-token/validate-token.handler';
import { RefreshTokenHandler } from './application/use-cases/refresh-token/refresh-token.handler';
import { VerifyEmailHandler } from './application/use-cases/verify-email/verify-email.handler';
import { RequestPasswordResetHandler } from './application/use-cases/request-password-reset/request-password-reset.handler';
import { ResetPasswordHandler } from './application/use-cases/reset-password/reset-password.handler';
import { EnableMfaHandler } from './application/use-cases/enable-mfa/enable-mfa.handler';
import { VerifyMfaHandler } from './application/use-cases/verify-mfa/verify-mfa.handler';

// Infrastructure
import { BcryptService } from './infrastructure/services/bcrypt.service';
import { RedisTokenBlocklistService } from './infrastructure/services/redis-token-blocklist.service';
import { EventPublisherService } from './infrastructure/services/event-publisher.service';
import { UserPrismaRepository } from './infrastructure/repositories/user.prisma.repository';
import { PrismaUnitOfWork } from './infrastructure/repositories/prisma.unit-of-work';

// Configuration
import jwtConfig from 'src/config/jwt.config';

const CommandHandlers = [
  RegisterUserHandler,
  LoginUserHandler,
  LogoutUserHandler,
  RefreshTokenHandler,
  VerifyEmailHandler,
  RequestPasswordResetHandler,
  ResetPasswordHandler,
  EnableMfaHandler,
  VerifyMfaHandler,
];

const QueryHandlers = [ValidateTokenHandler];

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.accessExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthGrpcController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    PasswordDomainService,
    {
      provide: IUserRepository,
      useClass: UserPrismaRepository,
    },
    {
      provide: IHashingService,
      useClass: BcryptService,
    },
    {
      provide: ITokenBlocklistService,
      useClass: RedisTokenBlocklistService,
    },
    {
      provide: IDomainEventPublisher,
      useClass: EventPublisherService,
    },
    {
      provide: IUnitOfWork,
      useClass: PrismaUnitOfWork,
    },
  ],
})
export class AuthModule {}