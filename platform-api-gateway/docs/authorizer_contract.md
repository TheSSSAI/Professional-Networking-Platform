# AWS API Gateway Lambda Authorizer Contract

## 1. Overview

This document specifies the contract for the Lambda-based custom authorizer used by the AWS API Gateway. This authorizer is responsible for validating JSON Web Tokens (JWTs) for every incoming request to protected routes, as mandated by requirement **REQ-1-087**. It acts as the primary security gatekeeper for the platform's GraphQL API.

The authorizer implements a `REQUEST` type for API Gateway HTTP APIs (Payload format 2.0).

## 2. Authorization Flow

The logic follows a strict, sequential process to ensure security and performance:

1.  **Extract Token**: The authorizer receives the request event and extracts the JWT from the `Authorization` header.
2.  **Validate Token Format**: It verifies that the header value is in the format `Bearer <token>`.
3.  **Decode and Verify Signature**: It decodes the JWT and verifies its cryptographic signature against the public key (JWKS) provided by the Identity Service.
4.  **Validate Claims**: It checks standard claims, specifically `exp` (expiration) to ensure the token is not expired.
5.  **Check Blocklist (Revocation)**: It checks if the token's unique identifier (`jti` claim) exists in the Redis-based token blocklist, as required by **REQ-1-005**. This handles immediate session invalidation upon logout or password change.
6.  **Generate Policy**: If all checks pass, it generates an `Allow` IAM policy. If any check fails, it generates a `Deny` policy.
7.  **Return Response**: It returns the policy and a context object containing the user's identity (`userId`, `roles`, etc.).

## 3. Input: Request Event Payload

The Lambda function receives an event object from API Gateway matching the `APIGatewayProxyEventV2` structure. The most critical part is the `headers` object.

**Example Input:**
```json
{
  "version": "2.0",
  "routeKey": "POST /graphql",
  "rawPath": "/v1/graphql",
  "rawQueryString": "",
  "headers": {
    "accept": "application/json",
    "authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1IiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyLWFhYmItY2NjYy1kZGRkIiwicm9sZXMiOlsidXNlciJdLCJqdGkiOiJqdGktMTIzNDUiLCJleHAiOjE2NzI1MzI0NjF9.SIGNATURE",
    "content-type": "application/json",
    "host": "api.platform.com",
    "x-forwarded-for": "192.0.2.1"
  },
  "requestContext": {
    "accountId": "123456789012",
    "apiId": "abcdef123",
    "domainName": "api.platform.com",
    "http": {
      "method": "POST",
      "path": "/v1/graphql",
      "protocol": "HTTP/1.1",
      "sourceIp": "192.0.2.1",
      "userAgent": "ClientApp/1.0"
    },
    "stage": "prod"
  },
  "isBase64Encoded": false
}
```

## 4. Output: Authorizer Response Payload

The authorizer MUST return a JSON object with two main properties: `isAuthorized` (a boolean) and `context` (an object). For `REQUEST` authorizers, if `isAuthorized` is `false`, API Gateway automatically returns a 401/403.

### 4.1. Successful Authorization (Allow)

If the token is valid, the authorizer returns `isAuthorized: true` and a `context` object containing user identity information. This context is then made available to the downstream integration (the Apollo Gateway Lambda).

**Example Success Output:**
```json
{
  "isAuthorized": true,
  "context": {
    "userId": "user-aabb-cccc-dddd",
    "roles": "[\"user\"]",
    "jti": "jti-12345"
  }
}
```
**Note:** All context values must be strings, booleans, or numbers. Complex objects must be stringified (e.g., the `roles` array).

### 4.2. Failed Authorization (Deny)

If any validation step fails (invalid signature, expired token, token on blocklist), the authorizer returns `isAuthorized: false`. API Gateway will then block the request.

**Example Failure Output:**
```json
{
  "isAuthorized": false,
  "context": {
    "reason": "Token expired"
  }
}
```

The `context` in the failure case is for logging/debugging purposes and is not passed downstream.

## 5. Caching

To meet performance NFRs (**REQ-1-051**), API Gateway authorizer response caching is **ENABLED**.
- **Cache Key**: The cache key is the full value of the `Authorization` header. This means the result for a given JWT is cached.
- **TTL (Time-To-Live)**: The cache TTL is configured to a short duration (e.g., `300` seconds / 5 minutes) as a balance between performance and security responsiveness. A shorter TTL ensures that if a user's roles change, the change is reflected within 5 minutes. Revoked tokens are handled immediately by the blocklist check and are not the primary concern for this cache TTL.

---