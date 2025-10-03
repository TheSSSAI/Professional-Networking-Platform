import { ApolloServer } from '@apollo/server';
import {
  ApolloGateway,
  IntrospectAndCompose,
  RemoteGraphQLDataSource,
} from '@apollo/gateway';
import {
  startServerAndCreateLambdaHandler,
  LambdaContext,
} from '@as-integrations/aws-lambda';
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
} from 'aws-lambda';
import { GraphQLError } from 'graphql';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import Redis from 'ioredis';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';

import { AuthenticatedDataSource } from './dataSources';

// Define the shape of the context object that our Lambda authorizer provides.
// This aligns with docs/authorizer_contract.md
interface AuthorizerContext {
  lambda: {
    userId: string;
    claims: string; // This could be a stringified JSON object of JWT claims
  };
}

// Define the shape of our GraphQL context, which will be created from the authorizer context.
export interface PlatformGraphQLContext {
  user?: {
    id: string;
    claims: Record<string, any>;
  };
}

/**
 * Represents the configuration for the Apollo Gateway.
 */
interface GatewayConfig {
  subgraphs: { name: string; url: string }[];
  redisUrl: string;
  isProduction: boolean;
}

/**
 * ApolloGatewayLambda encapsulates the setup and configuration of the Apollo Server
 * running a federated Apollo Gateway, specifically for the AWS Lambda environment.
 * It handles wiring up data sources, caching, error formatting, and context creation.
 */
export class ApolloGatewayLambda {
  private readonly server: ApolloServer<PlatformGraphQLContext>;
  private readonly gateway: ApolloGateway;
  private readonly redis: Redis.Redis;

  constructor(config: GatewayConfig) {
    if (!config.redisUrl) {
      throw new Error('REDIS_URL must be provided for caching.');
    }

    this.redis = new Redis(config.redisUrl, {
      // Production-ready Redis options
      maxRetriesPerRequest: 3,
      connectTimeout: 10000,
    });

    this.redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    this.gateway = new ApolloGateway({
      supergraphSdl: new IntrospectAndCompose({
        subgraphs: config.subgraphs,
      }),
      // Use our custom data source class to forward headers to subgraphs.
      buildService(service) {
        return new AuthenticatedDataSource({ url: service.url });
      },
    });

    const httpServer = http.createServer();

    this.server = new ApolloServer<PlatformGraphQLContext>({
      gateway: this.gateway,
      // In a serverless environment, introspection should be enabled cautiously.
      // We enable it for dev/staging but would disable it in a hardened production environment.
      introspection: !config.isProduction,
      plugins: [
        // Proper graceful shutdown plugin
        ApolloServerPluginDrainHttpServer({ httpServer }),
        // Response caching to reduce load on downstream services
        responseCachePlugin({
          cache: new BaseRedisCache({ client: this.redis }),
          // Define a session-based cache key to ensure users only see their own cached data for private queries.
          sessionId: (requestContext) =>
            requestContext.contextValue.user?.id ?? null,
        }),
      ],
      /**
       * Formats errors before they are sent to the client.
       * In production, we scrub sensitive details and log the full error.
       * REQ-1-083: Contributes to observability by logging detailed errors.
       * NFR: Security - Prevents information leakage through error messages.
       */
      formatError: (formattedError, error) => {
        const originalError = error as GraphQLError;
        console.error(
          'GraphQL Error:',
          JSON.stringify(
            {
              message: originalError.message,
              locations: originalError.locations,
              path: originalError.path,
              extensions: originalError.extensions,
              stack: originalError.stack,
            },
            null,
            2,
          ),
        );

        if (config.isProduction) {
          // In production, return a generic error message to the client.
          return {
            message: 'An internal server error occurred.',
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
          };
        }

        // In non-production environments, return the detailed error.
        return formattedError;
      },
    });
  }

  /**
   * Creates an AWS Lambda handler function that is compatible with API Gateway V2 proxy integration.
   * This handler processes incoming HTTP requests, creates the GraphQL context, and invokes the Apollo Server.
   * @returns {APIGatewayProxyHandlerV2} The Lambda handler function.
   */
  public createHandler(): APIGatewayProxyHandlerV2 {
    return startServerAndCreateLambdaHandler(this.server, {
      /**
       * The context function is called for every incoming GraphQL request.
       * It's responsible for creating the context object that is available to all resolvers
       * and data sources.
       * REQ-1-087: This is where we integrate the security context from the Lambda Authorizer.
       */
      context: async ({
        event,
      }: LambdaContext<APIGatewayProxyEventV2>): Promise<PlatformGraphQLContext> => {
        const authorizerContext = event.requestContext
          ?.authorizer as AuthorizerContext;

        if (authorizerContext?.lambda?.userId) {
          try {
            const claims = JSON.parse(authorizerContext.lambda.claims || '{}');
            return {
              user: {
                id: authorizerContext.lambda.userId,
                claims: claims,
              },
            };
          } catch (error) {
            console.error('Failed to parse authorizer claims:', error);
            // Fail safely by treating the user as unauthenticated if claims are malformed.
            return {};
          }
        }

        // No user context from authorizer, treat as an anonymous request.
        return {};
      },
    });
  }
}