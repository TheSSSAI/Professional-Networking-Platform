import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/shared/infrastructure/prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { UpdateFeatureFlagHandler } from './application/commands/update-feature-flag/update-feature-flag.handler';
import { GetFeatureFlagsHandler } from './application/queries/get-feature-flags/get-feature-flags.handler';
import { FeatureFlagPrismaRepository } from './infrastructure/repositories/feature-flag.prisma.repository';
import { ConfigurationGrpcController } from './presentation/configuration.grpc.controller';

const CommandHandlers = [UpdateFeatureFlagHandler];
const QueryHandlers = [GetFeatureFlagsHandler];
const EventHandlers = [];
const Services = [];
const Repositories = [
  {
    provide: 'IFeatureFlagRepository',
    useClass: FeatureFlagPrismaRepository,
  },
];
const Controllers = [ConfigurationGrpcController];

@Module({
  imports: [CqrsModule, PrismaModule, AuditModule],
  controllers: [...Controllers],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    ...Services,
    ...Repositories,
  ],
})
export class ConfigurationModule {}