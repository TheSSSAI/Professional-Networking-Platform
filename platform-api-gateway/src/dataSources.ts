import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { GraphQLRequestContext, GraphQLRequest } from 'apollo-server-lambda';
import { IAuthContext } from './types';

/**
 * @class AuthenticatedDataSource
 * @description A custom data source for Apollo Federation that extends the default
 * RemoteGraphQLDataSource. Its primary purpose is to intercept outgoing requests
 * to downstream microservices (subgraphs) and inject critical context headers,

 * such as authentication information and tracing IDs.
 *
 * This class is a key component in propagating user identity securely and enabling
 * distributed tracing across the microservice architecture.
 *
 * @see REQ-1-087: Enforce security policies, including token verification and authorization.
 *     This class forwards the result of the gateway's token verification to downstream services.
 * @see REQ-1-083: Implement a comprehensive observability stack. This class helps
 *     propagate tracing information.
 */
export class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  /**
   * @method willSendRequest
   * @description This lifecycle method is called by the Apollo Gateway before a request
   * is sent to a downstream service. It's used here to enrich the request with
   * headers derived from the incoming request's context, which is populated by the
   * AWS API Gateway Lambda authorizer.
   *
   * @param {Object} options - The request options.
   * @param {GraphQLRequest} options.request - The GraphQL request to be sent.
   * @param {IAuthContext} options.context - The GraphQL context for the current operation,
   *   containing authorizer data and other request-specific information.
   *
   * @returns {Promise<void>}
   */
  public async willSendRequest({
    request,
    context,
  }: {
    request: GraphQLRequest;
    context: IAuthContext;
  }): Promise<void> {
    // Ensure the headers object exists on the request.
    request.http.headers = request.http.headers || new Map<string, string>();

    // Forward user identity from the authorizer context to downstream services.
    // Downstream services can then use these headers for their own authorization logic.
    // This is a critical step for enforcing service-level permissions.
    if (context.user && context.user.id) {
      request.http.headers.set('x-user-id', context.user.id);

      if (context.user.roles && Array.isArray(context.user.roles)) {
        request.http.headers.set(
          'x-user-roles',
          JSON.stringify(context.user.roles),
        );
      }
    }

    // Propagate the AWS X-Ray trace ID to ensure a single, unified trace across all services.
    // This allows for end-to-end request tracing in the observability stack (e.g., Jaeger).
    // The `lambdaEvent.headers` contains the original headers from the API Gateway invocation.
    if (context.lambdaEvent?.headers) {
      const traceId = context.lambdaEvent.headers['x-amzn-trace-id'];
      if (traceId) {
        request.http.headers.set('x-amzn-trace-id', traceId);
      }
    }

    // Forward any other custom headers that might be needed for specific use cases,
    // such as A/B testing flags or client version information.
    // Example: Forwarding a request ID if provided by the client or API Gateway.
    if (context.requestId) {
        request.http.headers.set('x-request-id', context.requestId);
    }
  }

   /**
   * @method didReceiveResponse
   * @description This lifecycle method is called after a response is received from a
   * downstream service. It can be used for logging, metrics, or transforming the response.
   *
   * @template TContext
   * @param {GraphQLRequestContext<TContext>} requestContext - The context of the request.
   * @returns {Promise<any>} The processed response.
   */
  public async didReceiveResponse<TContext>({
    response,
    context,
  }: GraphQLRequestContext<TContext>): Promise<any> {
    // This is a good place to add logging for subgraph responses if needed for debugging.
    // For example, logging errors or slow responses from specific services.
    if (response.errors) {
      console.error(
        `[DataSource] Received errors from a downstream service for request ID: ${
          (context as IAuthContext).requestId
        }`,
        JSON.stringify(response.errors),
      );
    }
    
    return response;
  }
}

// Custom type definition to augment the context passed to the data source.
// This should match the shape of the context object created in `server.ts`.
// It is extended in this file for clarity and separation of concerns.
declare module './types' {
    interface IAuthContext {
        user?: {
            id: string;
            roles?: string[];
        };
        requestId?: string;
        lambdaEvent?: {
            headers: { [name: string]: string | undefined };
        };
    }
}