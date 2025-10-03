# Caching Strategy for the API Gateway

To meet the stringent performance NFRs (**REQ-1-050**, **REQ-1-051**) and ensure a responsive user experience, the API Gateway layer employs a multi-layered caching strategy. This document outlines the two primary caching mechanisms.

## 1. Authorizer Response Caching (API Gateway Level)

### Purpose
To reduce the latency of JWT validation and minimize the load on the Identity Service's Lambda authorizer. As per **REQ-1-087**, every request to a protected route must be authorized. Without caching, this would mean invoking the authorizer Lambda on every single API call, adding significant latency.

### Mechanism
-   AWS API Gateway has a built-in feature to cache the responses from Lambda authorizers.
-   When a request arrives with a JWT, the gateway uses the token itself as the cache key.
-   If a valid, non-expired entry exists in the cache for that token, the gateway immediately uses the cached IAM policy (`Allow` or `Deny`) without invoking the Lambda function.
-   If no entry exists, the gateway invokes the authorizer, receives the response, and stores it in the cache for subsequent requests.

### Configuration (`serverless.yml`)
-   **Cache Key**: The `identitySource` is configured to be `$request.header.Authorization`. This makes the entire `Bearer <token>` string the key.
-   **TTL (Time-To-Live)**: A TTL of **300 seconds (5 minutes)** is configured. This provides a significant performance boost while ensuring that changes to a user's permissions or roles are reflected in a timely manner. Session revocation via the JWT blocklist is not affected by this cache, as a revoked token will be a different JWT and thus have a different cache key (or more accurately, the authorizer is still invoked for new tokens).

## 2. GraphQL Response Caching (Apollo Server Level)

### Purpose
To reduce latency for frequently requested, non-mutating GraphQL queries and to decrease the load on downstream microservices. This is particularly effective for data that changes infrequently, such as a user's profile details or the content of a popular post.

### Mechanism
-   The Apollo Server, running within our gateway Lambda, is configured with a **response cache**.
-   This implementation uses an external, shared cache provider: **Redis** (via AWS ElastiCache), as required by **REQ-1-070**.
-   When a GraphQL query is received, Apollo Server computes a cache key based on the query string and its variables.
-   It first checks Redis for an entry with this key.
    -   If a valid, non-expired cached response is found, it is returned immediately, and no downstream services are called.
    -   If no entry is found, the query is executed against the downstream services, and the resulting JSON response is stored in Redis before being sent to the client.

### Configuration (Apollo Server)
-   **Cache Provider**: The cache is configured to use the `Keyv` library with a Redis adapter. The Redis connection string is provided via an environment variable.
-   **Cache Control**: The cache respects GraphQL Cache Control hints. By default, responses are cached based on a global TTL, but individual fields or types in downstream service schemas can provide more granular `maxAge` hints to override the default.
-   **Session-Specific Caching**: The cache is configured to be **private** by default. This means the cache key will include a session identifier derived from the authenticated user's ID. This is critical to prevent one user from seeing cached data intended for another. Publicly accessible data can be marked with a `scope: PUBLIC` cache hint to be shared across all users.
-   **Default TTL**: A global default TTL of **60 seconds** is configured for cached responses. This provides a good balance between performance and data freshness for dynamic content.

By combining these two strategies, the gateway minimizes latency at both the security and application layers, ensuring a fast and scalable entry point for the entire platform.