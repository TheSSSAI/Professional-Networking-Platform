import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

export const CONNECTIONS_SERVICE_NAME = 'CONNECTIONS_SERVICE';

/**
 * This module configures and provides the gRPC client for the Connections Service.
 * It uses the ClientsModule from @nestjs/microservices to register the client
 * asynchronously, allowing it to fetch configuration details like the service URL
 * from the environment via ConfigService.
 *
 * This client will be used by guards and services to verify connection status
 * between users, which is a critical authorization step for messaging (REQ-1-029).
 */
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CONNECTIONS_SERVICE_NAME,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('CONNECTIONS_SERVICE_GRPC_URL'),
            package: 'connections',
            protoPath: join(
              process.cwd(),
              'node_modules/@platform-contracts/connections/connections.proto',
            ),
            loader: {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class ConnectionsClientModule {}