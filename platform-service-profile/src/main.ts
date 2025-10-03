import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { GrpcConfig } from './config/grpc.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create a hybrid application context to access ConfigService
  const tempApp = await NestFactory.createApplicationContext(AppModule);
  const configService = tempApp.get(ConfigService);
  const grpcOptions = configService.get<GrpcConfig>('grpc');

  if (!grpcOptions) {
    logger.error('gRPC configuration not found. Exiting.');
    process.exit(1);
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'profile',
      protoPath: join(__dirname, '../proto/profile.proto'),
      url: grpcOptions.url,
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    },
  });

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted values are provided
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );

  // Enable graceful shutdown hooks
  app.enableShutdownHooks();

  await app.listen();
  logger.log(`Profile gRPC microservice is running on ${grpcOptions.url}`);
  await tempApp.close();
}
bootstrap();