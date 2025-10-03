import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { IConnectionsClientService } from './interfaces/connections-client.interface';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';

// This interface should be generated from the .proto file
interface GrpcConnectionsService {
  getConnections(request: {
    userId: string;
  }): Promise<{ connectionIds: string[] }>;
}

@Injectable()
export class ConnectionsClientService
  implements IConnectionsClientService, OnModuleInit
{
  private readonly logger = new Logger(ConnectionsClientService.name);
  private connectionsService: GrpcConnectionsService;

  constructor(@Inject('CONNECTIONS_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.connectionsService =
      this.client.getService<GrpcConnectionsService>('ConnectionsService');
  }

  /**
   * Retrieves the list of first-degree connection IDs for a given user.
   * @param userId The ID of the user whose connections are needed.
   * @returns A promise that resolves to an array of connection user IDs.
   * @throws RpcException if the connections service is unavailable or fails.
   */
  async getConnections(userId: string): Promise<string[]> {
    this.logger.log(
      `Requesting connections for user ID: ${userId} from Connections service.`,
    );

    try {
      const response = await firstValueFrom(
        this.connectionsService
          .getConnections({ userId })
          .pipe(
            timeout(5000), // 5-second timeout for the gRPC call
            catchError((err) => {
              this.logger.error(
                `gRPC error from Connections service for user ${userId}: ${err.message}`,
                err.stack,
              );

              // Map gRPC error codes to standard RpcException
              const grpcStatus = err.code || status.UNKNOWN;
              let message = 'An error occurred while communicating with the connections service.';
              if (grpcStatus === status.UNAVAILABLE) {
                message = 'The connections service is currently unavailable.';
              } else if (grpcStatus === status.DEADLINE_EXCEEDED) {
                message = 'The request to the connections service timed out.';
              }
              
              return throwError(() => new RpcException({
                code: grpcStatus,
                message,
              }));
            }),
          ),
      );
      
      this.logger.log(`Received ${response.connectionIds?.length || 0} connections for user ${userId}.`);

      return response.connectionIds || [];
    } catch (error) {
      // This catch block handles errors thrown from the catchError pipe.
      // We re-throw it to be handled by the calling service or a global filter.
      if (error instanceof RpcException) {
        throw error;
      }
      this.logger.error(`Unexpected error in getConnections for user ${userId}: ${error.message}`, error.stack);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'An internal error occurred while fetching connections.'
      });
    }
  }
}