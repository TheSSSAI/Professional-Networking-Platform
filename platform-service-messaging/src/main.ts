import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import * as redis from 'redis';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { WsExceptionFilter } from './modules/messaging/filters/ws-exception.filter';

/**
 * A custom WebSocket adapter that uses Redis as a backplane.
 * This is CRITICAL for enabling horizontal scalability (REQ-1-052) for the stateful
 * Messaging Service. It allows multiple instances of the service to broadcast
 * events to all clients, regardless of which instance a client is connected to.
 * This directly solves the architectural conflict identified in the SDS.
 */
export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof redisIoAdapter>;
  private readonly logger = new Logger(RedisIoAdapter.name);

  constructor(
    private readonly app: INestApplicationContext,
    private readonly configService: ConfigService,
  ) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const host = this.configService.get<string>('REDIS_HOST');
    const port = this.configService.get<number>('REDIS_PORT');

    const pubClient = redis.createClient({ host, port });
    const subClient = pubClient.duplicate();

    this.adapterConstructor = redisIoAdapter({ pubClient, subClient });
    this.logger.log(`Socket.IO Redis adapter connected to redis://${host}:${port}`);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: [clientUrl],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    server.adapter(this.adapterConstructor);
    this.logger.log('Socket.IO server configured with Redis adapter.');
    return server;
  }
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // --- Global Configuration ---
    app.setGlobalPrefix('api');

    // Enable CORS for HTTP endpoints (e.g., REST controllers, if any)
    const clientUrl = configService.get<string>('CLIENT_URL');
    app.enableCors({
      origin: [clientUrl],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    logger.log(`CORS enabled for origin: ${clientUrl}`);
    
    // Global Pipes for DTO validation
    app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true, 
      transform: true,
      forbidNonWhitelisted: true,
    }));
    logger.log('Global ValidationPipe configured.');

    // Global Filters for WebSocket exceptions
    app.useGlobalFilters(new WsExceptionFilter());
    logger.log('Global WsExceptionFilter configured.');

    // --- WebSocket (Socket.IO) with Redis Adapter for Scalability ---
    const redisAdapter = new RedisIoAdapter(app, configService);
    await redisAdapter.connectToRedis();
    app.useWebSocketAdapter(redisAdapter);
    logger.log('RedisIoAdapter has been configured and applied.');

    // --- gRPC Microservice Configuration ---
    // This allows the service to listen for incoming gRPC calls (e.g., from API Gateway)
    // for functionalities like fetching message history (REQ-1-028).
    const grpcUrl = configService.get<string>('GRPC_URL');
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        url: grpcUrl,
        package: 'messaging',
        protoPath: join(process.cwd(), 'proto/messaging/messaging.proto'),
      },
    });
    logger.log(`gRPC microservice transport configured to listen on ${grpcUrl}`);

    // --- Start Application ---
    await app.startAllMicroservices();
    logger.log('All microservices have been started.');

    const port = configService.get<number>('PORT') || 3000;
    await app.listen(port);
    
    logger.log(`🚀 Messaging Service (WebSocket) is running on: http://localhost:${port}`);
    logger.log(`🚀 Messaging Service (gRPC) is running on: ${grpcUrl}`);
    logger.log('Application bootstrap complete.');

  } catch (error) {
    logger.error('Fatal error during application bootstrap', error.stack);
    process.exit(1);
  }
}

bootstrap();