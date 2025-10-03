import * as Joi from 'joi';

/**
 * Defines the validation schema for all environment variables used by the application.
 * This schema is used by the NestJS ConfigModule to validate the environment at startup.
 * If any of the required variables are missing or have an invalid format, the application
 * will fail to start, ensuring a "fail-fast" approach to configuration errors.
 *
 * This provides a single source of truth for environment variable requirements and their types.
 */
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(50052),
  REDIS_URL: Joi.string().uri().required().default('redis://localhost:6379'),
  FEED_MAX_SIZE: Joi.number().integer().positive().default(1000),
  AWS_REGION: Joi.string().required().default('us-east-1'),
  SQS_QUEUE_URL: Joi.string().uri().required(),
  CONNECTIONS_GRPC_URL: Joi.string().required().default('localhost:50053'),
});