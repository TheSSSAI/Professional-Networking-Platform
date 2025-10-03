import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { IConnectionServicePort } from '../../domain/interfaces/connection.service.port.interface';

// This interface should be auto-generated from the .proto file
// For generation purposes, it is defined here based on the contract.
interface IConnectionGrpcService {
  isConnected(request: {
    userIdA: string;
    userIdB: string;
  }): Promise<{ areConnected: boolean }>;
}

@Injectable()
export class ConnectionServiceAdapter
  implements IConnectionServicePort, OnModuleInit
{
  private readonly logger = new Logger(ConnectionServiceAdapter.name);
  private connectionGrpcService: IConnectionGrpcService;

  constructor(
    @Inject('CONNECTION_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.connectionGrpcService =
      this.client.getService<IConnectionGrpcService>('ConnectionService');
  }

  async isConnected(userIdA: string, userIdB: string): Promise<boolean> {
    try {
      this.logger.log(
        `Checking connection status between users: ${userIdA} and ${userIdB}`,
      );
      const response = await firstValueFrom(
        this.connectionGrpcService
          .isConnected({ userIdA, userIdB })
          // @ts-ignore
          .pipe(timeout(5000)),
      );
      return response.areConnected;
    } catch (error) {
      this.logger.error(
        `Failed to check connection status for users ${userIdA} and ${userIdB}. Error: ${error.message}`,
        error.stack,
      );
      // Fail-closed for security. If we can't verify the connection, assume they are not connected.
      return false;
    }
  }
}