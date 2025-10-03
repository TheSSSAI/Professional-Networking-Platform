import { ContentReport } from '../entities/content-report.entity';

export interface PaginatedContentReportResult {
  reports: ContentReport[];
  total: number;
}

/**
 * Interface for the ContentReport repository (Port in Clean Architecture).
 * It defines the contract for data persistence operations related to content reports
 * in the moderation queue.
 *
 * Fulfills REQ-1-041.
 */
export interface ContentReportRepository {
  /**
   * Finds a content report by its unique identifier.
   * @param id The unique ID of the report.
   * @returns A promise that resolves to the ContentReport entity or null if not found.
   */
  findById(id: string): Promise<ContentReport | null>;

  /**
   * Saves a content report entity. This can be used for both creation and updates.
   * @param report The ContentReport domain entity to save.
   * @returns A promise that resolves when the operation is complete.
   */
  save(report: ContentReport): Promise<void>;

  /**
   * Retrieves a paginated and sorted list of content reports, typically for the moderation queue.
   * @param options - Options for pagination and sorting.
   * @param options.page - The page number to retrieve.
   * @param options.limit - The number of items per page.
   * @param options.sortBy - The field to sort by.
   * @param options.sortOrder - The sort order ('asc' or 'desc').
   * @returns A promise that resolves to a paginated result of content reports.
   */
  findManyPaginated(options: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<PaginatedContentReportResult>;
}