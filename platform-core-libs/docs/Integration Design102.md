# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | REPO-LIB-CORE |
| Extraction Timestamp | 2024-07-16T10:30:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 100% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-083

#### 1.2.1.2 Requirement Text

The system must implement a comprehensive observability stack. All microservices must be instrumented using the OpenTelemetry standard. The collected data will be fed into a platform consisting of: Prometheus for metrics collection and alerting, Grafana for dashboards and visualization, Loki for centralized log aggregation, and Jaeger for distributed tracing to analyze request flows across services.

#### 1.2.1.3 Validation Criteria

- Verify services are instrumented with OpenTelemetry SDKs.
- Verify service logs are being shipped to and are searchable in Loki.
- Verify that a request to the API Gateway generates a distributed trace that can be viewed in Jaeger.

#### 1.2.1.4 Implementation Implications

- This library must provide a NestJS module that configures and initializes the OpenTelemetry SDK for tracing and metrics.
- A standardized LoggerService must be created to format logs as JSON compatible with Loki and automatically inject trace context (traceId, spanId).
- NestJS interceptors or guards should be provided to automatically create spans for incoming requests and instrument function calls for tracing and metrics.

#### 1.2.1.5 Extraction Reasoning

This requirement is a primary driver for the existence of the platform-core-libs repository. The library is responsible for providing the concrete, reusable implementation of the observability stack for all backend microservices, as stated in its description.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-063

#### 1.2.2.2 Requirement Text

The application codebase must adhere to high-quality standards. It must be organized into logical, modular components. All significant functions and modules must be documented with comments. A consistent code style guide must be followed, with compliance automatically enforced by linting tools integrated into the development and CI/CD process.

#### 1.2.2.3 Validation Criteria

- Verify that linting and formatting checks are part of the CI pipeline and that builds fail on violations.
- Conduct code reviews to ensure the code is modular and documentation standards are being met.

#### 1.2.2.4 Implementation Implications

- This library must define and export base ESLint and Prettier configurations for other services to extend.
- The library's own CI/CD pipeline must rigorously enforce these quality standards as a model for other repositories.
- Code within this library must be exceptionally well-documented and structured into logical NestJS modules.

#### 1.2.2.5 Extraction Reasoning

This requirement is fundamental to the library's purpose, which is to enforce consistent patterns and reduce code duplication. It directly governs the internal quality of the library and provides the tools (linting configs) for other services to meet this requirement.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-005

#### 1.2.3.2 Requirement Text

The system shall implement a token blocklist mechanism using a Redis cache to enable immediate token revocation. This blocklist must be checked for every authenticated request. Tokens must be added to the blocklist upon security-sensitive events, including but not limited to user logout and password changes, to prevent their further use.

#### 1.2.3.3 Validation Criteria

- Verify that upon user logout, the associated access and refresh tokens are added to the blocklist.
- Verify that a token on the blocklist is rejected when used to access a protected resource.

#### 1.2.3.4 Implementation Implications

- This library must provide the `JwtAuthGuard` which performs the check against the Redis blocklist.
- The guard will require a Redis client to be injected by the consuming service.
- The library will provide the service logic for adding tokens to the blocklist, which will be used by other services like the Identity Service.

#### 1.2.3.5 Extraction Reasoning

This library centralizes the implementation of security-critical, cross-cutting concerns. The logic for checking the JWT blocklist on every request is a perfect example of such a concern that should be implemented once in this library and reused by all services.

## 1.3.0.0 Relevant Components

### 1.3.1.0 Component Name

#### 1.3.1.1 Component Name

ObservabilityModule

#### 1.3.1.2 Component Specification

Provides a standardized NestJS module for bootstrapping OpenTelemetry instrumentation. It configures exporters for traces (to Jaeger) and metrics (to Prometheus) and provides a custom LoggerService that integrates with the OpenTelemetry context to enrich logs with trace and span IDs for correlation in Loki.

#### 1.3.1.3 Implementation Requirements

- Must be configurable via a `.forRootAsync` method to accept service-specific configuration (e.g., service name) from the consuming application's `ConfigModule`.
- The LoggerService must be injectable and provide standard logging methods (log, error, warn, debug).
- The module should globally provide interceptors to automatically instrument incoming gRPC requests.

