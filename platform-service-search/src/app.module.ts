import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { SearchModule } from './modules/search/search.module';
import { IndexerModule } from './modules/indexer/indexer.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        // Application
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),

        // OpenSearch
        OPENSEARCH_NODE: Joi.string().required(),
        OPENSEARCH_USERNAME: Joi.string().required(),
        OPENSEARCH_PASSWORD: Joi.string().required(),
        OPENSEARCH_INDEX_NAME: Joi.string().default('user_profiles'),

        // AWS
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        SQS_QUEUE_URL: Joi.string().uri().required(),

        // gRPC Clients
        GRPC_PROFILE_SERVICE_URL: Joi.string().required(),
        GRPC_CONNECTIONS_SERVICE_URL: Joi.string().required(),

        // Caching (Redis)
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    SearchModule,
    IndexerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}