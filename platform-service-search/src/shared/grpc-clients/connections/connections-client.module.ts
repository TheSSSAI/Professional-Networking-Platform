import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const CONNECTIONS_SERVICE_NAME = 'ConnectionsService';
export const CONNECTIONS_PACKAGE_NAME = 'connections';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CONNECTIONS_SERVICE_NAME,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: CONNECTIONS_PACKAGE_NAME,
            protoPath: join(
              process.cwd(),
              'src/_proto/connections.proto',
            ),
            url: configService.get<string>('grpc.connectionsServiceUrl'),
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