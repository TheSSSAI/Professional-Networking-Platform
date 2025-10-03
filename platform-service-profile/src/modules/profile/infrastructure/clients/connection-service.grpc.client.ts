import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ConnectionsServiceClient,
  AreUsersConnectedRequest,
  ARE_USERS_CONNECTED_REQUEST,
} from '@app/common/interfaces/connection.interface';
import { catchError, firstValueFrom, of, timeout } from 'rxjs';

@Injectable()
export class ConnectionServiceGrpcClient implements OnModuleInit {
  private readonly logger = new Logger(ConnectionServiceGrpcClient.name);
  private connectionsService: ConnectionsServiceClient;

  constructor(
    @Inject('CONNECTION_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.connectionsService =
      this.client.getService<ConnectionsServiceClient>('ConnectionsService');
  }

  async areUsersConnected(
    userAId: string,
    userBId: string,
  ): Promise<boolean> {
    if (!this.connectionsService) {
        this.logger.error('ConnectionsService client not initialized.');
        return false;
    }

    const request: AreUsersConnectedRequest = { userAId, userBId };

    this.logger.log(
      `Checking connection status between ${userAId} and ${userBId}`,
    );

    const response$ = this.connectionsService.areUsersConnected(request).pipe(
      timeout(5000), // 5 second timeout
      catchError((error) => {
        this.logger.error(
          `gRPC call to ConnectionService failed: ${error.message}`,
          error.stack,
        );
        // In case of error (e.g., service down), fail safely by assuming no connection.
        // This enforces the stricter privacy rule.
        return of({ areConnected: false });
      }),
    );

    try {
      const response = await firstValueFrom(response$);
      return response.areConnected;
    } catch (error) {
      this.logger.error(
        `Error resolving gRPC call promise: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }
}