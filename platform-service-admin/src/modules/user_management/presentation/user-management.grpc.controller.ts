import { Controller, UseGuards, UseFilters, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { AdminRoleGuard } from '../../../shared/infrastructure/guards/admin-role.guard';
import { GrpcExceptionFilter } from '../../../shared/infrastructure/filters/grpc-exception.filter';
import { SearchUsersAdminQuery } from '../application/queries/search-users-admin/search-users-admin.query';
import { TriggerPasswordResetCommand } from '../application/commands/trigger-password-reset/trigger-password-reset.command';
import { status as RpcStatus } from '@grpc/grpc-js';

// As these DTOs are not specified in the file structure, we define them here for type safety and clarity.
// In a real project, these would be in separate files.
interface SearchUsersAdminRequestDto {
  query?: string;
  status?: string;
  page: number;
  limit: number;
}
interface UserSummaryDto {
  id: string;
  email: string;
  name: string;
  status: string;
  createdAt: string;
}
interface SearchUsersAdminResponseDto {
  users: UserSummaryDto[];
  total: number;
  page: number;
  limit: number;
}
interface TriggerPasswordResetRequestDto {
  userId: string;
}
interface TriggerPasswordResetResponseDto {
  success: boolean;
  message: string;
}

/**
 * gRPC Controller for administrative user management tasks.
 * Provides endpoints for searching users and triggering support actions like password resets.
 * All methods are secured by the AdminRoleGuard.
 * @see REQ-1-043
 */
@Controller()
@UseGuards(AdminRoleGuard)
@UseFilters(new GrpcExceptionFilter())
export class UserManagementGrpcController {
  private readonly logger = new Logger(UserManagementGrpcController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles gRPC requests for searching users from the Admin Dashboard.
   * This provides a privileged search capability.
   * @param request Search query, filters, and pagination options.
   * @returns A paginated list of user summaries.
   */
  @GrpcMethod('AdminService', 'SearchUsersAdmin')
  async searchUsersAdmin(
    request: SearchUsersAdminRequestDto,
  ): Promise<SearchUsersAdminResponseDto> {
    this.logger.log(`Received SearchUsersAdmin request: ${JSON.stringify(request)}`);
    const { query, status, page = 1, limit = 20 } = request;

    const result = await this.queryBus.execute(
      new SearchUsersAdminQuery(query, status, page, limit),
    );

    // This mapping assumes the query handler returns a structure with users and pagination info.
    const usersDto = result.users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.profile.name,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
    }));

    return {
      users: usersDto,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  /**
   * Handles gRPC requests to trigger a password reset email for a specific user.
   * This is a support function for administrators. The action is audited.
   * @param request DTO containing the target user's ID.
   * @param metadata gRPC metadata containing the authenticated admin's JWT claims.
   * @returns A success or failure response.
   */
  @GrpcMethod('AdminService', 'TriggerPasswordReset')
  async triggerPasswordReset(
    request: TriggerPasswordResetRequestDto,
    metadata: any,
  ): Promise<TriggerPasswordResetResponseDto> {
    const adminId = metadata.get('user')?.sub;
    if (!adminId) {
      throw new RpcException({
        code: RpcStatus.PERMISSION_DENIED,
        message: 'Administrator ID not found in metadata.',
      });
    }

    this.logger.log(
      `Received TriggerPasswordReset request for user ${request.userId} by admin ${adminId}`,
    );

    await this.commandBus.execute(
      new TriggerPasswordResetCommand(request.userId, adminId),
    );

    return {
      success: true,
      message: `Password reset email has been sent to user ${request.userId}.`,
    };
  }
}