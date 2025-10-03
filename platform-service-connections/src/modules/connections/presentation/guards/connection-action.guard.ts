import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { IConnectionRepository } from '../../domain/interfaces/connection.repository.interface.ts';
import { CONNECTION_REPOSITORY } from '../../connections.constants.ts';
import { ConnectionStatus } from '../../domain/connection-status.enum.ts';

interface GrpcRequestWithUserId {
  authenticatedUserId: string;
}

/**
 * A guard to authorize actions on connections and connection requests.
 * It ensures that a user can only perform actions (accept, decline, remove, send, view)
 * on resources they are a part of.
 *
 * This guard expects the authenticated user's ID to be present in the gRPC metadata
 * under the key 'authenticateduserid'. An upstream interceptor is responsible for populating this.
 */
@Injectable()
export class ConnectionActionGuard implements CanActivate {
  constructor(
    @Inject(CONNECTION_REPOSITORY)
    private readonly connectionRepository: IConnectionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData();
    const metadata = rpcContext.getContext(); // gRPC metadata
    const handler = context.getHandler().name;

    const authenticatedUserId = metadata.get('authenticateduserid')?.[0];
    if (!authenticatedUserId) {
      throw new RpcException({
        code: GrpcStatus.UNAUTHENTICATED,
        message: 'Authenticated user ID is missing from metadata.',
      });
    }

    // Attach authenticatedUserId to the request data for handlers to use
    data.authenticatedUserId = authenticatedUserId;

    switch (handler) {
      case 'acceptRequest':
      case 'declineRequest':
        return this.canAcceptOrDecline(authenticatedUserId, data);
      case 'removeConnection':
        return this.canRemoveConnection(authenticatedUserId, data);
      case 'sendRequest':
        return this.isRequestOwner(authenticatedUserId, data.senderId);
      case 'getPendingRequests':
      case 'getConnections':
        return this.isRequestOwner(authenticatedUserId, data.userId);
      default:
        // By default, allow other methods not explicitly protected by this guard
        return true;
    }
  }

  private isRequestOwner(
    authenticatedUserId: string,
    targetUserId: string,
  ): boolean {
    if (authenticatedUserId !== targetUserId) {
      throw new RpcException({
        code: GrpcStatus.PERMISSION_DENIED,
        message: 'User is not authorized to perform this action for another user.',
      });
    }
    return true;
  }

  private async canAcceptOrDecline(
    authenticatedUserId: string,
    data: { accepterId?: string; declinerId?: string; requesterId: string },
  ): Promise<boolean> {
    const actionUserId = data.accepterId || data.declinerId;

    if (authenticatedUserId !== actionUserId) {
      throw new RpcException({
        code: GrpcStatus.PERMISSION_DENIED,
        message: 'User is not authorized to accept or decline a request on behalf of another user.',
      });
    }

    const connection = await this.connectionRepository.findByUsers(
      data.requesterId,
      actionUserId,
    );

    if (!connection) {
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: 'Connection request not found.',
      });
    }

    if (connection.getStatus() !== ConnectionStatus.PENDING) {
      throw new RpcException({
        code: GrpcStatus.FAILED_PRECONDITION,
        message: `Connection request is not in PENDING state. Current state: ${connection.getStatus()}`,
      });
    }

    if (connection.getAddresseeId() !== authenticatedUserId) {
      throw new RpcException({
        code: GrpcStatus.PERMISSION_DENIED,
        message: 'User is not the recipient of this connection request.',
      });
    }

    return true;
  }

  private async canRemoveConnection(
    authenticatedUserId: string,
    data: { removerId: string; connectionId: string },
  ): Promise<boolean> {
    if (authenticatedUserId !== data.removerId) {
      throw new RpcException({
        code: GrpcStatus.PERMISSION_DENIED,
        message: 'User is not authorized to remove a connection on behalf of another user.',
      });
    }

    const connection = await this.connectionRepository.findById(
      data.connectionId,
    );

    if (!connection) {
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        message: 'Connection not found.',
      });
    }

    if (connection.getStatus() !== ConnectionStatus.ACCEPTED) {
      throw new RpcException({
        code: GrpcStatus.FAILED_PRECONDITION,
        message: `Cannot remove a connection that is not in ACCEPTED state. Current state: ${connection.getStatus()}`,
      });
    }

    const isPartyToConnection =
      connection.getRequesterId() === authenticatedUserId ||
      connection.getAddresseeId() === authenticatedUserId;

    if (!isPartyToConnection) {
      throw new RpcException({
        code: GrpcStatus.PERMISSION_DENIED,
        message: 'User is not a party to the connection being removed.',
      });
    }

    return true;
  }
}