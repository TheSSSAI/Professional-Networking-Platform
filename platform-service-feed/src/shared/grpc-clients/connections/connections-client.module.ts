import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { ConnectionsClientService } from './connections-client.service';
import { IConnectionsClientService } from './interfaces/connections-client.interface';

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
              'node_modules/@platform-contracts/contracts/proto/connections.proto',
            ),
            url: configService.get<string>('SERVICES_CONNECTIONS_GRPC_URL'),
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
      provide: 'IConnectionsClientService',
      useClass: ConnectionsClientService,
    },
  ],
  exports: ['IConnectionsClientService'],
})
export class ConnectionsClientModule {}