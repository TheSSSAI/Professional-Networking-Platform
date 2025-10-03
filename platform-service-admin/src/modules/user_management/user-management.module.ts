import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GrpcClientsModule } from '../../shared/infrastructure/grpc-clients/grpc-clients.module';
import { AuditModule } from '../audit/audit.module';
import { TriggerPasswordResetHandler } from './application/commands/trigger-password-reset/trigger-password-reset.handler';
import { SearchUsersAdminHandler } from './application/queries/search-users-admin/search-users-admin.handler';
import { UserManagementGrpcController } from './presentation/user-management.grpc.controller';

const CommandHandlers = [TriggerPasswordResetHandler];
const QueryHandlers = [SearchUsersAdminHandler];
const EventHandlers = [];
const Services = [];
const Repositories = [];
const Controllers = [UserManagementGrpcController];

@Module({
  imports: [CqrsModule, AuditModule, GrpcClientsModule],
  controllers: [...Controllers],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    ...Services,
    ...Repositories,
  ],
})
export class UserManagementModule {}