#### 1.3.1.4 Architectural Context

Part of the 'Cross-Cutting Concerns' layer, this component provides the foundational observability implementation for all backend services.

#### 1.3.1.5 Extraction Reasoning

This component directly implements REQ-1-083 and is explicitly mentioned in the repository's decomposition rationale as 'OpenTelemetry tracing and metrics boilerplate' and 'Standardized logger configuration'.

### 1.3.2.0 Component Name

#### 1.3.2.1 Component Name

SecurityModule

#### 1.3.2.2 Component Specification

Provides shared security primitives for NestJS applications. Its primary exports are the `JwtAuthGuard` for validating JWT access tokens on incoming requests and a `RolesGuard` for RBAC. It also contains the `TokenBlocklistService` for integrating with the session blocklist.

#### 1.3.2.3 Implementation Requirements

- The `JwtAuthGuard` must validate the JWT signature, expiry, and claims.
- The `JwtAuthGuard` requires a dependency on a Redis client to check the token's JTI against the JWT blocklist as per REQ-1-005.
- The `RolesGuard` must be implemented to work with a custom `@Roles()` decorator.
- The module must be configurable to accept JWT secrets and Redis connection details from the consuming service.

#### 1.3.2.4 Architectural Context

A core part of the 'Cross-Cutting Concerns' layer, used to enforce consistent authentication and authorization policies across all protected endpoints in the microservices architecture.

#### 1.3.2.5 Extraction Reasoning

This component is explicitly mentioned in the repository's description as providing 'Shared authorization guards' and is a key exposed contract for fulfilling multiple security requirements.

## 1.4.0.0 Architectural Layers

- {'layer_name': 'L5_CROSS_CUTTING', 'layer_responsibilities': 'Concerns that span multiple layers and services, implemented as shared libraries, middleware, or sidecar containers. This includes providing a unified observability stack, CI/CD utilities, infrastructure as code definitions, and shared utilities for security, configuration, and exception handling.', 'layer_constraints': ['Must not contain business-specific logic.', 'Shared libraries in this layer should be lightweight and have minimal performance overhead.'], 'implementation_patterns': ['Shared Library', 'Dependency Injection'], 'extraction_reasoning': 'The platform-core-libs repository is explicitly a shared library for cross-cutting concerns like observability, security, and error handling, which perfectly aligns with the definition of the L5_CROSS_CUTTING layer from the architecture cache.'}

## 1.5.0.0 Dependency Interfaces

- {'interface_name': 'IPlatformContracts', 'source_repository': 'REPO-LIB-CONTRACTS', 'method_contracts': [{'method_name': 'N/A (Type Definitions)', 'method_signature': 'export interface JwtPayload { sub: string; email: string; roles: string[]; jti: string; }', 'method_purpose': 'To provide consistent, shared TypeScript type definitions and interfaces for data structures used across all microservices.', 'integration_context': 'Consumed at build-time. For example, the `JwtAuthGuard` in this library will use the `JwtPayload` interface from `platform-contracts` to strongly type the user object it attaches to the request after token validation.'}], 'integration_pattern': 'Build-Time Dependency (NPM Package)', 'communication_protocol': 'TypeScript Type Imports', 'extraction_reasoning': "As an implementation library, its primary need from the contracts repository is to use the shared type definitions to ensure its logic (e.g., parsing a JWT) aligns with the system's data contracts. This makes the `platform-contracts` package a mandatory dependency."}

## 1.6.0.0 Exposed Interfaces

### 1.6.1.0 Interface Name

#### 1.6.1.1 Interface Name

LoggerService

#### 1.6.1.2 Consumer Repositories

- REPO-SVC-IDT
- REPO-SVC-PRF
- REPO-SVC-CONN
- REPO-SVC-POSTS
- REPO-SVC-ENGAGE
- REPO-SVC-FEED
- REPO-SVC-MSG
- REPO-SVC-SEARCH
- REPO-SVC-NOTIFY
- REPO-SVC-ADMIN

#### 1.6.1.3 Method Contracts

