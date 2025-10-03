import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IConnectionsClientService } from './connections-client.interface';
import {
  catchError,
  firstValueFrom,
  throwError,
  timeout,
} from 'rxjs';
import { status as GrpcStatus } from '@grpc/grpc-js';

// These would typically come from a shared contracts library
interface ConnectionsGrpcService {
  isConnected(request: {
    userAId: string;
    userBId: string;
  }): Promise<{ areConnected: boolean }>;
}

@Injectable()
export class ConnectionsClientService
  implements IConnectionsClientService, OnModuleInit
{
  private readonly logger = new Logger(ConnectionsClientService.name);
  private connectionsService: ConnectionsGrpcService;

  constructor(@Inject('CONNECTIONS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.connectionsService = this.client.getService<ConnectionsGrpcService>('ConnectionsService');
  }

  async isConnected(userAId: string, userBId: string): Promise<boolean> {
    this.logger.debug(`Checking connection status between ${userAId} and ${userBId}`);
    try {
      const response = await firstValueFrom(
        this.connectionsService.isConnected({ userAId, userBId }).pipe(
          timeout(5000), // 5 second timeout for the gRPC call
          catchError((err) => {
            this.logger.error(`gRPC error while checking connection: ${err.message}`, err.stack);
            
            // Map gRPC errors to NestJS exceptions
            if (err.code === GrpcStatus.UNAVAILABLE || err.code === GrpcStatus.DEADLINE_EXCEEDED) {
              return throwError(() => new InternalServerErrorException('Connections service is unavailable.'));
            }
            return throwError(() => new InternalServerErrorException('An unexpected error occurred while checking connection status.'));
          }),
        ),
      );
      return response.areConnected;
    } catch (error) {
      // Errors thrown from catchError will be caught here
      this.logger.error(`Failed to check connection status between ${userAId} and ${userBId}`, error.stack);
      // Re-throw the NestJS exception for the guard to handle
      throw error;
    }
  }
}