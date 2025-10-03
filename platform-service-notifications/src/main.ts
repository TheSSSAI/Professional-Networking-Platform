import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { RedisIoAdapter } from './shared/websockets/redis-io.adapter';
import { WsExceptionFilter } from './shared/filters/ws-exception.filter';

/**
 * The main bootstrap function for the Messaging Service.
 * This function initializes and configures the NestJS application.
 *
 * It performs the following critical setup steps:
 * 1.  Creates a NestJS application instance from the root AppModule.
 * 2.  Retrieves configuration (ports, Redis URL, etc.) using ConfigService.
 * 3.  Instantiates and applies the RedisIoAdapter for horizontally scalable WebSockets.
 * 4.  Configures and connects the gRPC microservice transport for internal API communication.
 * 5.  Applies global middleware, pipes (for validation), and filters (for exceptions).
 * 6.  Enables graceful shutdown hooks for safe termination in production environments.
 * 7.  Starts both the HTTP/WebSocket server and the gRPC microservice.
 * 8.  Logs the application's listening ports for operational visibility.
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // --- WebSocket Configuration with Redis Adapter for Scalability ---
    // The RedisIoAdapter is crucial for horizontal scaling. It uses Redis Pub/Sub
    // to broadcast WebSocket events across all instances of the service, ensuring
    // that a message can be sent from any server instance to a client connected
    // to any other server instance.
    const redisAdapter = new RedisIoAdapter(app);
    await redisAdapter.connectToRedis();
    app.useWebSocketAdapter(redisAdapter);
    logger.log('Redis WebSocket adapter configured successfully.');

    // --- gRPC Microservice Configuration ---
    // The service exposes a gRPC interface for internal, high-performance communication,
    // primarily used by the API Gateway to fetch message history.
    const grpcPort = configService.get<number>('GRPC_PORT', 50052);
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        package: 'messaging',
        protoPath: join(process.cwd(), 'src/modules/messaging/proto/messaging.proto'),
        url: `0.0.0.0:${grpcPort}`,
      },
    });
    logger.log(`gRPC microservice configured to listen on port ${grpcPort}`);

    // --- Global Configuration ---
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strip properties that do not have any decorators
        forbidNonWhitelisted: true, // Throw an error if non-whitelisted values are provided
        transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      }),
    );
    app.useGlobalFilters(new WsExceptionFilter());
    logger.log('Global ValidationPipe and WsExceptionFilter applied.');

    // Enable CORS for the client application
    app.enableCors({
      origin: configService.get<string>('CORS_ORIGIN'),
      credentials: true,
    });
    logger.log(`CORS enabled for origin: ${configService.get('CORS_ORIGIN')}`);

    // --- Graceful Shutdown ---
    // Enables the application to shut down gracefully, closing active connections
    // and finishing ongoing tasks before exiting. This is vital for production
    // environments like Kubernetes.
    app.enableShutdownHooks();
    logger.log('Shutdown hooks enabled.');

    // --- Start Application ---
    await app.startAllMicroservices();
    const httpPort = configService.get<number>('PORT', 3002);
    await app.listen(httpPort);

    logger.log(`🚀 Messaging Service (HTTP/WebSocket) is running on: http://localhost:${httpPort}`);
    logger.log(`🚀 Messaging Service (gRPC) is running on: localhost:${grpcPort}`);
  } catch (error) {
    logger.error('Failed to bootstrap the application.', error.stack);
    process.exit(1);
  }
}

bootstrap();