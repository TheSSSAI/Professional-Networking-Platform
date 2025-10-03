import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { RpcExceptionFilter } from './shared/filters/rpc-exception.filter';
import { protobufPackage } from './modules/feed/feed.pb';

/**
 * Bootstraps the Feed Service microservice.
 * This service operates as a hybrid application:
 * 1.  It listens for incoming gRPC requests for the FeedService.
 * 2.  It independently starts a long-polling consumer for SQS messages ('PostCreated' events).
 * The SQS consumer is started via the NestJS lifecycle hook `onModuleInit` in the PostCreatedConsumer class.
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create the NestJS application context. This does not start a web server.
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Apply a global validation pipe to ensure all incoming DTOs are validated.
  // This is crucial for gRPC services where data is received from other services.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are provided
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      transformOptions: {
        enableImplicitConversion: true, // Allow for automatic conversion of types
      },
    }),
  );

  // Apply a global RPC exception filter to translate application exceptions
  // into standard gRPC status codes for clients.
  app.useGlobalFilters(new RpcExceptionFilter(logger));

  // Retrieve gRPC configuration from environment variables via ConfigService
  const grpcPort = configService.get<number>('PORT');
  const grpcUrl = `0.0.0.0:${grpcPort}`;
  const protoPath = join(process.cwd(), 'src/proto/feed.proto');

  // Connect the gRPC microservice transport layer.
  // This configures the application to listen for gRPC requests
  // based on the provided .proto file definition.
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.GRPC,
      options: {
        package: protobufPackage,
        protoPath: protoPath,
        url: grpcUrl,
        loader: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        },
      },
    },
    { inheritAppConfig: true }, // Inherit global pipes, filters, etc.
  );

  // Add a listener for the SIGTERM signal for graceful shutdown in containerized environments.
  app.enableShutdownHooks();

  try {
    // Start all configured microservices (in this case, the gRPC server).
    // The SQS consumer will be started automatically via its OnModuleInit hook.
    await app.startAllMicroservices();
    logger.log(
      `✅ Feed Service gRPC server is running on ${grpcUrl}`,
    );
    logger.log(
      `📝 Listening for events on SQS queue: ${configService.get(
        'SQS_QUEUE_URL',
      )}`,
    );
  } catch (error) {
    logger.error('❌ Failed to start the microservice.', error);
    process.exit(1);
  }
}

// Execute the bootstrap function to start the application.
bootstrap();