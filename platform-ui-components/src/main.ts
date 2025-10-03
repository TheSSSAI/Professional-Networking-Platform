import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { join } from 'path';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';
import { AppModule } from './app.module';

/**
 * A custom WebSocket adapter that uses Redis for horizontal scaling.
 * This allows multiple instances of the messaging service to broadcast
 * events to all connected clients, regardless of which instance a client
 * is connected to. It fulfills the scalability requirement REQ-1-052.
 */
class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private readonly logger = new Logger(RedisIoAdapter.name);

  constructor(private app: INestApplication) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const configService = this.app.get(ConfigService);
    const redisUrl = configService.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.error(
        'REDIS_URL is not defined in the environment variables.',
      );
      throw new Error('REDIS_URL is not defined in the configuration.');
    }

    this.logger.log(`Attempting to connect to Redis for WebSocket adapter...`);

    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) =>
      this.logger.error('Redis Pub Client Error', err),
    );
    subClient.on('error', (err) =>
      this.logger.error('Redis Sub Client Error', err),
    );

    try {
      await Promise.all([pubClient.connect(), subClient.connect()]);
      this.adapterConstructor = createAdapter(pubClient, subClient);
      this.logger.log(
        'Successfully connected to Redis and created WebSocket adapter.',
      );
    } catch (error) {
      this.logger.error('Failed to connect to Redis for WebSocket adapter.', error);
      // Depending on the desired behavior, we might want to exit or run without the adapter.
      // For a critical service like messaging, failing to start is safer.
      throw error;
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const configService = this.app.get(ConfigService);
    const corsOrigin = configService.get<string>('CORS_ORIGIN', '');
    
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: corsOrigin ? corsOrigin.split(',') : true,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    } else {
        this.logger.warn('Redis adapter not initialized. Running in standalone mode.')
    }
    
    return server;
  }
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // --- Global Configuration ---
    const globalPrefix = configService.get<string>('GLOBAL_PREFIX', 'api');
    app.setGlobalPrefix(globalPrefix);

    const corsOrigin = configService.get<string>('CORS_ORIGIN', '');
    if (corsOrigin) {
      app.enableCors({
        origin: corsOrigin.split(','),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
      });
      logger.log(`CORS enabled for origins: ${corsOrigin}`);
    } else {
      logger.warn(`CORS_ORIGIN not set. CORS will be disabled or have default behavior.`);
    }

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    
    // --- Hybrid Application Setup (gRPC + WebSocket) ---

    // 1. Configure and connect the gRPC microservice for internal communication
    const grpcPort = configService.get<number>('GRPC_PORT', 50053);
    app.connectMicroservice<MicroserviceOptions>(
      {
        transport: Transport.GRPC,
        options: {
          package: 'messaging',
          protoPath: join(__dirname, '../proto/messaging.proto'),
          url: `0.0.0.0:${grpcPort}`,
        },
      },
      { inheritAppConfig: true }, // Inherit global pipes, guards, etc.
    );

    // 2. Configure and apply the Redis adapter for scalable WebSockets
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisIoAdapter);

    // --- Graceful Shutdown ---
    app.enableShutdownHooks();

    // --- Start Services ---
    await app.startAllMicroservices();

    const httpPort = configService.get<number>('PORT', 3003);
    await app.listen(httpPort);

    logger.log(
      `🚀 Messaging service (HTTP/WebSocket) is running on: http://localhost:${httpPort}/${globalPrefix}`,
    );
    logger.log(`🚀 Messaging service (gRPC) is listening on: 0.0.0.0:${grpcPort}`);
  } catch (error) {
    logger.error('❌ Failed to bootstrap the application', error);
    process.exit(1);
  }
}

bootstrap();