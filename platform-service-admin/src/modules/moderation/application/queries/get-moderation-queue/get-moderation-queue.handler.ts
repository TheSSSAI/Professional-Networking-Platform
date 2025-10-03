import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetModerationQueueQuery } from './get-moderation-queue.query';
import { Inject, Logger } from '@nestjs/common';
import { IContentReportRepository } from '../../../domain/interfaces/content-report.repository';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export interface ReportDetailDto {
  reporterId: string;
  reason: string;
  timestamp: string;
}

export interface ModerationQueueItemDto {
  id: string;
  contentId: string;
  contentType: string;
  authorId: string;
  status: string;
  reports: ReportDetailDto[];
  createdAt: string;
  updatedAt: string;
  reportCount: number;
}

export interface GetModerationQueueResponse {
  items: ModerationQueueItemDto[];
  total: number;
  page: number;
  limit: number;
}

@QueryHandler(GetModerationQueueQuery)
export class GetModerationQueueHandler
  implements IQueryHandler<GetModerationQueueQuery, GetModerationQueueResponse>
{
  private readonly logger = new Logger(GetModerationQueueHandler.name);

  constructor(
    @Inject(IContentReportRepository)
    private readonly contentReportRepository: IContentReportRepository,
  ) {}

  async execute(
    query: GetModerationQueueQuery,
  ): Promise<GetModerationQueueResponse> {
    try {
      const { page, limit, sortBy, sortOrder } = query;

      const paginatedResult =
        await this.contentReportRepository.findManyPaginated({
          page,
          limit,
          sortBy,
          sortOrder,
        });

      const itemsDto = paginatedResult.data.map(
        (item): ModerationQueueItemDto => ({
          id: item.id,
          contentId: item.contentId,
          contentType: item.contentType,
          authorId: item.authorId,
          status: item.status,
          reports: item.reports.map((r) => ({
            reporterId: r.reporterId,
            reason: r.reason,
            timestamp: r.timestamp.toISOString(),
          })),
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
          reportCount: item.reports.length,
        }),
      );

      return {
        items: itemsDto,
        total: paginatedResult.total,
        page: paginatedResult.page,
        limit: paginatedResult.limit,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch moderation queue. Error: ${error.message}`,
        error.stack,
      );
      throw new RpcException({
        code: status.INTERNAL,
        message: 'An error occurred while fetching the moderation queue.',
      });
    }
  }
}