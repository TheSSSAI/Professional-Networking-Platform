import { Controller, UseGuards, UseFilters, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { AdminRoleGuard } from '../../../shared/infrastructure/guards/admin-role.guard';
import { GrpcExceptionFilter } from '../../../shared/infrastructure/filters/grpc-exception.filter';
import { GetFeatureFlagsQuery } from '../application/queries/get-feature-flags/get-feature-flags.query';
import { UpdateFeatureFlagCommand } from '../application/commands/update-feature-flag/update-feature-flag.command';
import { FeatureFlagEntity } from '../domain/entities/feature-flag.entity';
import { status as RpcStatus } from '@grpc/grpc-js';

// As these DTOs are not specified in the file structure, we define them here for type safety and clarity.
// In a real project, these would be in separate files like `dtos/get-feature-flags.dto.ts`.
interface GetFeatureFlagsRequestDto {}
interface GetFeatureFlagsResponseDto {
  featureFlags: {
    name: string;
    description: string;
    isEnabled: boolean;
  }[];
}
interface UpdateFeatureFlagRequestDto {
  name: string;
  isEnabled: boolean;
}
interface UpdateFeatureFlagResponseDto {
  name: string;
  description: string;
  isEnabled: boolean;
}

/**
 * gRPC Controller for managing system configurations like feature flags.
 * All methods in this controller are protected by the AdminRoleGuard, ensuring
 * that only authenticated users with an 'Administrator' role can access them.
 * It uses CQRS to dispatch commands and queries to the application layer.
 * @see REQ-1-045
 */
@Controller()
@UseGuards(AdminRoleGuard)
@UseFilters(new GrpcExceptionFilter())
export class ConfigurationGrpcController {
  private readonly logger = new Logger(ConfigurationGrpcController.name);

  /**
   * Injects CommandBus and QueryBus for CQRS pattern implementation.
   * @param commandBus The bus for dispatching commands.
   * @param queryBus The bus for dispatching queries.
   */
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the gRPC request to retrieve all feature flags.
   * This method dispatches a GetFeatureFlagsQuery to the application layer.
   * @returns A promise that resolves to a list of all feature flags.
   */
  @GrpcMethod('AdminService', 'GetFeatureFlags')
  async getFeatureFlags(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _request: GetFeatureFlagsRequestDto,
  ): Promise<GetFeatureFlagsResponseDto> {
    this.logger.log('Received GetFeatureFlags request.');
    const flags: FeatureFlagEntity[] = await this.queryBus.execute(
      new GetFeatureFlagsQuery(),
    );

    return {
      featureFlags: flags.map((flag) => ({
        name: flag.name,
        description: flag.description,
        isEnabled: flag.isEnabled,
      })),
    };
  }

  /**
   * Handles the gRPC request to update a feature flag's state.
   * This method dispatches an UpdateFeatureFlagCommand to the application layer.
   * The action is audited as per REQ-1-044.
   * @param request The request DTO containing the flag name and its new state.
   * @param metadata The gRPC metadata containing the authenticated admin's user ID.
   * @returns A promise that resolves to the updated feature flag.
   */
  @GrpcMethod('AdminService', 'UpdateFeatureFlag')
  async updateFeatureFlag(
    request: UpdateFeatureFlagRequestDto,
    metadata: any,
  ): Promise<UpdateFeatureFlagResponseDto> {
    const adminId = metadata.get('user')?.sub;
    if (!adminId) {
      throw new RpcException({
        code: RpcStatus.PERMISSION_DENIED,
        message: 'Administrator ID not found in metadata.',
      });
    }

    this.logger.log(
      `Received UpdateFeatureFlag request for flag: ${request.name} by admin: ${adminId}`,
    );

    const updatedFlag: FeatureFlagEntity = await this.commandBus.execute(
      new UpdateFeatureFlagCommand(
        request.name,
        request.isEnabled,
        adminId,
      ),
    );

    return {
      name: updatedFlag.name,
      description: updatedFlag.description,
      isEnabled: updatedFlag.isEnabled,
    };
  }
}