import { Controller, UseGuards, UseFilters, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { AdminRoleGuard } from '../../../shared/infrastructure/guards/admin-role.guard';
import { GrpcExceptionFilter } from '../../../shared/infrastructure/filters/grpc-exception.filter';
import { GetModerationQueueQuery } from '../application/queries/get-moderation-queue/get-moderation-queue.query';
import { TakeModerationActionCommand } from '../application/commands/take-moderation-action/take-moderation-action.command';
import { TakeModerationActionRequestDto } from './dtos/take-moderation-action.dto';
import { status as RpcStatus } from '@grpc/grpc-js';

// As these DTOs are not specified in the file structure, we define them here for type safety and clarity.
// In a real project, these would be in separate files.
interface GetModerationQueueRequestDto {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ReportDetail {
  reporterId: string;
  reason: string;
  reportedAt: string;
}

interface ModerationQueueItemDto {
  id: string;
  contentId: string;
  contentType: string;
  authorId: string;
  status: string;
  reports: ReportDetail[];
  createdAt: string;
}

interface GetModerationQueueResponseDto {
  items: ModerationQueueItemDto[];
  total: number;
  page: number;
  limit: number;
}
interface TakeModerationActionResponseDto {
  success: boolean;
  message: string;
}

/**
 * gRPC Controller for content moderation workflows.
 * Exposes methods to fetch the moderation queue and take action on reported content.
 * All methods are secured by the AdminRoleGuard.
 * @see REQ-1-041, REQ-1-042
 */
@Controller()
@UseGuards(AdminRoleGuard)
@UseFilters(new GrpcExceptionFilter())
export class ModerationGrpcController {
  private readonly logger = new Logger(ModerationGrpcController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Fetches a paginated list of content reports pending moderation.
   * @param request Pagination and sorting options.
   * @returns A paginated list of moderation queue items.
   */
  @GrpcMethod('AdminService', 'GetModerationQueue')
  async getModerationQueue(
    request: GetModerationQueueRequestDto,
  ): Promise<GetModerationQueueResponseDto> {
    this.logger.log(`Received GetModerationQueue request: ${JSON.stringify(request)}`);
    const { page = 1, limit = 20, sortBy, sortOrder } = request;

    const query = new GetModerationQueueQuery(page, limit, sortBy, sortOrder);
    const result = await this.queryBus.execute(query);

    // Map domain entities to DTOs for the gRPC response
    const itemsDto = result.items.map((item) => ({
      id: item.id,
      contentId: item.contentId,
      contentType: item.contentType,
      authorId: item.authorId,
      status: item.status,
      reports: item.reports.map(report => ({
        reporterId: report.reporterId,
        reason: report.reason,
        reportedAt: report.reportedAt.toISOString(),
      })),
      createdAt: item.createdAt.toISOString(),
    }));

    return {
      items: itemsDto,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  /**
   * Executes a moderation action on a reported piece of content.
   * This is a critical command that orchestrates actions like dismissing reports,
   * removing content, or banning users.
   * The action is immutably logged by the command handler.
   * @param request The action to take and the target report.
   * @param metadata gRPC metadata containing the authenticated admin's JWT claims.
   * @returns A success or failure response.
   */
  @GrpcMethod('AdminService', 'TakeModerationAction')
  async takeModerationAction(
    request: TakeModerationActionRequestDto,
    metadata: any,
  ): Promise<TakeModerationActionResponseDto> {
    const adminId = metadata.get('user')?.sub;
    if (!adminId) {
      throw new RpcException({
        code: RpcStatus.PERMISSION_DENIED,
        message: 'Administrator ID not found in metadata.',
      });
    }

    this.logger.log(
      `Received TakeModerationAction request: ${JSON.stringify(request)} by admin: ${adminId}`,
    );

    await this.commandBus.execute(
      new TakeModerationActionCommand(
        request.reportId,
        request.action,
        adminId,
        request.reason,
        request.suspensionDuration,
      ),
    );

    return {
      success: true,
      message: `Moderation action '${request.action}' completed successfully.`,
    };
  }
}