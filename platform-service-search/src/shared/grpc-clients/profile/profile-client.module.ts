import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const PROFILE_SERVICE_NAME = 'ProfileService';
export const PROFILE_PACKAGE_NAME = 'profile';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PROFILE_SERVICE_NAME,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: PROFILE_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'src/_proto/profile.proto'),
            url: configService.get<string>('grpc.profileServiceUrl'),
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
export class ProfileClientModule {}