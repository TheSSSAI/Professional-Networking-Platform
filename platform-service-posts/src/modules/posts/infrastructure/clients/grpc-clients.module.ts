import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'PROFILE_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'profile',
            protoPath: join(
              process.cwd(),
              'proto/profile/profile.proto',
            ),
            url: configService.get<string>('GRPC_PROFILE_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'CONNECTION_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'connection',
            protoPath: join(
              process.cwd(),
              'proto/connection/connection.proto',
            ),
            url: configService.get<string>('GRPC_CONNECTION_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientsModule {}