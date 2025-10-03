import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, catchError, map, of, timeout } from 'rxjs';

// --- Interface Definitions for gRPC Contract ---
// These interfaces provide strong typing for the gRPC client.
// They are based on the expected .proto file for the Connections service.

interface ConnectionsServiceClient {
  isConnected(request: IsConnectedRequest): Observable<IsConnectedResponse>;
}

interface IsConnectedRequest {
  userIdA: string;
  userIdB: string;
}

interface IsConnectedResponse {
  areConnected: boolean;
}

// --- Service Implementation ---

@Injectable()
export class ConnectionsClientService implements OnModuleInit {
  private readonly logger = new Logger(ConnectionsClientService.name);
  private connectionsService: ConnectionsServiceClient;

  constructor(
    @Inject('CONNECTIONS_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  /**
   * Initializes the gRPC service client on module initialization.
   * This is a NestJS lifecycle hook.
   */
  onModuleInit() {
    this.connectionsService =
      this.client.getService<ConnectionsServiceClient>('ConnectionsService');
  }

  /**
   * Checks if two users are first-degree connections by calling the Connections gRPC service.
   * This method is critical for enforcing authorization in the messaging feature (REQ-1-029).
   * It includes error handling to prevent cascading failures if the Connections service is unavailable.
   *
   * @param userIdA - The ID of the first user.
   * @param userIdB - The ID of the second user.
   * @returns An Observable that emits `true` if they are connected, otherwise `false`.
   */
  public isConnected(
    userIdA: string,
    userIdB: string,
  ): Observable<boolean> {
    if (!this.connectionsService) {
      this.logger.error(
        'ConnectionsService gRPC client not initialized. Returning false as a safe default.',
      );
      return of(false);
    }

    return this.connectionsService
      .isConnected({
        userIdA,
        userIdB,
      })
      .pipe(
        timeout(5000), // Prevent long waits if the service is unresponsive
        map((response) => response.areConnected),
        catchError((error) => {
          this.logger.error(
            `Failed to check connection status for users ${userIdA} and ${userIdB}. Error: ${error.message}`,
            error.stack,
          );
          // Fail securely: if the connection service is down or returns an error,
          // we assume the users are not connected to prevent unauthorized messaging.
          return of(false);
        }),
      );
  }
}