import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { IdentityClient } from './identity/identity.client';
import { PostsClient } from './posts/posts.client';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'IDENTITY_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'identity',
            protoPath: join(
              process.cwd(),
              'proto/identity.proto',
            ),
            url: configService.get<string>('IDENTITY_SERVICE_URL'),
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
      {
        name: 'POSTS_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'posts',
            protoPath: join(process.cwd(), 'proto/posts.proto'),
            url: configService.get<string>('POSTS_SERVICE_URL'),
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
  providers: [IdentityClient, PostsClient],
  exports: [ClientsModule, IdentityClient, PostsClient],
})
export class GrpcClientsModule {}