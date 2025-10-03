import { AdminAuditLog } from '../entities/admin-audit-log.entity';

export interface PaginatedAuditLogResult {
  logs: AdminAuditLog[];
  total: number;
}

/**
 * Interface for the AdminAuditLog repository (Port in Clean Architecture).
 * It defines the contract for data persistence operations related to audit logs,
 * enforcing an append-only pattern by only exposing a `create` method for writes.
 *
 * Fulfills REQ-1-044.
 */
export interface AdminAuditLogRepository {
  /**
   * Creates and persists a new audit log entry.
   * @param logEntry The AdminAuditLog domain entity to persist.
   * @returns A promise that resolves when the operation is complete.
   */
  create(logEntry: AdminAuditLog): Promise<void>;

  /**
   * Retrieves a paginated list of audit log entries.
   * @param options - Pagination options.
   * @param options.page - The page number to retrieve.
   * @param options.limit - The number of items per page.
   * @returns A promise that resolves to a paginated result of audit logs.
   */
  findManyPaginated(options: {
    page: number;
    limit: number;
  }): Promise<PaginatedAuditLogResult>;
}