import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

/**
 * A gRPC guard that verifies if the authenticated user is the owner of the profile resource being accessed.
 * This is used to protect write operations on a user's profile.
 *
 * It extracts the authenticated user's ID from the gRPC metadata and compares it
 * with the target `userId` present in the request payload.
 */
@Injectable()
export class ProfileOwnerGuard implements CanActivate {
  private readonly logger = new Logger(ProfileOwnerGuard.name);

  /**
   * Determines if the current request is authorized based on resource ownership.
   * @param context The execution context of the incoming gRPC request.
   * @returns A boolean or a Promise/Observable of a boolean indicating if the request can proceed.
   * @throws RpcException with PERMISSION_DENIED if the user is not the owner.
   * @throws RpcException with UNAUTHENTICATED if the user ID is missing from metadata.
   * @throws RpcException with FAILED_PRECONDITION if the request payload is missing the target userId.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const rpcContext = context.switchToRpc();
    const metadata = rpcContext.getContext(); // gRPC Metadata
    const data = rpcContext.getData(); // Request payload (DTO)

    // 1. Extract the authenticated user ID from the gRPC metadata.
    // This is expected to be added by an upstream authentication interceptor/guard.
    const authenticatedUserId = metadata.get('user-id')?.[0];
    if (!authenticatedUserId || typeof authenticatedUserId !== 'string') {
      this.logger.error(
        'Authenticated user ID not found in gRPC metadata. Upstream auth middleware may have failed.',
      );
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Authentication token is invalid or missing.',
      });
    }

    // 2. Extract the target profile's user ID from the request data.
    // We assume a convention that write operations include the target userId.
    const targetUserId = data.userId;
    if (!targetUserId || typeof targetUserId !== 'string') {
      this.logger.error(
        `Request payload is missing the 'userId' property. Cannot perform ownership check. Payload: ${JSON.stringify(
          data,
        )}`,
      );
      throw new RpcException({
        code: status.FAILED_PRECONDITION,
        message: `Request is missing the required 'userId' field for ownership verification.`,
      });
    }

    // 3. Compare the IDs to enforce ownership.
    const isOwner = authenticatedUserId === targetUserId;

    if (!isOwner) {
      this.logger.warn(
        `Authorization failed: User '${authenticatedUserId}' attempted to modify resource owned by '${targetUserId}'.`,
      );
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: 'You do not have permission to perform this action on this profile.',
      });
    }

    this.logger.log(
      `User '${authenticatedUserId}' authorized as owner for resource '${targetUserId}'.`,
    );
    return true;
  }
}