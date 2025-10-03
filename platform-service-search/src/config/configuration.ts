import { registerAs } from '@nestjs/config';

/**
 * Defines and exports the application's configuration, loaded from environment variables.
 * This function is registered as a configuration object within the NestJS ConfigModule.
 *
 * @see https://docs.nestjs.com/techniques/configuration
 */
export default registerAs('config', () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 50053,
  
  opensearch: {
    node: process.env.OPENSEARCH_NODE || 'http://localhost:9200',
    username: process.env.OPENSEARCH_USERNAME || 'admin',
    password: process.env.OPENSEARCH_PASSWORD || 'admin',
    indexName: process.env.OPENSEARCH_INDEX_NAME || 'user_profiles',
  },

  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sqsQueueUrl: process.env.AWS_SQS_PROFILE_EVENTS_QUEUE_URL,
  },

  grpc: {
    connectionsServiceUrl:
      process.env.CONNECTIONS_SERVICE_GRPC_URL || 'localhost:50052',
    profileServiceUrl:
      process.env.PROFILE_SERVICE_GRPC_URL || 'localhost:50051',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    ttl: parseInt(process.env.REDIS_CACHE_TTL_SECONDS, 10) || 3600, // 1 hour
  },

  fuzziness: {
    // REQ-1-033: Default fuzziness level for OpenSearch queries.
    // 'AUTO' allows for Levenshtein distance of 1 for terms of 3-5 chars, and 2 for >5 chars.
    level: process.env.SEARCH_FUZZINESS_LEVEL || 'AUTO',
  }
}));