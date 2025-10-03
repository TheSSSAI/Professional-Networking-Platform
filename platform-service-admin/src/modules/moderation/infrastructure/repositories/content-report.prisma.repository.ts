import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, ContentReport as PrismaContentReport } from '@prisma/client';
import { IContentReportRepository } from '../../domain/interfaces/content-report.repository';
import { ContentReport } from '../../domain/entities/content-report.entity';
import { ReportStatus } from '../../domain/enums/report-status.enum';

/**
 * Prisma-based implementation of the IContentReportRepository.
 * Handles persistence and retrieval of ContentReport entities for the moderation queue.
 */
@Injectable()
export class ContentReportPrismaRepository implements IContentReportRepository {
  private readonly logger = new Logger(ContentReportPrismaRepository.name);

  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(prismaReport: PrismaContentReport): ContentReport {
    // Assuming the 'reports' JSONB field in Prisma maps to the 'reports' property in the domain entity.
    return new ContentReport(
      prismaReport.id,
      prismaReport.contentId,
      prismaReport.contentType,
      prismaReport.status as ReportStatus,
      prismaReport.reports as any, // This would need a proper type from domain
      prismaReport.createdAt,
      prismaReport.updatedAt,
    );
  }

  /**
   * Finds a content report by its unique ID.
   * @param id The unique identifier of the content report.
   * @returns A ContentReport domain entity or null if not found.
   */
  async findById(id: string): Promise<ContentReport | null> {
    try {
      const prismaReport = await this.prisma.contentReport.findUnique({
        where: { id },
      });
      return prismaReport ? this.toDomain(prismaReport) : null;
    } catch (error) {
      this.logger.error(`Failed to find content report by ID: ${id}`, error.stack);
      throw new Error('Database error while finding content report.');
    }
  }
  
  /**
   * Creates a new content report entry in the database.
   * @param report The ContentReport domain entity to persist.
   */
  async create(report: ContentReport): Promise<void> {
    try {
      await this.prisma.contentReport.create({
        data: {
          id: report.id,
          contentId: report.contentId,
          contentType: report.contentType,
          status: report.status,
          reports: report.reports,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create content report for content ID: ${report.contentId}`, error.stack);
      throw new Error('Database error while creating content report.');
    }
  }

  /**
   * Updates an existing content report in the database.
   * @param report The updated ContentReport domain entity to persist.
   */
  async update(report: ContentReport): Promise<void> {
    try {
      await this.prisma.contentReport.update({
        where: { id: report.id },
        data: {
          status: report.status,
          reports: report.reports,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
          throw new Error(`Content report with ID '${report.id}' not found.`);
      }
      this.logger.error(`Failed to update content report: ${report.id}`, error.stack);
      throw new Error('Database error while updating content report.');
    }
  }

  /**
   * Finds a paginated list of content reports, typically for the moderation queue.
   * @param options Pagination and sorting options.
   * @returns A paginated list of ContentReport entities.
   */
  async findManyPaginated(options: {
    page: number;
    limit: number;
    status: ReportStatus;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }): Promise<{ data: ContentReport[]; total: number }> {
    const { page, limit, status, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;

    try {
      const whereClause = { status };
      
      const [reports, total] = await this.prisma.$transaction([
        this.prisma.contentReport.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        this.prisma.contentReport.count({ where: whereClause }),
      ]);
      
      const domainReports = reports.map(this.toDomain);
      return { data: domainReports, total };

    } catch (error) {
        this.logger.error('Failed to find paginated content reports', error.stack);
        throw new Error('Database error while fetching moderation queue.');
    }
  }
}