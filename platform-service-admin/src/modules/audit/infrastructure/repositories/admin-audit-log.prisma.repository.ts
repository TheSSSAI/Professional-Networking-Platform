import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IAdminAuditLogRepository } from '../../domain/interfaces/admin-audit-log.repository';
import { AdminAuditLog } from '../../domain/entities/admin-audit-log.entity';
import { AdminActionType } from '../../domain/enums/admin-action-type.enum';

/**
 * Prisma-based implementation of the IAdminAuditLogRepository.
 * Handles the persistence and retrieval of AdminAuditLog entities.
 */
@Injectable()
export class AdminAuditLogPrismaRepository implements IAdminAuditLogRepository {
  private readonly logger = new Logger(AdminAuditLogPrismaRepository.name);

  // In a real application, PrismaClient would be provided by a shared PrismaModule.
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Creates a new audit log entry.
   * This repository intentionally does not provide update or delete methods
   * to enforce immutability at the application layer.
   * @param logEntry The AdminAuditLog domain entity to persist.
   */
  async create(logEntry: AdminAuditLog): Promise<void> {
    try {
      await this.prisma.adminAuditLog.create({
        data: {
          id: logEntry.id,
          adminId: logEntry.adminId,
          actionType: logEntry.actionType,
          targetId: logEntry.targetId,
          targetType: logEntry.targetType,
          reason: logEntry.reason,
          details: logEntry.details || {}, // Ensure details is not undefined
          timestamp: logEntry.timestamp,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to create admin audit log for admin ${logEntry.adminId}`,
        error.stack,
      );
      // Re-throw to allow transactional rollbacks in the calling service
      throw new Error('Database error while creating audit log.');
    }
  }

  /**
   * Finds audit log entries with pagination.
   * @param options Pagination and filtering options.
   * @returns A paginated list of AdminAuditLog entities.
   */
  async find(options: {
    page: number;
    limit: number;
    adminId?: string;
    actionType?: AdminActionType;
  }): Promise<{ data: AdminAuditLog[]; total: number }> {
    const { page, limit, adminId, actionType } = options;
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (adminId) {
      whereClause.adminId = adminId;
    }
    if (actionType) {
      whereClause.actionType = actionType;
    }

    try {
      const [logs, total] = await this.prisma.$transaction([
        this.prisma.adminAuditLog.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: {
            timestamp: 'desc',
          },
        }),
        this.prisma.adminAuditLog.count({ where: whereClause }),
      ]);

      const domainLogs = logs.map(
        (log) =>
          new AdminAuditLog(
            log.id,
            log.adminId,
            log.actionType as AdminActionType,
            log.targetId,
            log.targetType,
            log.timestamp,
            log.reason,
            log.details as object,
          ),
      );

      return { data: domainLogs, total };
    } catch (error) {
      this.logger.error('Failed to find admin audit logs', error.stack);
      throw new Error('Database error while finding audit logs.');
    }
  }
}