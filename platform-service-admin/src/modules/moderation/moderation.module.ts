import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/shared/infrastructure/prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { GrpcClientsModule } from '../../shared/infrastructure/grpc-clients/grpc-clients.module';
import { TakeModerationActionHandler } from './application/commands/take-moderation-action/take-moderation-action.handler';
import { ContentReportedHandler } from './application/events/content-reported.handler';
import { GetModerationQueueHandler } from './application/queries/get-moderation-queue/get-moderation-queue.handler';
import { ContentReportPrismaRepository } from './infrastructure/repositories/content-report.prisma.repository';
import { ModerationGrpcController } from './presentation/moderation.grpc.controller';
import { ModerationEventsController } from './presentation/moderation.events.controller';

const CommandHandlers = [TakeModerationActionHandler];
const QueryHandlers = [GetModerationQueueHandler];
const EventHandlers = [ContentReportedHandler];
const Services = [];
const Repositories = [
  {
    provide: 'IContentReportRepository',
    useClass: ContentReportPrismaRepository,
  },
];
const Controllers = [ModerationGrpcController, ModerationEventsController];

@Module({
  imports: [CqrsModule, PrismaModule, AuditModule, GrpcClientsModule],
  controllers: [...Controllers],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    ...Services,
    ...Repositories,
  ],
})
export class ModerationModule {}