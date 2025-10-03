import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

/**
 * Bootstraps the Connections microservice.
 * This is the entry point of the application. It sets up the NestJS application
 * instance as a gRPC microservice, configures global settings like validation pipes,
 * enables graceful shutdown hooks, and starts listening for incoming requests.
 */
async function bootstrap() {
  // Create a logger instance with the context of the main application bootstrap.
  const logger = new Logger('Bootstrap');

  // Define the options for the gRPC microservice.
  // This configuration tells NestJS how to set up the gRPC server.
  const grpcOptions: MicroserviceOptions = {
    // Specify gRPC as the transport layer.
    transport: Transport.GRPC,
    options: {
      // The URL where the gRPC server will listen for connections.
      // '0.0.0.0' binds to all available network interfaces, which is essential
      // for containerized environments like Docker and Kubernetes.
      // The port is sourced from an environment variable for configuration flexibility,
      // with a default fallback for local development.
      url: `0.0.0.0:${process.env.GRPC_PORT || 50051}`,

      // The package name defined in the .proto file. This is crucial for gRPC
      // to correctly map service definitions.
      package: 'connections',

      // The path to the Protocol Buffers definition file.
      // Using `join(__dirname, '..', 'proto/connections/connections.proto')` ensures a robust,
      // cross-platform compatible path from the compiled output directory (`dist`)
      // to the proto file in the project root.
      protoPath: join(__dirname, '..', 'proto/connections/connections.proto'),
      
      // Loader options to ensure that Protobuf default values are represented in DTOs.
      // e.g., a 'string' field will be '' instead of undefined if not present.
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    },
  };

  // Create the NestJS application instance as a microservice using the defined gRPC options.
  // AppModule is the root module of the application where all other modules are imported.
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    grpcOptions,
  );

  // Enable graceful shutdown hooks. This allows the application to listen for termination
  // signals (like SIGTERM from Kubernetes) and execute lifecycle hooks (e.g., OnModuleDestroy)
  // before shutting down. This is critical for preventing abrupt connection terminations
  // and ensuring a clean exit.
  app.enableShutdownHooks();

  // Apply a global ValidationPipe. This ensures that all incoming gRPC request DTOs
  // that use class-validator decorators are automatically validated.
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true strips away any properties that do not have any decorators.
      // This prevents malicious or extraneous data from being processed by the application.
      whitelist: true,
      
      // transform: true automatically transforms incoming payloads to their DTO class instances.
      // This enables type-safe objects within the handlers.
      transform: true,

      // forbidNonWhitelisted: true throws an error if non-whitelisted properties are present,
      // providing a stricter security posture than just stripping them.
      forbidNonWhitelisted: true,
    }),
  );

  // Start the microservice. The application will now listen for incoming gRPC requests
  // on the configured URL. The returned Promise resolves when the service is successfully listening.
  await app.listen();

  // Log a confirmation message indicating that the microservice has started successfully
  // and is listening on the specified URL. This is useful for development and monitoring.
  logger.log(`Connections gRPC microservice is running on ${grpcOptions.options.url}`);
}

// Execute the bootstrap function to start the application.
bootstrap();