import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validationSchema } from './config/validation.schema';
import { configuration } from './config/configuration';

import { HealthModule } from './modules/health/health.module';
import { FeedModule } from './modules/feed/feed.module';
import { ConsumersModule } from './consumers/consumers.module';

/**
 * The root module of the Feed Service application.
 *
 * This module is responsible for importing and configuring all other modules
 * that make up the application. It sets up global configuration,
 * health checks, core business logic modules, and background consumers.
 *
 * @Module
 */
@Module({
  imports: [
    /**
     * ConfigModule.forRoot() loads and provides configuration values from environment variables.
     * - `isGlobal: true` makes the ConfigService available application-wide without needing to import ConfigModule elsewhere.
     * - `load: [configuration]` registers our custom configuration object.
     * - `validationSchema` uses a Joi schema to validate environment variables on application startup, ensuring
     *   that the service fails fast if essential configuration is missing or invalid. This aligns with REQ-1-052 for robust services.
     */
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: validationSchema,
      cache: true, // Caches environment variables for performance
    }),

    /**
     * HealthModule provides a gRPC health check endpoint, essential for service discovery
     * and monitoring in orchestrated environments like Kubernetes.
     */
    HealthModule,

    /**
     * FeedModule encapsulates the core business logic of this microservice.
     * It contains the gRPC controller for serving feeds and the service logic for
     * orchestrating the fan-out process, as defined in REQ-1-020.
     */
    FeedModule,

    /**
     * ConsumersModule bootstraps the background SQS consumer.
     * Importing this module ensures that the consumer service is instantiated
     * by the NestJS dependency injection container and its lifecycle hooks
     * (like OnModuleInit) are triggered to start polling for messages.
     */
    ConsumersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}