import { Controller, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';

import {
  ConnectionsServiceController,
  ConnectionsServiceControllerMethods,
  AcceptConnectionRequestDto,
  DeclineConnectionRequestDto,
  GetConnectionsDto,
  GetPendingRequestsDto,
  IsConnectedDto,
  RemoveConnectionDto,
  SendConnectionRequestDto,
  StatusResponse,
  GetConnectionsResponse,
  GetPendingRequestsResponse,
  IsConnectedResponse,
} from '../../../../proto/connections/connections.ts';

import { SendRequestCommand } from '../application/commands/send-request.command.ts';
import { AcceptRequestCommand } from '../application/commands/accept-request.command.ts';
import { DeclineRequestCommand } from '../application/commands/decline-request.command.ts';
import { RemoveConnectionCommand } from '../application/commands/remove-connection.command.ts';
import { GetConnectionsQuery } from '../application/queries/get-connections.query.ts';
import { GetPendingRequestsQuery } from '../application/queries/get-pending-requests.query.ts';
import { IsConnectedQuery } from '../application/queries/is-connected.query.ts';

import { ConnectionActionGuard } from './guards/connection-action.guard.ts';

@Controller('connections')
@ConnectionsServiceControllerMethods()
export class ConnectionsGrpcController implements ConnectionsServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('ConnectionsService', 'sendRequest')
  @UseGuards(ConnectionActionGuard)
  async sendRequest(
    request: SendConnectionRequestDto,
  ): Promise<StatusResponse> {
    try {
      await this.commandBus.execute(
        new SendRequestCommand(
          request.senderId,
          request.recipientId,
          request.message,
        ),
      );
      return { success: true, message: 'Connection request sent successfully.' };
    } catch (error) {
      throw new RpcException({
        code: GrpcStatus.INTERNAL,
        message: error.message,
      });
    }
  }

  @GrpcMethod('ConnectionsService', 'acceptRequest')
  @UseGuards(ConnectionActionGuard)
  async acceptRequest(
    request: AcceptConnectionRequestDto,
  ): Promise<StatusResponse> {
    try {
      await this.commandBus.execute(
        new AcceptRequestCommand(request.requesterId, request.accepterId),
      );
      return {
        success: true,
        message: 'Connection request accepted successfully.',
      };
    } catch (error) {
      throw new RpcException({
        code: GrpcStatus.INTERNAL,
        message: error.message,
      });
    }
  }

  @GrpcMethod('ConnectionsService', 'declineRequest')
  @UseGuards(ConnectionActionGuard)
  async declineRequest(
    request: DeclineConnectionRequestDto,
  ): Promise<StatusResponse> {
    try {
      await this.commandBus.execute(
        new DeclineRequestCommand(request.requesterId, request.declinerId),
      );
      return {
        success: true,
        message: 'Connection request declined successfully.',
      };
    } catch (error) {
      throw new RpcException({
        code: GrpcStatus.INTERNAL,
        message: error.message,
      });
    }
  }

  @GrpcMethod('ConnectionsService', 'removeConnection')
  @UseGuards(ConnectionActionGuard)
  async removeConnection(
    request: RemoveConnectionDto,
  ): Promise<StatusResponse> {
    try {
      await this.commandBus.execute(
        new RemoveConnectionCommand(request.connectionId, request.removerId),
      );
      return { success: true, message: 'Connection removed successfully.' };
    } catch (error) {
      throw new RpcException({
        code: GrpcStatus.INTERNAL,
        message: error.message,
      });
    }
  }

  @GrpcMethod('ConnectionsService', 'getPendingRequests')
  @UseGuards(ConnectionActionGuard)
  async getPendingRequests(
    request: GetPendingRequestsDto,
  ): Promise<GetPendingRequestsResponse> {
    try {
      const result = await this.queryBus.execute(
        new GetPendingRequestsQuery(request.userId, request.pagination),
      );
      return result;
    } catch (error) {
      throw new RpcException({
        code: GrpcStatus.INTERNAL,
        message: error.message,
      });
    }
  }

  @GrpcMethod('ConnectionsService', 'getConnections')
  @UseGuards(ConnectionActionGuard)
  async getConnections(
    request: GetConnectionsDto,
  ): Promise<GetConnectionsResponse> {
    try {
      const result = await this.queryBus.execute(
        new GetConnectionsQuery(
          request.userId,
          request.pagination,
          request.sort,
        ),
      );
      return result;
    } catch (error) {
      throw new RpcException({
        code: GrpcStatus.INTERNAL,
        message: error.message,
      });
    }
  }

  @GrpcMethod('ConnectionsService', 'isConnected')
  async isConnected(request: IsConnectedDto): Promise<IsConnectedResponse> {
    try {
      const result = await this.queryBus.execute(
        new IsConnectedQuery(request.userIdA, request.userIdB),
      );
      return { areConnected: result };
    } catch (error) {
      throw new RpcException({
        code: GrpcStatus.INTERNAL,
        message: error.message,
      });
    }
  }
}