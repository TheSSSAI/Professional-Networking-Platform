import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions } from '@opensearch-project/opensearch';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { getDefaultProvider } from '@aws-sdk/credential-provider-node';

/**
 * A factory class to generate OpenSearch client options dynamically
 * based on the application's configuration. This approach is used to
 * integrate with a NestJS dynamic module for OpenSearch.
 */
@Injectable()
export class OpenSearchConfigFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Creates the configuration options for the OpenSearch client.
   * In a production environment (not 'development'), it configures AWS SigV4 signing.
   *
   * @returns {ClientOptions} The options object for the OpenSearch client.
   */
  createOpenSearchOptions(): ClientOptions {
    const node = this.configService.get<string>('config.opensearch.node');
    const env = this.configService.get<string>('config.env');

    if (env !== 'development' && node.includes('amazonaws.com')) {
      // Production environment on AWS: use IAM for authentication
      return {
        ...AwsSigv4Signer({
          region: this.configService.get<string>('config.aws.region'),
          service: 'es',
          getCredentials: () => {
            const credentialsProvider = getDefaultProvider();
            return credentialsProvider();
          },
        }),
        node,
      };
    } else {
      // Development environment: use basic authentication
      return {
        node,
        auth: {
          username: this.configService.get<string>('config.opensearch.username'),
          password: this.configService.get<string>('config.opensearch.password'),
        },
        // In development, you might be using a self-signed cert
        ssl: {
          rejectUnauthorized: false,
        },
      };
    }
  }
}