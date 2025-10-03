import { registerAs } from '@nestjs/config';

/**
 * Defines and exports the application's configuration structure.
 * This function is loaded by the NestJS ConfigModule and provides a typed configuration object
 * that is accessible throughout the application via the ConfigService.
 *
 * It reads values from environment variables (`process.env`), providing defaults for development
 * and ensuring that all configuration is centralized.
 */
export default registerAs('config', () => ({
  env: process.env.NODE_ENV || 'development',
  app: {
    port: parseInt(process.env.PORT, 10) || 50052,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    feedMaxSize: parseInt(process.env.FEED_MAX_SIZE, 10) || 1000,
  },
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    sqsQueueUrl: process.env.SQS_QUEUE_URL,
  },
  services: {
    connectionsGrpcUrl:
      process.env.CONNECTIONS_GRPC_URL || 'localhost:50053',
  },
}));