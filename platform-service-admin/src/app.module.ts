import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { GrpcClientsModule } from './shared/infrastructure/grpc-clients/grpc-clients.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { AuditModule } from './modules/audit/audit.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { UserManagementModule } from './modules/user_management/user-management.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        ADMIN_SERVICE_PORT: Joi.number().default(5001),
        DATABASE_URL: Joi.string().required(),
        IDENTITY_SERVICE_URL: Joi.string().required(),
        POSTS_SERVICE_URL: Joi.string().required(),
        RABBITMQ_URL: Joi.string().required(),
        RABBITMQ_CONTENT_REPORTED_QUEUE: Joi.string().required(),
      }),
    }),
    CqrsModule.forRoot(),
    PrismaModule.forRoot(),
    GrpcClientsModule,
    ModerationModule,
    AuditModule,
    ConfigurationModule,
    UserManagementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}