import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ConnectionsClientService } from './connections-client.service';

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
              'proto/connections.proto',
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
  providers: [ConnectionsClientService],
  exports: [ConnectionsClientService],
})
export class ConnectionsClientModule {}