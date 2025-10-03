import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status as grpcStatus } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

// This interface is a placeholder for the decoded JWT payload.
// In a real application, this would likely be in a shared library.
interface UserPayload {
  userId: string;
  email: string;
  roles: string[];
}

/**
 * A NestJS Guard that protects gRPC methods by ensuring the authenticated user
 * has the 'Administrator' role. It inspects the gRPC metadata for a user payload.
 *
 * This guard assumes that a prior authentication step (e.g., in the API Gateway)
 * has validated the JWT and attached the decoded user payload to the gRPC metadata.
 */
@Injectable()
export class AdminRoleGuard implements CanActivate {
  private readonly logger = new Logger(AdminRoleGuard.name);
  private readonly ADMIN_ROLE = 'Administrator';

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const type = context.getType();

    if (type !== 'rpc') {
      this.logger.warn(`AdminRoleGuard used on a non-RPC context: ${type}`);
      return false;
    }

    const metadata: Metadata = context.switchToRpc().getContext();
    const userPayloadBuffer = metadata.get('user');

    if (!userPayloadBuffer || userPayloadBuffer.length === 0) {
      this.logger.error('Missing user payload in gRPC metadata.');
      throw new RpcException({
        code: grpcStatus.UNAUTHENTICATED,
        message: 'Authentication token is missing or invalid.',
      });
    }

    try {
      const userPayload: UserPayload = JSON.parse(
        userPayloadBuffer[0].toString(),
      );

      if (!userPayload || !Array.isArray(userPayload.roles)) {
        this.logger.error('Invalid user payload format in gRPC metadata.');
        throw new RpcException({
          code: grpcStatus.UNAUTHENTICATED,
          message: 'Invalid authentication payload.',
        });
      }

      const hasAdminRole = userPayload.roles.includes(this.ADMIN_ROLE);

      if (!hasAdminRole) {
        this.logger.warn(
          `Permission denied for user ${userPayload.userId}. Missing role: ${this.ADMIN_ROLE}`,
        );
        throw new RpcException({
          code: grpcStatus.PERMISSION_DENIED,
          message: 'You do not have permission to perform this action.',
        });
      }

      return true;
    } catch (error) {
      this.logger.error('Failed to parse user payload from metadata.', error);
      throw new RpcException({
        code: grpcStatus.INTERNAL,
        message: 'Error processing authentication information.',
      });
    }
  }
}