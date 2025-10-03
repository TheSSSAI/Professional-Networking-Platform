import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';
import { OpenSearchService } from './opensearch.service';
import { OpenSearchConfig } from '../../config/opensearch.config';

@Module({})
export class OpenSearchModule {
  static forRootAsync(): DynamicModule {
    const openSearchClientProvider = {
      provide: Client,
      useFactory: (configService: ConfigService): Client => {
        const osConfig = configService.get<OpenSearchConfig>('opensearch');
        if (!osConfig) {
          throw new Error('OpenSearch configuration is missing.');
        }

        // In production environments like AWS OpenSearch within a VPC,
        // you might need to configure SSL without rejecting unauthorized connections,
        // especially if you're not using a custom CA. This is a common setup.
        const isProduction = process.env.NODE_ENV === 'production';

        return new Client({
          node: osConfig.node,
          auth: {
            username: osConfig.username,
            password: osConfig.password,
          },
          // Production-specific SSL configuration for AWS OpenSearch
          ...(isProduction && {
            ssl: {
              // This might be required depending on your VPC setup.
              // For production, it's better to use a proper CA.
              rejectUnauthorized: false,
            },
          }),
        });
      },
      inject: [ConfigService],
    };

    return {
      module: OpenSearchModule,
      imports: [ConfigModule],
      providers: [openSearchClientProvider, OpenSearchService],
      exports: [OpenSearchService],
      global: true, // Making this global to avoid importing it in every feature module
    };
  }
}