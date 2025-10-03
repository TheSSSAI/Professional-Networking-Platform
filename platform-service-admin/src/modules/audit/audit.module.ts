import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/shared/infrastructure/prisma/prisma.module';
import { GetAuditLogsHandler } from './application/queries/get-audit-logs/get-audit-logs.handler';
import { AuditService } from './application/services/audit.service';
import { AdminAuditLogPrismaRepository } from './infrastructure/repositories/admin-audit-log.prisma.repository';
import { AuditGrpcController } from './presentation/audit.grpc.controller';

const CommandHandlers = [];
const QueryHandlers = [GetAuditLogsHandler];
const EventHandlers = [];
const Services = [AuditService];
const Repositories = [
  {
    provide: 'IAdminAuditLogRepository',
    useClass: AdminAuditLogPrismaRepository,
  },
];
const Controllers = [AuditGrpcController];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [...Controllers],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    ...Services,
    ...Repositories,
  ],
  exports: [AuditService],
})
export class AuditModule {}