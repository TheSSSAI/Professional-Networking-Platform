import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConnectionsClientService } from './connections-client.service';
import { IConnectionsClient } from './connections-client.interface';

/**
 * Module responsible for configuring and providing the gRPC client for the Connections service.
 * It uses the NestJS ClientsModule to register the microservice client, loading the .proto file
 * and configuring the transport options from environment variables.
 */
@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'CONNECTIONS_PACKAGE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'connections',
            protoPath: join(
              process.cwd(),
              'proto/connections/connections.proto',
            ),
            url: configService.get<string>('CONNECTIONS_SVC_URL'),
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
  providers: [
    {
      provide: IConnectionsClient,
      useClass: ConnectionsClientService,
    },
  ],
  exports: [IConnectionsClient],
})
export class ConnectionsClientModule {}