##### 1.6.1.3.1 Method Name

###### 1.6.1.3.1.1 Method Name

log

###### 1.6.1.3.1.2 Method Signature

log(message: string, context?: string, ...meta: any[]): void

###### 1.6.1.3.1.3 Method Purpose

Writes a structured log message at the INFO level. Automatically enriches the log with trace context from OpenTelemetry.

###### 1.6.1.3.1.4 Implementation Requirements

Must be implemented as a NestJS injectable service. Must format output as JSON compatible with Loki.

##### 1.6.1.3.2.0 Method Name

###### 1.6.1.3.2.1 Method Name

error

###### 1.6.1.3.2.2 Method Signature

error(message: string, trace?: string, context?: string, ...meta: any[]): void

###### 1.6.1.3.2.3 Method Purpose

Writes a structured log message at the ERROR level, including a stack trace. Automatically enriches the log with trace context.

###### 1.6.1.3.2.4 Implementation Requirements

Must be implemented as a NestJS injectable service. Must format output as JSON compatible with Loki.

#### 1.6.1.4.0.0 Service Level Requirements

- Must add negligible overhead to application performance.

#### 1.6.1.5.0.0 Implementation Constraints

- Must integrate seamlessly with the NestJS lifecycle and dependency injection.

#### 1.6.1.6.0.0 Extraction Reasoning

This service is explicitly listed as an exposed contract and is the primary implementation of the standardized logging required by REQ-1-083, consumed by all backend microservices.

### 1.6.2.0.0.0 Interface Name

#### 1.6.2.1.0.0 Interface Name

JwtAuthGuard

#### 1.6.2.2.0.0 Consumer Repositories

- REPO-SVC-IDT
- REPO-SVC-PRF
- REPO-SVC-CONN
- REPO-SVC-POSTS
- REPO-SVC-ENGAGE
- REPO-SVC-FEED
- REPO-SVC-MSG
- REPO-SVC-SEARCH
- REPO-SVC-NOTIFY
- REPO-SVC-ADMIN

#### 1.6.2.3.0.0 Method Contracts

- {'method_name': 'canActivate', 'method_signature': 'canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>', 'method_purpose': 'A standard NestJS Guard method that intercepts incoming gRPC/HTTP requests. It validates the JWT access token from the request metadata/headers and checks if the token has been revoked by consulting the session blocklist (REQ-1-005).', 'implementation_requirements': 'Must throw an `RpcException` (for gRPC) or `UnauthorizedException` (for HTTP) if the token is invalid, expired, or blocklisted. Must attach the validated token payload (`JwtPayload` from `platform-contracts`) to the request object for use by subsequent handlers.'}

#### 1.6.2.4.0.0 Service Level Requirements

- The token validation, including the blocklist check, must be highly performant to minimize latency on every authenticated request.

#### 1.6.2.5.0.0 Implementation Constraints

- Requires a configured Redis client to be available via dependency injection to perform the blocklist check.

#### 1.6.2.6.0.0 Extraction Reasoning

This guard is explicitly listed as an exposed contract and is the cornerstone of implementing a consistent authentication and session invalidation strategy across all microservices, as required by REQ-1-005 and general security principles.

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The library must be built using TypeScript and the NestJS framework. All sharable logic must be packaged into NestJS Modules, Providers, and Guards to ensure seamless integration with consumer services.

### 1.7.2.0.0.0 Integration Technologies

- @nestjs/common
- @opentelemetry/api
- NPM (as a private package)

### 1.7.3.0.0.0 Performance Constraints

Shared utilities must be lightweight and add minimal performance overhead to the services that consume them. Functions called frequently, like guards or interceptors, must be highly optimized.

### 1.7.4.0.0.0 Security Requirements

Shared security components, particularly the JwtAuthGuard, must be rigorously tested against all authentication and authorization requirements, including token validation and blocklist checking. The library must not contain any hardcoded secrets.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | The extracted context completely covers all respon... |
| Cross Reference Validation | Requirements for observability (REQ-1-083) and cod... |
| Implementation Readiness Assessment | High. The context provides specific implementation... |
| Quality Assurance Confirmation | The analysis was performed systematically. All exp... |

