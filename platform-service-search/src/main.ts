import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GrpcExceptionFilter } from './common/filters/grpc-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const configService = appContext.get(ConfigService);
    const port = configService.get<number>('PORT') || 50053;

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.GRPC,
        options: {
          package: 'search',
          protoPath: join(
            __dirname,
            './modules/search/protos/search.proto',
          ),
          url: `0.0.0.0:${port}`,
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
          },
        },
      },
    );

    // Apply global validation pipe to ensure all incoming DTOs are validated.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strip away properties that do not have any decorators
        forbidNonWhitelisted: true, // Throw an error if non-whitelisted values are provided
        transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Apply global gRPC exception filter to translate exceptions into gRPC status codes.
    app.useGlobalFilters(new GrpcExceptionFilter());

    // Enable shutdown hooks to gracefully handle termination signals (e.g., from Kubernetes or Docker).
    // This is crucial for the SQS consumer to stop polling and finish processing current messages.
    app.enableShutdownHooks();

    await app.listen();
    logger.log(`Search microservice is listening on port ${port}`);
  } catch (error) {
    logger.error('Failed to bootstrap the application.', error.stack);
    process.exit(1);
  }
}

bootstrap();