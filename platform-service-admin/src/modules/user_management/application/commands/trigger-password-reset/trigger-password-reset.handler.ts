import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TriggerPasswordResetCommand } from './trigger-password-reset.command';
import { IdentityServiceClient } from '../../../../../shared/infrastructure/grpc-clients/identity/identity.client';
import { AuditService } from '../../../../audit/application/services/audit.service';
import { AdminActionType } from '../../../../audit/domain/enums/admin-action-type.enum';

@CommandHandler(TriggerPasswordResetCommand)
export class TriggerPasswordResetHandler
  implements ICommandHandler<TriggerPasswordResetCommand>
{
  private readonly logger = new Logger(TriggerPasswordResetHandler.name);

  constructor(
    private readonly identityClient: IdentityServiceClient,
    private readonly auditService: AuditService,
  ) {}

  async execute(command: TriggerPasswordResetCommand): Promise<void> {
    const { userId, adminId } = command;
    this.logger.log(
      `Executing TriggerPasswordResetCommand for user ${userId} by admin ${adminId}`,
    );

    // First, log the administrative action for auditability.
    // This is a critical step for security and compliance (REQ-1-044).
    await this.auditService.logAction({
      adminId,
      actionType: AdminActionType.TRIGGER_PASSWORD_RESET,
      targetId: userId,
      targetType: 'User',
      reason: 'Administrator triggered password reset from user management dashboard.',
    });

    try {
      // Delegate the actual password reset logic to the authoritative service (Identity service).
      // This service only orchestrates the request.
      await this.identityClient.triggerPasswordResetForUser({ userId, adminId });
      this.logger.log(
        `Successfully triggered password reset for user ${userId}.`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to trigger password reset for user ${userId}. Error: ${error.message}`,
        error.stack,
      );

      // If the error is an RpcException from the client, re-throw it so the
      // global gRPC exception filter can handle it and return a proper gRPC status code.
      if (error instanceof RpcException) {
        throw error;
      }

      // For any other unexpected errors, throw a generic internal server error.
      throw new InternalServerErrorException(
        'An unexpected error occurred while triggering the password reset.',
      );
    }
  }
}