import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GrpcExceptionFilter } from './shared/infrastructure/filters/grpc-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const port = configService.get<number>('ADMIN_SERVICE_PORT', 5001);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'admin',
        protoPath: join(process.cwd(), 'proto/admin.proto'),
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

  app.useGlobalFilters(new GrpcExceptionFilter(new Logger(GrpcExceptionFilter.name)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away any properties that do not have any decorators
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted values are provided
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );

  app.enableShutdownHooks();

  await app.listen();
  logger.log(`Admin microservice is running on port ${port}`);
}
bootstrap();