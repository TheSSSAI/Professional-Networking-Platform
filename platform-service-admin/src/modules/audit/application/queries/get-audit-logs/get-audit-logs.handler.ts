import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAuditLogsQuery } from './get-audit-logs.query';
import { Inject } from '@nestjs/common';
import { IAdminAuditLogRepository } from '../../../domain/interfaces/admin-audit-log.repository';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export interface AuditLogDto {
  id: string;
  adminId: string;
  actionType: string;
  targetId: string;
  targetType: string;
  reason: string | null;
  details: Record<string, any>;
  timestamp: string;
}

export interface GetAuditLogsResponse {
  logs: AuditLogDto[];
  total: number;
  page: number;
  limit: number;
}

@QueryHandler(GetAuditLogsQuery)
export class GetAuditLogsHandler
  implements IQueryHandler<GetAuditLogsQuery, GetAuditLogsResponse>
{
  constructor(
    @Inject(IAdminAuditLogRepository)
    private readonly auditLogRepository: IAdminAuditLogRepository,
  ) {}

  async execute(query: GetAuditLogsQuery): Promise<GetAuditLogsResponse> {
    try {
      const { page, limit, adminId, actionType, targetId } = query;

      const paginatedResult = await this.auditLogRepository.findManyPaginated({
        page,
        limit,
        filters: {
          adminId,
          actionType,
          targetId,
        },
      });

      const logsDto = paginatedResult.data.map(
        (log): AuditLogDto => ({
          id: log.id,
          adminId: log.adminId,
          actionType: log.actionType,
          targetId: log.targetId,
          targetType: log.targetType,
          reason: log.reason,
          details: log.details,
          timestamp: log.timestamp.toISOString(),
        }),
      );

      return {
        logs: logsDto,
        total: paginatedResult.total,
        page: paginatedResult.page,
        limit: paginatedResult.limit,
      };
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'An error occurred while fetching audit logs.',
      });
    }
  }
}