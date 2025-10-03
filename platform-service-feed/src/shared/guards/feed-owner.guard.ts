import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { Metadata } from '@grpc/grpc-js';

/**
 * A gRPC authorization guard that ensures the authenticated user
 * is the owner of the feed they are requesting.
 *
 * It works by comparing the `userId` from the gRPC request payload
 * with the authenticated user's ID passed in the gRPC metadata.
 * The API Gateway is responsible for authenticating the user and injecting
 * their ID into the metadata of the downstream gRPC call.
 *
 * This guard prevents one user from requesting another user's private feed data.
 */
@Injectable()
export class FeedOwnerGuard implements CanActivate {
  private readonly logger = new Logger(FeedOwnerGuard.name);

  /**
   * Determines if the current request is authorized.
   *
   * @param context The execution context of the incoming request.
   * @returns A boolean indicating if access is granted.
   * @throws {RpcException} with status PERMISSION_DENIED if authorization fails.
   */
  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'rpc') {
      // This guard is specifically for gRPC contexts.
      this.logger.warn('FeedOwnerGuard used in non-RPC context.');
      return false;
    }

    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData(); // The request DTO (e.g., GetFeedRequestDto)
    const metadata: Metadata = rpcContext.getContext(); // The gRPC metadata

    const requestUserId = data?.userId;

    // Extract authenticated user ID from metadata.
    // The API Gateway should inject this as 'x-user-id'.
    const authenticatedUserIdValue = metadata.get('x-user-id');
    if (!authenticatedUserIdValue || authenticatedUserIdValue.length === 0) {
      this.logger.error(
        'Authorization failed: Missing authenticated user ID in gRPC metadata.',
      );
      throw new RpcException({
        code: GrpcStatus.UNAUTHENTICATED,
        message: 'Authentication token is invalid or missing.',
      });
    }
    const authenticatedUserId = authenticatedUserIdValue[0].toString();

    // The core authorization check.
    if (authenticatedUserId === requestUserId) {
      return true; // Access granted.
    } else {
      // Log the authorization failure for security monitoring.
      this.logger.warn(
        `Authorization failed: User '${authenticatedUserId}' attempted to access feed for user '${requestUserId}'.`,
      );
      // Throw a standard gRPC exception for permission denied.
      throw new RpcException({
        code: GrpcStatus.PERMISSION_DENIED,
        message: 'You do not have permission to access this resource.',
      });
    }
  }
}