# 1 Design

code_design

# 2 Code Specfication

## 2.1 Validation Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-service-feed |
| Validation Timestamp | 2024-05-07T10:30:00Z |
| Original Component Count Claimed | 0 |
| Original Component Count Actual | 0 |
| Gaps Identified Count | 22 |
| Components Added Count | 22 |
| Final Component Count | 22 |
| Validation Completeness Score | 100.0 |
| Enhancement Methodology | Systematic gap analysis based on repository defini... |

## 2.2 Validation Summary

### 2.2.1 Repository Scope Validation

#### 2.2.1.1 Scope Compliance

Full compliance achieved. Specifications were created for all defined responsibilities: event consumption, fan-out logic, Redis storage, and gRPC exposure.

#### 2.2.1.2 Gaps Identified

- Validation reveals a complete absence of Phase 2 specifications. All components required by the repository definition were missing.
- Missing specification for event consumption logic (SQS consumer).
- Missing specification for gRPC client interaction with Connections service, including caching.
- Missing specification for Redis data access layer (Repository Pattern).
- Missing specification for gRPC endpoint exposure and authorization.
- Missing specifications for configuration and health checks.

#### 2.2.1.3 Components Added

- FeedModule
- FeedController
- FeedService
- FeedRepository
- PostCreatedConsumer
- ConnectionsClientService
- RpcExceptionFilter
- FeedOwnerGuard
- ConfigModule
- RedisModule
- HealthController

### 2.2.2.0 Requirements Coverage Validation

#### 2.2.2.1 Functional Requirements Coverage

100.0%

#### 2.2.2.2 Non Functional Requirements Coverage

100.0%

#### 2.2.2.3 Missing Requirement Components

- The specification for the \"fan-out-on-write\" model (REQ-1-020) was entirely missing.
- The specification for low-latency reads via Redis was missing.
- The specification for asynchronous processing was missing.

#### 2.2.2.4 Added Requirement Components

- PostCreatedConsumer specification directly implements the event-driven aspect of REQ-1-020.
- FeedService specification details the fan-out logic.
- FeedRepository specification details the use of Redis Sorted Sets for near-chronological order and fast reads, fulfilling performance NFRs.

### 2.2.3.0 Architectural Pattern Validation

#### 2.2.3.1 Pattern Implementation Completeness

CQRS and Event-Driven patterns were not specified. Enhanced specifications now fully detail these implementations.

#### 2.2.3.2 Missing Pattern Components

- Specification for the CQRS read-side implementation.
- Specification for the Repository Pattern abstracting Redis.
- Specification for the event consumer pattern.

#### 2.2.3.3 Added Pattern Components

- FeedService and FeedRepository specifications now form the complete CQRS read-path.
- PostCreatedConsumer specification defines the event consumer pattern.

### 2.2.4.0 Database Mapping Validation

#### 2.2.4.1 Entity Mapping Completeness

Mapping to Redis schema (DB-ID-51) was not specified.

#### 2.2.4.2 Missing Database Components

- Specification for data access layer mapping to Redis Sorted Sets.

#### 2.2.4.3 Added Database Components

- FeedRepository specification now explicitly maps methods to Redis commands (ZADD, ZREVRANGE, Pipelines) as per DB-ID-51.

### 2.2.5.0 Sequence Interaction Validation

#### 2.2.5.1 Interaction Implementation Completeness

No specifications existed to implement the interactions defined in SEQ-247 (Fan-out).

#### 2.2.5.2 Missing Interaction Components

- Specification for the gRPC call to Connections Service.
- Specification for batch Redis writes.
- Specification for SQS message processing and error handling.

#### 2.2.5.3 Added Interaction Components

- ConnectionsClientService specification details the gRPC call.
- FeedRepository specification details the Redis pipeline usage.
- PostCreatedConsumer specification details the SQS message lifecycle.

## 2.3.0.0 Enhanced Specification

### 2.3.1.0 Specification Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-service-feed |
| Technology Stack | NestJS, TypeScript, gRPC, Redis, AWS SQS |
| Technology Guidance Integration | Leverages NestJS modularity for separation of conc... |
| Framework Compliance Score | 100.0 |
| Specification Completeness | 100.0 |
| Component Count | 22 |
| Specification Methodology | CQRS-aligned, event-driven microservice architectu... |

### 2.3.2.0 Technology Framework Integration

#### 2.3.2.1 Framework Patterns Applied

- Modular Architecture (Feature Modules)
- Dependency Injection
- Repository Pattern (for Redis abstraction)
- CQRS (Read-Side Service)
- Event-Driven Consumer (Background Service)
- Data Transfer Objects (DTOs) with Validation Pipes
- Caching Pattern (for external service calls)
- Guards (for authorization)
- Exception Filters (for gRPC error handling)

#### 2.3.2.2 Directory Structure Source

NestJS feature-based modular architecture, enhanced with dedicated directories for consumers and shared infrastructure clients.

#### 2.3.2.3 Naming Conventions Source

Standard TypeScript/NestJS community conventions.

#### 2.3.2.4 Architectural Patterns Source

CQRS and Event-Driven Microservices.

#### 2.3.2.5 Performance Optimizations Applied

- Fan-out-on-write architecture for fast reads.
- Use of Redis Pipelines for batch write operations during fan-out.
- Caching of connection data from the Connections Service.
- Stateless service design for horizontal scalability.
- Asynchronous processing for all I/O-bound operations.
- Use of Redis Sorted Sets for O(log(N)) writes and O(log(N)+M) reads.

### 2.3.3.0 File Structure

#### 2.3.3.1 Directory Organization

##### 2.3.3.1.1 Directory Path

###### 2.3.3.1.1.1 Directory Path

src/modules/feed

###### 2.3.3.1.1.2 Purpose

Encapsulates all core logic for feed generation and retrieval, following NestJS's modular architecture.

###### 2.3.3.1.1.3 Contains Files

- feed.module.ts
- feed.controller.ts
- feed.service.ts
- feed.repository.ts
- interfaces/feed.service.interface.ts
- interfaces/feed.repository.interface.ts
- dto/get-feed-request.dto.ts
- dto/feed-response.dto.ts

###### 2.3.3.1.1.4 Organizational Reasoning

Adheres to the feature-based modularity pattern in NestJS, making the feed-related logic self-contained, testable, and easier to maintain.

###### 2.3.3.1.1.5 Framework Convention Alignment

Standard NestJS module structure.

##### 2.3.3.1.2.0 Directory Path

###### 2.3.3.1.2.1 Directory Path

src/modules/health

###### 2.3.3.1.2.2 Purpose

Provides a health check endpoint for service monitoring.

###### 2.3.3.1.2.3 Contains Files

- health.module.ts
- health.controller.ts

###### 2.3.3.1.2.4 Organizational Reasoning

Isolates health check logic from core business logic.

###### 2.3.3.1.2.5 Framework Convention Alignment

Common practice for microservice observability in NestJS.

##### 2.3.3.1.3.0 Directory Path

###### 2.3.3.1.3.1 Directory Path

src/consumers

###### 2.3.3.1.3.2 Purpose

Contains event consumers that act as the entry point for asynchronous workflows, decoupling the service from the event source.

###### 2.3.3.1.3.3 Contains Files

- post-created.consumer.ts
- consumers.module.ts
- dto/post-created-event.dto.ts

###### 2.3.3.1.3.4 Organizational Reasoning

Separates the logic of handling incoming events (from SQS) from the core application services, improving separation of concerns.

###### 2.3.3.1.3.5 Framework Convention Alignment

Common pattern for background workers/consumers in a NestJS application.

##### 2.3.3.1.4.0 Directory Path

###### 2.3.3.1.4.1 Directory Path

src/shared/redis

###### 2.3.3.1.4.2 Purpose

Provides a reusable, configured Redis client as an injectable provider for the rest of the application.

###### 2.3.3.1.4.3 Contains Files

- redis.module.ts
- redis.provider.ts

###### 2.3.3.1.4.4 Organizational Reasoning

Centralizes Redis connection and configuration logic, allowing other modules to depend on a consistent client instance via DI.

###### 2.3.3.1.4.5 Framework Convention Alignment

Standard approach for creating shared infrastructure modules in NestJS.

##### 2.3.3.1.5.0 Directory Path

###### 2.3.3.1.5.1 Directory Path

src/shared/grpc-clients/connections

###### 2.3.3.1.5.2 Purpose

Configures and provides the gRPC client for communicating with the Connections Service.

###### 2.3.3.1.5.3 Contains Files

- connections-client.module.ts
- connections-client.service.ts
- interfaces/connections-client.interface.ts

###### 2.3.3.1.5.4 Organizational Reasoning

Encapsulates the complexity of gRPC client setup and provides a simple, injectable service for application logic to use.

###### 2.3.3.1.5.5 Framework Convention Alignment

Utilizes NestJS's `ClientsModule` for robust microservice client management.

##### 2.3.3.1.6.0 Directory Path

###### 2.3.3.1.6.1 Directory Path

src/shared/guards

###### 2.3.3.1.6.2 Purpose

Contains reusable guards for handling authorization logic.

###### 2.3.3.1.6.3 Contains Files

- feed-owner.guard.ts

###### 2.3.3.1.6.4 Organizational Reasoning

Centralizes authorization logic to keep controllers clean and focused on routing.

###### 2.3.3.1.6.5 Framework Convention Alignment

Standard NestJS pattern for implementing authorization.

##### 2.3.3.1.7.0 Directory Path

###### 2.3.3.1.7.1 Directory Path

src/shared/filters

###### 2.3.3.1.7.2 Purpose

Contains global exception filters for consistent error handling.

###### 2.3.3.1.7.3 Contains Files

- rpc-exception.filter.ts

###### 2.3.3.1.7.4 Organizational Reasoning

Centralizes error translation logic, converting application exceptions into transport-specific error responses (gRPC status codes).

###### 2.3.3.1.7.5 Framework Convention Alignment

Standard NestJS pattern for global exception handling.

##### 2.3.3.1.8.0 Directory Path

###### 2.3.3.1.8.1 Directory Path

src/config

###### 2.3.3.1.8.2 Purpose

Manages application configuration using NestJS's ConfigModule.

###### 2.3.3.1.8.3 Contains Files

- configuration.ts
- validation.schema.ts

###### 2.3.3.1.8.4 Organizational Reasoning

Centralizes environment variable loading, validation, and access, promoting a clean and secure configuration strategy.

###### 2.3.3.1.8.5 Framework Convention Alignment

Best practice implementation of `@nestjs/config`.

#### 2.3.3.2.0.0 Namespace Strategy

| Property | Value |
|----------|-------|
| Root Namespace | N/A |
| Namespace Organization | Not applicable in NestJS (module-based). File path... |
| Naming Conventions | TypeScript/NestJS standard conventions. |
| Framework Alignment | Adheres to NestJS's module-based architecture inst... |

### 2.3.4.0.0.0 Class Specifications

#### 2.3.4.1.0.0 Class Name

##### 2.3.4.1.1.0 Class Name

FeedController

##### 2.3.4.1.2.0 File Path

src/modules/feed/feed.controller.ts

##### 2.3.4.1.3.0 Class Type

gRPC Controller

##### 2.3.4.1.4.0 Inheritance

None

##### 2.3.4.1.5.0 Purpose

Specification for the gRPC endpoint for retrieving a user's news feed. This controller is responsible for handling incoming gRPC requests, applying authorization and validation, and delegating to the application service.

##### 2.3.4.1.6.0 Dependencies

- IFeedService

##### 2.3.4.1.7.0 Framework Specific Attributes

- [@Controller()]

##### 2.3.4.1.8.0 Technology Integration Notes

Implements the server-side contract for the `FeedService` defined in the shared gRPC proto files. Uses `@nestjs/microservices` for transport-level concerns.

##### 2.3.4.1.9.0 Properties

*No items available*

##### 2.3.4.1.10.0 Methods

- {'method_name': 'getFeed', 'method_signature': 'getFeed(request: GetFeedRequestDto): Promise<FeedResponseDto>', 'return_type': 'Promise<FeedResponseDto>', 'access_modifier': 'public', 'is_async': 'true', 'framework_specific_attributes': ['[@GrpcMethod(\\"FeedService\\", \\"GetFeed\\")]', '[@UseGuards(FeedOwnerGuard)]', '[@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))]'], 'parameters': [{'parameter_name': 'request', 'parameter_type': 'GetFeedRequestDto', 'is_nullable': 'false', 'purpose': 'Specification for the DTO containing the userId and pagination parameters for the feed request.', 'framework_attributes': []}], 'implementation_logic': 'Specification requires this method to be a thin adapter. It must delegate the call directly to the `IFeedService.getFeed` method, passing the validated and transformed request data. It must not contain any business logic.', 'exception_handling': 'Specification requires all exceptions to be handled globally by the `RpcExceptionFilter`. This method should not contain try-catch blocks for business exceptions.', 'performance_considerations': 'Validation requires this method to have negligible overhead. Performance is entirely dependent on the underlying service.', 'validation_requirements': 'Specification mandates that input validation is handled declaratively by applying the `ValidationPipe` to the `GetFeedRequestDto`.', 'technology_integration_details': 'Specification requires the use of `@nestjs/microservices` decorators to bind this method to the `FeedService` gRPC definition from the `.proto` file.'}

##### 2.3.4.1.11.0 Events

*No items available*

##### 2.3.4.1.12.0 Implementation Notes

Validation requires the specification for a `FeedOwnerGuard` to be implemented. This guard will inspect the incoming gRPC metadata for the authenticated user's ID (passed from the API Gateway) and compare it against the `userId` in the request body, throwing an `RpcException` with `PERMISSION_DENIED` status if they do not match.

#### 2.3.4.2.0.0 Class Name

##### 2.3.4.2.1.0 Class Name

FeedService

##### 2.3.4.2.2.0 File Path

src/modules/feed/feed.service.ts

##### 2.3.4.2.3.0 Class Type

Service (Provider)

##### 2.3.4.2.4.0 Inheritance

IFeedService

##### 2.3.4.2.5.0 Purpose

Specification for the core application logic. This service orchestrates reading from the feed cache and triggering the fan-out write process.

##### 2.3.4.2.6.0 Dependencies

- IFeedRepository
- IConnectionsClientService
- Cache
- Logger

##### 2.3.4.2.7.0 Framework Specific Attributes

- [@Injectable()]

##### 2.3.4.2.8.0 Technology Integration Notes

Orchestrates interactions between the Redis repository (data layer) and the Connections gRPC client (external service).

##### 2.3.4.2.9.0 Properties

*No items available*

##### 2.3.4.2.10.0 Methods

###### 2.3.4.2.10.1 Method Name

####### 2.3.4.2.10.1.1 Method Name

getFeed

####### 2.3.4.2.10.1.2 Method Signature

async getFeed(userId: string, page: number, limit: number): Promise<{ postIds: string[] }>

####### 2.3.4.2.10.1.3 Return Type

Promise<{ postIds: string[] }>

####### 2.3.4.2.10.1.4 Access Modifier

public

####### 2.3.4.2.10.1.5 Is Async

true

####### 2.3.4.2.10.1.6 Framework Specific Attributes

*No items available*

####### 2.3.4.2.10.1.7 Parameters

######## 2.3.4.2.10.1.7.1 Parameter Name

######### 2.3.4.2.10.1.7.1.1 Parameter Name

userId

######### 2.3.4.2.10.1.7.1.2 Parameter Type

string

######### 2.3.4.2.10.1.7.1.3 Is Nullable

false

######### 2.3.4.2.10.1.7.1.4 Purpose

The ID of the user whose feed is being requested.

######## 2.3.4.2.10.1.7.2.0 Parameter Name

######### 2.3.4.2.10.1.7.2.1 Parameter Name

page

######### 2.3.4.2.10.1.7.2.2 Parameter Type

number

######### 2.3.4.2.10.1.7.2.3 Is Nullable

false

######### 2.3.4.2.10.1.7.2.4 Purpose

The page number for pagination.

######## 2.3.4.2.10.1.7.3.0 Parameter Name

######### 2.3.4.2.10.1.7.3.1 Parameter Name

limit

######### 2.3.4.2.10.1.7.3.2 Parameter Type

number

######### 2.3.4.2.10.1.7.3.3 Is Nullable

false

######### 2.3.4.2.10.1.7.3.4 Purpose

The number of items per page.

####### 2.3.4.2.10.1.8.0.0 Implementation Logic

Specification requires this method to calculate the start and stop indices for pagination from the `page` and `limit` parameters. It must then call the `IFeedRepository.getFeedPage` method with these indices to retrieve a list of post IDs. The result must be wrapped in an object matching the `FeedResponseDto` structure.

####### 2.3.4.2.10.1.9.0.0 Exception Handling

Specification requires this method to catch exceptions from the repository (e.g., Redis connection error) and re-throw them as application-specific exceptions (e.g., `InfrastructureException`) for the global filter to handle.

####### 2.3.4.2.10.1.10.0.0 Performance Considerations

Validation confirms this is a performance-critical read path. The logic specification must remain a simple delegation to the repository.

####### 2.3.4.2.10.1.11.0.0 Validation Requirements

Specification assumes input parameters have been validated by the controller layer.

####### 2.3.4.2.10.1.12.0.0 Technology Integration Details

Delegates directly to the `FeedRepository`, which abstracts Redis commands.

###### 2.3.4.2.10.2.0.0.0 Method Name

####### 2.3.4.2.10.2.1.0.0 Method Name

fanOutPostToConnections

####### 2.3.4.2.10.2.2.0.0 Method Signature

async fanOutPostToConnections(authorId: string, postId: string, createdAt: Date): Promise<void>

####### 2.3.4.2.10.2.3.0.0 Return Type

Promise<void>

####### 2.3.4.2.10.2.4.0.0 Access Modifier

public

####### 2.3.4.2.10.2.5.0.0 Is Async

true

####### 2.3.4.2.10.2.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.2.10.2.7.0.0 Parameters

######## 2.3.4.2.10.2.7.1.0 Parameter Name

######### 2.3.4.2.10.2.7.1.1 Parameter Name

authorId

######### 2.3.4.2.10.2.7.1.2 Parameter Type

string

######### 2.3.4.2.10.2.7.1.3 Is Nullable

false

######### 2.3.4.2.10.2.7.1.4 Purpose

The ID of the user who created the post.

######## 2.3.4.2.10.2.7.2.0 Parameter Name

######### 2.3.4.2.10.2.7.2.1 Parameter Name

postId

######### 2.3.4.2.10.2.7.2.2 Parameter Type

string

######### 2.3.4.2.10.2.7.2.3 Is Nullable

false

######### 2.3.4.2.10.2.7.2.4 Purpose

The ID of the newly created post.

######## 2.3.4.2.10.2.7.3.0 Parameter Name

######### 2.3.4.2.10.2.7.3.1 Parameter Name

createdAt

######### 2.3.4.2.10.2.7.3.2 Parameter Type

Date

######### 2.3.4.2.10.2.7.3.3 Is Nullable

false

######### 2.3.4.2.10.2.7.3.4 Purpose

The creation timestamp of the post, used as the score in the Redis sorted set.

####### 2.3.4.2.10.2.8.0.0 Implementation Logic

Specification requires the following steps: 1. Attempt to retrieve the author's connection IDs from the cache (e.g., NestJS CacheManager). 2. On cache miss, it must call the `IConnectionsClientService.getConnections` method to fetch the list of connection IDs. 3. It must store the retrieved connection list in the cache with a short TTL (e.g., 5 minutes). 4. It must call the `IFeedRepository.addPostToFeeds` method with the list of connection IDs and the post details to perform the batch write to Redis.

####### 2.3.4.2.10.2.9.0.0 Exception Handling

Specification requires a try-catch block for the gRPC call. On failure, it must log the error and throw an `ExternalServiceException`. This allows the SQS consumer to handle the failure and trigger a retry. Partial Redis write failures should be logged, but the process should be considered best-effort.

####### 2.3.4.2.10.2.10.0.0 Performance Considerations

Validation confirms the call to the Connections Service is a bottleneck and must be cached as specified. The number of connections can be large, so the logic must be memory-efficient.

####### 2.3.4.2.10.2.11.0.0 Validation Requirements

Validation of input parameters is expected.

####### 2.3.4.2.10.2.12.0.0 Technology Integration Details

Orchestrates a gRPC client call and a repository call that uses Redis pipelines.

##### 2.3.4.2.11.0.0.0.0 Events

*No items available*

##### 2.3.4.2.12.0.0.0.0 Implementation Notes

Validation requires this service to be registered with an interface token (`IFeedService`) to facilitate mocking and dependency inversion.

#### 2.3.4.3.0.0.0.0.0 Class Name

##### 2.3.4.3.1.0.0.0.0 Class Name

PostCreatedConsumer

##### 2.3.4.3.2.0.0.0.0 File Path

src/consumers/post-created.consumer.ts

##### 2.3.4.3.3.0.0.0.0 Class Type

Background Service / Event Consumer

##### 2.3.4.3.4.0.0.0.0 Inheritance

OnModuleInit

##### 2.3.4.3.5.0.0.0.0 Purpose

Specification for a background service that listens for and processes \"PostCreated\" events from an SQS queue to initiate the fan-out-on-write workflow.

##### 2.3.4.3.6.0.0.0.0 Dependencies

- IFeedService
- SqsClient
- ConfigService
- Logger

##### 2.3.4.3.7.0.0.0.0 Framework Specific Attributes

- [@Injectable()]

##### 2.3.4.3.8.0.0.0.0 Technology Integration Notes

Acts as the bridge between the AWS SQS event source and the application's core logic. This is specified as a custom implementation since NestJS lacks a native SQS transport.

##### 2.3.4.3.9.0.0.0.0 Properties

*No items available*

##### 2.3.4.3.10.0.0.0.0 Methods

###### 2.3.4.3.10.1.0.0.0 Method Name

####### 2.3.4.3.10.1.1.0.0 Method Name

onModuleInit

####### 2.3.4.3.10.1.2.0.0 Method Signature

onModuleInit(): void

####### 2.3.4.3.10.1.3.0.0 Return Type

void

####### 2.3.4.3.10.1.4.0.0 Access Modifier

public

####### 2.3.4.3.10.1.5.0.0 Is Async

❌ No

####### 2.3.4.3.10.1.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.3.10.1.7.0.0 Parameters

*No items available*

####### 2.3.4.3.10.1.8.0.0 Implementation Logic

Specification requires this NestJS lifecycle hook to initiate the long-polling loop for the SQS queue by calling a private `startPolling` method.

####### 2.3.4.3.10.1.9.0.0 Exception Handling

N/A

####### 2.3.4.3.10.1.10.0.0 Performance Considerations

N/A

####### 2.3.4.3.10.1.11.0.0 Validation Requirements

N/A

####### 2.3.4.3.10.1.12.0.0 Technology Integration Details

Uses NestJS lifecycle hooks to start the background process upon application bootstrap.

###### 2.3.4.3.10.2.0.0.0 Method Name

####### 2.3.4.3.10.2.1.0.0 Method Name

startPolling

####### 2.3.4.3.10.2.2.0.0 Method Signature

private async startPolling(): Promise<void>

####### 2.3.4.3.10.2.3.0.0 Return Type

Promise<void>

####### 2.3.4.3.10.2.4.0.0 Access Modifier

private

####### 2.3.4.3.10.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.3.10.2.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.3.10.2.7.0.0 Parameters

*No items available*

####### 2.3.4.3.10.2.8.0.0 Implementation Logic

Specification requires an infinite `while` loop that continuously calls the SQS `ReceiveMessageCommand` with `WaitTimeSeconds` > 0 (long polling). It must fetch messages in batches (`MaxNumberOfMessages` > 1). For each message received, it must call `processMessage`.

####### 2.3.4.3.10.2.9.0.0 Exception Handling

Specification requires a top-level try-catch to log critical errors in the polling mechanism and potentially restart the poll after an exponential backoff delay.

####### 2.3.4.3.10.2.10.0.0 Performance Considerations

Validation requires the use of long polling to minimize costs and empty responses from SQS.

####### 2.3.4.3.10.2.11.0.0 Validation Requirements

N/A

####### 2.3.4.3.10.2.12.0.0 Technology Integration Details

Uses `@aws-sdk/client-sqs` for all SQS communication.

###### 2.3.4.3.10.3.0.0.0 Method Name

####### 2.3.4.3.10.3.1.0.0 Method Name

processMessage

####### 2.3.4.3.10.3.2.0.0 Method Signature

private async processMessage(message: Message): Promise<void>

####### 2.3.4.3.10.3.3.0.0 Return Type

Promise<void>

####### 2.3.4.3.10.3.4.0.0 Access Modifier

private

####### 2.3.4.3.10.3.5.0.0 Is Async

✅ Yes

####### 2.3.4.3.10.3.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.3.10.3.7.0.0 Parameters

- {'parameter_name': 'message', 'parameter_type': 'Message', 'is_nullable': False, 'purpose': 'The SQS message received from the queue.'}

####### 2.3.4.3.10.3.8.0.0 Implementation Logic

Specification requires the following steps: 1. Parse the JSON message body. 2. Validate the payload against the `PostCreatedEventDto` using `class-validator`. 3. Call `IFeedService.fanOutPostToConnections` with the validated event data. 4. If the service call is successful, delete the message from the SQS queue using `DeleteMessageCommand`.

####### 2.3.4.3.10.3.9.0.0 Exception Handling

Validation requires that if `fanOutPostToConnections` throws an exception, the `catch` block MUST NOT delete the message from SQS. This allows the message's visibility timeout to expire, making it available for retry. After multiple failed retries, SQS will automatically move it to the configured Dead Letter Queue (DLQ). All errors must be logged with context.

####### 2.3.4.3.10.3.10.0.0 Performance Considerations

Validation of the specification requires all operations to be asynchronous to avoid blocking the processing of other messages in the batch.

####### 2.3.4.3.10.3.11.0.0 Validation Requirements

The incoming message payload must be validated against a DTO or schema.

####### 2.3.4.3.10.3.12.0.0 Technology Integration Details

This method specification directly implements the core requirement REQ-1-020, linking the event source (SQS) to the application logic (`FeedService`).

##### 2.3.4.3.11.0.0.0.0 Events

*No items available*

##### 2.3.4.3.12.0.0.0.0 Implementation Notes

Validation requires this class to be provided in a `ConsumersModule` and instantiated by the NestJS application to ensure it starts on application bootstrap.

#### 2.3.4.4.0.0.0.0.0 Class Name

##### 2.3.4.4.1.0.0.0.0 Class Name

FeedRepository

##### 2.3.4.4.2.0.0.0.0 File Path

src/modules/feed/feed.repository.ts

##### 2.3.4.4.3.0.0.0.0 Class Type

Repository (Provider)

##### 2.3.4.4.4.0.0.0.0 Inheritance

IFeedRepository

##### 2.3.4.4.5.0.0.0.0 Purpose

Specification for the data access layer for user feeds. This repository abstracts all interactions with Redis, providing a clean interface to the application service.

##### 2.3.4.4.6.0.0.0.0 Dependencies

- Redis
- ConfigService
- Logger

##### 2.3.4.4.7.0.0.0.0 Framework Specific Attributes

- [@Injectable()]

##### 2.3.4.4.8.0.0.0.0 Technology Integration Notes

Directly uses the `redis` client library. All methods must be designed for high performance.

##### 2.3.4.4.9.0.0.0.0 Properties

*No items available*

##### 2.3.4.4.10.0.0.0.0 Methods

###### 2.3.4.4.10.1.0.0.0 Method Name

####### 2.3.4.4.10.1.1.0.0 Method Name

addPostToFeeds

####### 2.3.4.4.10.1.2.0.0 Method Signature

async addPostToFeeds(updates: { userId: string; postId: string; score: number }[]): Promise<void>

####### 2.3.4.4.10.1.3.0.0 Return Type

Promise<void>

####### 2.3.4.4.10.1.4.0.0 Access Modifier

public

####### 2.3.4.4.10.1.5.0.0 Is Async

✅ Yes

####### 2.3.4.4.10.1.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.4.10.1.7.0.0 Parameters

- {'parameter_name': 'updates', 'parameter_type': '{ userId: string; postId: string; score: number }[]', 'is_nullable': False, 'purpose': "An array of objects, each representing a post to be added to a user's feed."}

####### 2.3.4.4.10.1.8.0.0 Implementation Logic

Specification requires this method to use a Redis Pipeline (`redis.multi()`). For each update in the array, it must: 1. Add a `ZADD` command to the pipeline for the key `feed:{userId}` with the `score` and `postId`. 2. Add a `ZREMRANGEBYRANK` command to the pipeline to trim the sorted set, keeping only the newest `feed_max_size` entries (e.g., keeping ranks from 0 to `max_size - 1`). Finally, it must execute the pipeline (`.exec()`).

####### 2.3.4.4.10.1.9.0.0 Exception Handling

Specification requires logging any errors during pipeline execution. The operation is best-effort; a failure for one user should not stop others.

####### 2.3.4.4.10.1.10.0.0 Performance Considerations

Validation requires the use of Redis Pipelines to dramatically reduce network round-trips when fanning out to many users, which is critical for performance.

####### 2.3.4.4.10.1.11.0.0 Validation Requirements

Assumes input data is valid.

####### 2.3.4.4.10.1.12.0.0 Technology Integration Details

Implements the write-path of DB-ID-51 using high-performance Redis batching.

###### 2.3.4.4.10.2.0.0.0 Method Name

####### 2.3.4.4.10.2.1.0.0 Method Name

getFeedPage

####### 2.3.4.4.10.2.2.0.0 Method Signature

async getFeedPage(userId: string, start: number, stop: number): Promise<string[]>

####### 2.3.4.4.10.2.3.0.0 Return Type

Promise<string[]>

####### 2.3.4.4.10.2.4.0.0 Access Modifier

public

####### 2.3.4.4.10.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.4.10.2.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.4.10.2.7.0.0 Parameters

######## 2.3.4.4.10.2.7.1.0 Parameter Name

######### 2.3.4.4.10.2.7.1.1 Parameter Name

userId

######### 2.3.4.4.10.2.7.1.2 Parameter Type

string

######### 2.3.4.4.10.2.7.1.3 Is Nullable

❌ No

######### 2.3.4.4.10.2.7.1.4 Purpose

The ID of the user.

######## 2.3.4.4.10.2.7.2.0 Parameter Name

######### 2.3.4.4.10.2.7.2.1 Parameter Name

start

######### 2.3.4.4.10.2.7.2.2 Parameter Type

number

######### 2.3.4.4.10.2.7.2.3 Is Nullable

❌ No

######### 2.3.4.4.10.2.7.2.4 Purpose

The starting index for the range query.

######## 2.3.4.4.10.2.7.3.0 Parameter Name

######### 2.3.4.4.10.2.7.3.1 Parameter Name

stop

######### 2.3.4.4.10.2.7.3.2 Parameter Type

number

######### 2.3.4.4.10.2.7.3.3 Is Nullable

❌ No

######### 2.3.4.4.10.2.7.3.4 Purpose

The ending index for the range query.

####### 2.3.4.4.10.2.8.0.0 Implementation Logic

Specification requires this method to execute a single Redis `ZREVRANGE` command on the key `feed:{userId}` with the provided `start` and `stop` indices to retrieve a page of post IDs in reverse chronological order.

####### 2.3.4.4.10.2.9.0.0 Exception Handling

Specification requires catching Redis client errors and throwing a domain-specific `InfrastructureException`.

####### 2.3.4.4.10.2.10.0.0 Performance Considerations

`ZREVRANGE` is a highly efficient O(log(N)+M) operation, meeting the low-latency requirement for reads.

####### 2.3.4.4.10.2.11.0.0 Validation Requirements

Assumes input data is valid.

####### 2.3.4.4.10.2.12.0.0 Technology Integration Details

Implements the read-path of DB-ID-51.

##### 2.3.4.4.11.0.0.0.0 Events

*No items available*

##### 2.3.4.4.12.0.0.0.0 Implementation Notes

Validation requires this repository to be injected using the `IFeedRepository` token.

#### 2.3.4.5.0.0.0.0.0 Class Name

##### 2.3.4.5.1.0.0.0.0 Class Name

ConnectionsClientService

##### 2.3.4.5.2.0.0.0.0 File Path

src/shared/grpc-clients/connections/connections-client.service.ts

##### 2.3.4.5.3.0.0.0.0 Class Type

gRPC Client Service

##### 2.3.4.5.4.0.0.0.0 Inheritance

OnModuleInit, IConnectionsClientService

##### 2.3.4.5.5.0.0.0.0 Purpose

Specification for a wrapper around the gRPC client for the Connections Service. It abstracts the raw gRPC calls into a clean, injectable NestJS service.

##### 2.3.4.5.6.0.0.0.0 Dependencies

- [@Inject(\"CONNECTIONS_PACKAGE\")] ClientGrpc
- Logger

##### 2.3.4.5.7.0.0.0.0 Framework Specific Attributes

- [@Injectable()]

##### 2.3.4.5.8.0.0.0.0 Technology Integration Notes

Uses the `@nestjs/microservices` package to manage the gRPC client lifecycle.

##### 2.3.4.5.9.0.0.0.0 Properties

*No items available*

##### 2.3.4.5.10.0.0.0.0 Methods

###### 2.3.4.5.10.1.0.0.0 Method Name

####### 2.3.4.5.10.1.1.0.0 Method Name

onModuleInit

####### 2.3.4.5.10.1.2.0.0 Method Signature

onModuleInit(): void

####### 2.3.4.5.10.1.3.0.0 Return Type

void

####### 2.3.4.5.10.1.4.0.0 Access Modifier

public

####### 2.3.4.5.10.1.5.0.0 Is Async

❌ No

####### 2.3.4.5.10.1.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.5.10.1.7.0.0 Parameters

*No items available*

####### 2.3.4.5.10.1.8.0.0 Implementation Logic

Specification requires this lifecycle hook to get the `ConnectionsService` instance from the injected `ClientGrpc` object and store it as a private property for use by other methods.

####### 2.3.4.5.10.1.9.0.0 Exception Handling

N/A

####### 2.3.4.5.10.1.10.0.0 Performance Considerations

N/A

####### 2.3.4.5.10.1.11.0.0 Validation Requirements

N/A

####### 2.3.4.5.10.1.12.0.0 Technology Integration Details

Standard NestJS pattern for initializing gRPC service clients.

###### 2.3.4.5.10.2.0.0.0 Method Name

####### 2.3.4.5.10.2.1.0.0 Method Name

getConnections

####### 2.3.4.5.10.2.2.0.0 Method Signature

async getConnections(userId: string): Promise<string[]>

####### 2.3.4.5.10.2.3.0.0 Return Type

Promise<string[]>

####### 2.3.4.5.10.2.4.0.0 Access Modifier

public

####### 2.3.4.5.10.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.5.10.2.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.5.10.2.7.0.0 Parameters

- {'parameter_name': 'userId', 'parameter_type': 'string', 'is_nullable': False, 'purpose': 'The ID of the user whose connections are needed.'}

####### 2.3.4.5.10.2.8.0.0 Implementation Logic

Specification requires this method to call the `getConnections` method on the gRPC service client instance. It must use RxJS `firstValueFrom` to convert the observable returned by the gRPC client into a Promise. The method should handle potential empty responses.

####### 2.3.4.5.10.2.9.0.0 Exception Handling

Specification requires a `catchError` block to handle gRPC errors, logging them and re-throwing a custom `ExternalServiceException` with an appropriate message and status code (e.g., `UNAVAILABLE`).

####### 2.3.4.5.10.2.10.0.0 Performance Considerations

This is a network call, so it should be used judiciously. The calling service (`FeedService`) is responsible for caching its result.

####### 2.3.4.5.10.2.11.0.0 Validation Requirements

Assumes `userId` is valid.

####### 2.3.4.5.10.2.12.0.0 Technology Integration Details

Abstracts the RxJS-based gRPC client from `@nestjs/microservices` into a more common Promise-based API for the application to use.

##### 2.3.4.5.11.0.0.0.0 Events

*No items available*

##### 2.3.4.5.12.0.0.0.0 Implementation Notes

Validation requires this service to be provided and exported from its own `ConnectionsClientModule`.

#### 2.3.4.6.0.0.0.0.0 Class Name

##### 2.3.4.6.1.0.0.0.0 Class Name

HealthController

##### 2.3.4.6.2.0.0.0.0 File Path

src/modules/health/health.controller.ts

##### 2.3.4.6.3.0.0.0.0 Class Type

gRPC Controller

##### 2.3.4.6.4.0.0.0.0 Inheritance

None

##### 2.3.4.6.5.0.0.0.0 Purpose

Specification for a simple health check endpoint to be used by orchestrators like Kubernetes.

##### 2.3.4.6.6.0.0.0.0 Dependencies

*No items available*

##### 2.3.4.6.7.0.0.0.0 Framework Specific Attributes

- [@Controller()]

##### 2.3.4.6.8.0.0.0.0 Technology Integration Notes

Implements the standard gRPC health checking protocol.

##### 2.3.4.6.9.0.0.0.0 Properties

*No items available*

##### 2.3.4.6.10.0.0.0.0 Methods

- {'method_name': 'check', 'method_signature': 'check(): { status: \\"SERVING\\" }', 'return_type': '{ status: \\"SERVING\\" }', 'access_modifier': 'public', 'is_async': False, 'framework_specific_attributes': ['[@GrpcMethod(\\"HealthService\\", \\"Check\\")]'], 'parameters': [], 'implementation_logic': 'Specification requires this method to simply return a static object `{ status: \\"SERVING\\" }` to indicate the service is running. Future enhancements could include checks for database or cache connectivity.', 'exception_handling': 'None required for this basic implementation.', 'performance_considerations': 'Must be extremely fast and lightweight.', 'validation_requirements': 'N/A', 'technology_integration_details': 'Exposes a standard health check method over gRPC.'}

##### 2.3.4.6.11.0.0.0.0 Events

*No items available*

##### 2.3.4.6.12.0.0.0.0 Implementation Notes

Validation requires this controller to be part of a separate `HealthModule`.

#### 2.3.4.7.0.0.0.0.0 Class Name

##### 2.3.4.7.1.0.0.0.0 Class Name

RpcExceptionFilter

##### 2.3.4.7.2.0.0.0.0 File Path

src/shared/filters/rpc-exception.filter.ts

##### 2.3.4.7.3.0.0.0.0 Class Type

Exception Filter

##### 2.3.4.7.4.0.0.0.0 Inheritance

BaseRpcExceptionFilter

##### 2.3.4.7.5.0.0.0.0 Purpose

Specification for a global exception filter that catches application exceptions and translates them into standard gRPC status codes and messages.

##### 2.3.4.7.6.0.0.0.0 Dependencies

- Logger

##### 2.3.4.7.7.0.0.0.0 Framework Specific Attributes

- [@Catch()]

##### 2.3.4.7.8.0.0.0.0 Technology Integration Notes

Uses NestJS's exception filter mechanism for the gRPC transport layer.

##### 2.3.4.7.9.0.0.0.0 Properties

*No items available*

##### 2.3.4.7.10.0.0.0.0 Methods

- {'method_name': 'catch', 'method_signature': 'catch(exception: any, host: ArgumentsHost): Observable<any>', 'return_type': 'Observable<any>', 'access_modifier': 'public', 'is_async': False, 'framework_specific_attributes': [], 'parameters': [{'parameter_name': 'exception', 'parameter_type': 'any', 'is_nullable': False, 'purpose': 'The exception object that was thrown.'}, {'parameter_name': 'host', 'parameter_type': 'ArgumentsHost', 'is_nullable': False, 'purpose': 'The execution context host.'}], 'implementation_logic': 'Specification requires this method to inspect the `exception` object. It must have a mapping from custom application exception types (e.g., `ValidationException`, `NotFoundException`, `ExternalServiceException`) to gRPC status codes (e.g., `INVALID_ARGUMENT`, `NOT_FOUND`, `UNAVAILABLE`). If the exception is not a known custom type, it should be logged as a critical error and mapped to `UNKNOWN`. It must return an RxJS `throwError` with the constructed `RpcException`.', 'exception_handling': 'This is the primary exception handler; it should not throw.', 'performance_considerations': "Should be lightweight, as it's in the critical path for all error responses.", 'validation_requirements': 'N/A', 'technology_integration_details': 'Must be registered globally in `main.ts` using `app.useGlobalFilters(new RpcExceptionFilter())`.'}

##### 2.3.4.7.11.0.0.0.0 Events

*No items available*

##### 2.3.4.7.12.0.0.0.0 Implementation Notes

Validation requires a comprehensive mapping of all custom exceptions used in the service.

#### 2.3.4.8.0.0.0.0.0 Class Name

##### 2.3.4.8.1.0.0.0.0 Class Name

FeedOwnerGuard

##### 2.3.4.8.2.0.0.0.0 File Path

src/shared/guards/feed-owner.guard.ts

##### 2.3.4.8.3.0.0.0.0 Class Type

Guard

##### 2.3.4.8.4.0.0.0.0 Inheritance

CanActivate

##### 2.3.4.8.5.0.0.0.0 Purpose

Specification for an authorization guard that ensures a user can only request their own feed.

##### 2.3.4.8.6.0.0.0.0 Dependencies

*No items available*

##### 2.3.4.8.7.0.0.0.0 Framework Specific Attributes

- [@Injectable()]

##### 2.3.4.8.8.0.0.0.0 Technology Integration Notes

Uses NestJS's guard mechanism to protect gRPC controller methods.

##### 2.3.4.8.9.0.0.0.0 Properties

*No items available*

##### 2.3.4.8.10.0.0.0.0 Methods

- {'method_name': 'canActivate', 'method_signature': 'canActivate(context: ExecutionContext): boolean', 'return_type': 'boolean', 'access_modifier': 'public', 'is_async': False, 'framework_specific_attributes': [], 'parameters': [{'parameter_name': 'context', 'parameter_type': 'ExecutionContext', 'is_nullable': False, 'purpose': 'The execution context for the current request.'}], 'implementation_logic': 'Specification requires this method to: 1. Switch the context to RPC (`context.switchToRpc()`). 2. Get the request data (the DTO). 3. Get the gRPC metadata. 4. Extract the authenticated user ID from the metadata (e.g., from a \\"x-user-id\\" header passed by the API Gateway). 5. Compare the authenticated user ID with the `userId` in the request data. 6. Return `true` if they match, or throw an `RpcException` with status `PERMISSION_DENIED` if they do not.', 'exception_handling': 'Throws an `RpcException` to deny access, which will be handled by the `RpcExceptionFilter`.', 'performance_considerations': 'Must be extremely fast as it runs before every protected method call.', 'validation_requirements': 'Requires a convention for how the authenticated user ID is passed in gRPC metadata.', 'technology_integration_details': 'Applied to controller methods using the `[@UseGuards()]` decorator.'}

##### 2.3.4.8.11.0.0.0.0 Events

*No items available*

##### 2.3.4.8.12.0.0.0.0 Implementation Notes

Validation confirms this is a critical security component for this service.

### 2.3.5.0.0.0.0.0.0 Interface Specifications

#### 2.3.5.1.0.0.0.0.0 Interface Name

##### 2.3.5.1.1.0.0.0.0 Interface Name

IFeedService

##### 2.3.5.1.2.0.0.0.0 File Path

src/modules/feed/interfaces/feed.service.interface.ts

##### 2.3.5.1.3.0.0.0.0 Purpose

Defines the contract for the application's core feed logic, abstracting the implementation for controllers and consumers.

##### 2.3.5.1.4.0.0.0.0 Method Contracts

###### 2.3.5.1.4.1.0.0.0 Method Name

####### 2.3.5.1.4.1.1.0.0 Method Name

getFeed

####### 2.3.5.1.4.1.2.0.0 Method Signature

getFeed(userId: string, page: number, limit: number): Promise<{ postIds: string[] }>

####### 2.3.5.1.4.1.3.0.0 Return Type

Promise<{ postIds: string[] }>

####### 2.3.5.1.4.1.4.0.0 Contract Description

Specification requires this method to retrieve a paginated list of post IDs for a given user's feed.

####### 2.3.5.1.4.1.5.0.0 Exception Contracts

Specification requires implementations to throw `NotFoundException` if the user's feed does not exist.

###### 2.3.5.1.4.2.0.0.0 Method Name

####### 2.3.5.1.4.2.1.0.0 Method Name

fanOutPostToConnections

####### 2.3.5.1.4.2.2.0.0 Method Signature

fanOutPostToConnections(authorId: string, postId: string, createdAt: Date): Promise<void>

####### 2.3.5.1.4.2.3.0.0 Return Type

Promise<void>

####### 2.3.5.1.4.2.4.0.0 Contract Description

Specification requires this method to orchestrate the fan-out of a new post to the feeds of the author's connections.

####### 2.3.5.1.4.2.5.0.0 Exception Contracts

Specification requires implementations to throw `ExternalServiceException` if the Connections Service is unavailable.

##### 2.3.5.1.5.0.0.0.0 Implementation Guidance

Implementations should be stateless and rely on injected dependencies for all external interactions. Use this interface as the injection token in DI.

#### 2.3.5.2.0.0.0.0.0 Interface Name

##### 2.3.5.2.1.0.0.0.0 Interface Name

IFeedRepository

##### 2.3.5.2.2.0.0.0.0 File Path

src/modules/feed/interfaces/feed.repository.interface.ts

##### 2.3.5.2.3.0.0.0.0 Purpose

Defines the contract for data access operations related to user feeds, abstracting the underlying Redis implementation.

##### 2.3.5.2.4.0.0.0.0 Method Contracts

###### 2.3.5.2.4.1.0.0.0 Method Name

####### 2.3.5.2.4.1.1.0.0 Method Name

addPostToFeeds

####### 2.3.5.2.4.1.2.0.0 Method Signature

addPostToFeeds(updates: { userId: string; postId: string; score: number }[]): Promise<void>

####### 2.3.5.2.4.1.3.0.0 Return Type

Promise<void>

####### 2.3.5.2.4.1.4.0.0 Contract Description

Specification requires this method to add a post to multiple user feeds in a single batch operation and trim each feed to its configured maximum size.

####### 2.3.5.2.4.1.5.0.0 Exception Contracts

Specification requires implementations to throw `InfrastructureException` on Redis connection failure.

###### 2.3.5.2.4.2.0.0.0 Method Name

####### 2.3.5.2.4.2.1.0.0 Method Name

getFeedPage

####### 2.3.5.2.4.2.2.0.0 Method Signature

getFeedPage(userId: string, start: number, stop: number): Promise<string[]>

####### 2.3.5.2.4.2.3.0.0 Return Type

Promise<string[]>

####### 2.3.5.2.4.2.4.0.0 Contract Description

Specification requires this method to retrieve a paginated list of post IDs from a user's feed sorted set in reverse chronological order.

####### 2.3.5.2.4.2.5.0.0 Exception Contracts

Specification requires implementations to throw `InfrastructureException` on Redis connection failure.

##### 2.3.5.2.5.0.0.0.0 Implementation Guidance

Validation requires implementations to use Redis Pipelines for the `addPostToFeeds` method and `ZREVRANGE` for `getFeedPage` to ensure high performance. The Redis key schema must be `feed:{userId}`.

#### 2.3.5.3.0.0.0.0.0 Interface Name

##### 2.3.5.3.1.0.0.0.0 Interface Name

IConnectionsClientService

##### 2.3.5.3.2.0.0.0.0 File Path

src/shared/grpc-clients/connections/interfaces/connections-client.interface.ts

##### 2.3.5.3.3.0.0.0.0 Purpose

Defines the contract for the Connections Service gRPC client wrapper.

##### 2.3.5.3.4.0.0.0.0 Method Contracts

- {'method_name': 'getConnections', 'method_signature': 'getConnections(userId: string): Promise<string[]>', 'return_type': 'Promise<string[]>', 'contract_description': 'Specification requires this method to retrieve the complete list of first-degree connection user IDs for a given user.', 'exception_contracts': 'Specification requires implementations to throw `ExternalServiceException` on gRPC communication failure.'}

##### 2.3.5.3.5.0.0.0.0 Implementation Guidance

Implementations should abstract the RxJS-based nature of the underlying NestJS gRPC client into a Promise-based interface for easier consumption by application services.

### 2.3.6.0.0.0.0.0.0 Enum Specifications

*No items available*

### 2.3.7.0.0.0.0.0.0 Dto Specifications

#### 2.3.7.1.0.0.0.0.0 Dto Name

##### 2.3.7.1.1.0.0.0.0 Dto Name

GetFeedRequestDto

##### 2.3.7.1.2.0.0.0.0 File Path

src/modules/feed/dto/get-feed-request.dto.ts

##### 2.3.7.1.3.0.0.0.0 Purpose

Specification for the data contract of a `getFeed` gRPC request, including validation rules.

##### 2.3.7.1.4.0.0.0.0 Framework Base Class

None

##### 2.3.7.1.5.0.0.0.0 Properties

###### 2.3.7.1.5.1.0.0.0 Property Name

####### 2.3.7.1.5.1.1.0.0 Property Name

userId

####### 2.3.7.1.5.1.2.0.0 Property Type

string

####### 2.3.7.1.5.1.3.0.0 Validation Attributes

- [@IsUUID()]
- [@IsNotEmpty()]

####### 2.3.7.1.5.1.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.1.5.1.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.1.5.2.0.0.0 Property Name

####### 2.3.7.1.5.2.1.0.0 Property Name

page

####### 2.3.7.1.5.2.2.0.0 Property Type

number

####### 2.3.7.1.5.2.3.0.0 Validation Attributes

- [@IsInt()]
- [@Min(1)]
- [@IsOptional()]

####### 2.3.7.1.5.2.4.0.0 Serialization Attributes

- [@Type(() => Number)]

####### 2.3.7.1.5.2.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.1.5.3.0.0.0 Property Name

####### 2.3.7.1.5.3.1.0.0 Property Name

limit

####### 2.3.7.1.5.3.2.0.0 Property Type

number

####### 2.3.7.1.5.3.3.0.0 Validation Attributes

- [@IsInt()]
- [@Min(1)]
- [@Max(100)]
- [@IsOptional()]

####### 2.3.7.1.5.3.4.0.0 Serialization Attributes

- [@Type(() => Number)]

####### 2.3.7.1.5.3.5.0.0 Framework Specific Attributes

*No items available*

##### 2.3.7.1.6.0.0.0.0 Validation Rules

The `page` and `limit` properties should have default values (e.g., 1 and 20 respectively) applied if not provided. Validation must be performed by a global `ValidationPipe`.

##### 2.3.7.1.7.0.0.0.0 Serialization Requirements

The `@Type` decorator is required to ensure gRPC string inputs for numbers are correctly transformed.

#### 2.3.7.2.0.0.0.0.0 Dto Name

##### 2.3.7.2.1.0.0.0.0 Dto Name

FeedResponseDto

##### 2.3.7.2.2.0.0.0.0 File Path

src/modules/feed/dto/feed-response.dto.ts

##### 2.3.7.2.3.0.0.0.0 Purpose

Specification for the data contract of a `getFeed` gRPC response.

##### 2.3.7.2.4.0.0.0.0 Framework Base Class

None

##### 2.3.7.2.5.0.0.0.0 Properties

- {'property_name': 'postIds', 'property_type': 'string[]', 'validation_attributes': ['[@IsArray()]', '[@IsUUID(\\"4\\", { each: true })]'], 'serialization_attributes': [], 'framework_specific_attributes': []}

##### 2.3.7.2.6.0.0.0.0 Validation Rules

Ensures the response adheres to the expected format.

##### 2.3.7.2.7.0.0.0.0 Serialization Requirements

Used to type the return value of the controller method.

#### 2.3.7.3.0.0.0.0.0 Dto Name

##### 2.3.7.3.1.0.0.0.0 Dto Name

PostCreatedEventDto

##### 2.3.7.3.2.0.0.0.0 File Path

src/consumers/dto/post-created-event.dto.ts

##### 2.3.7.3.3.0.0.0.0 Purpose

Specification for the data contract for the payload of a \"PostCreated\" event message from SQS.

##### 2.3.7.3.4.0.0.0.0 Framework Base Class

None

##### 2.3.7.3.5.0.0.0.0 Properties

###### 2.3.7.3.5.1.0.0.0 Property Name

####### 2.3.7.3.5.1.1.0.0 Property Name

postId

####### 2.3.7.3.5.1.2.0.0 Property Type

string

####### 2.3.7.3.5.1.3.0.0 Validation Attributes

- [@IsUUID()]
- [@IsNotEmpty()]

####### 2.3.7.3.5.1.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.3.5.1.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.3.5.2.0.0.0 Property Name

####### 2.3.7.3.5.2.1.0.0 Property Name

authorId

####### 2.3.7.3.5.2.2.0.0 Property Type

string

####### 2.3.7.3.5.2.3.0.0 Validation Attributes

- [@IsUUID()]
- [@IsNotEmpty()]

####### 2.3.7.3.5.2.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.3.5.2.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.3.5.3.0.0.0 Property Name

####### 2.3.7.3.5.3.1.0.0 Property Name

createdAt

####### 2.3.7.3.5.3.2.0.0 Property Type

string

####### 2.3.7.3.5.3.3.0.0 Validation Attributes

- [@IsISO8601()]
- [@IsNotEmpty()]

####### 2.3.7.3.5.3.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.3.5.3.5.0.0 Framework Specific Attributes

*No items available*

##### 2.3.7.3.6.0.0.0.0 Validation Rules

This DTO will be used to validate the parsed JSON body of incoming SQS messages.

##### 2.3.7.3.7.0.0.0.0 Serialization Requirements

The `createdAt` field should be transformed into a Date object after validation using `@Type(() => Date)` from `class-transformer`.

### 2.3.8.0.0.0.0.0.0 Configuration Specifications

- {'configuration_name': 'configuration.ts', 'file_path': 'src/config/configuration.ts', 'purpose': 'Specification for the schema and loading mechanism for all environment variables used by the service.', 'framework_base_class': 'N/A', 'configuration_sections': [{'section_name': 'APP', 'properties': [{'property_name': 'PORT', 'property_type': 'number', 'default_value': '50052', 'required': 'true', 'description': 'The port on which the Feed Service gRPC server will listen.'}]}, {'section_name': 'REDIS', 'properties': [{'property_name': 'REDIS_URL', 'property_type': 'string', 'default_value': 'redis://localhost:6379', 'required': 'true', 'description': 'The connection URL for the Redis instance.'}, {'property_name': 'FEED_MAX_SIZE', 'property_type': 'number', 'default_value': '1000', 'required': 'true', 'description': "The maximum number of post IDs to store in each user's feed sorted set."}]}, {'section_name': 'AWS', 'properties': [{'property_name': 'AWS_REGION', 'property_type': 'string', 'default_value': 'us-east-1', 'required': 'true', 'description': 'The AWS region for SQS.'}, {'property_name': 'SQS_QUEUE_URL', 'property_type': 'string', 'default_value': 'null', 'required': 'true', 'description': 'The URL of the SQS queue to consume \\"PostCreated\\" events from.'}]}, {'section_name': 'SERVICES', 'properties': [{'property_name': 'CONNECTIONS_GRPC_URL', 'property_type': 'string', 'default_value': 'localhost:50053', 'required': 'true', 'description': 'The URL for the Connections Service gRPC endpoint.'}]}], 'validation_requirements': 'Validation requires a Joi schema in `validation.schema.ts` to validate all environment variables on application startup. This ensures required variables are present and correctly formatted, causing the application to fail fast on misconfiguration.'}

### 2.3.9.0.0.0.0.0.0 Dependency Injection Specifications

#### 2.3.9.1.0.0.0.0.0 Service Interface

##### 2.3.9.1.1.0.0.0.0 Service Interface

IFeedService

##### 2.3.9.1.2.0.0.0.0 Service Implementation

FeedService

##### 2.3.9.1.3.0.0.0.0 Lifetime

Default (Singleton)

##### 2.3.9.1.4.0.0.0.0 Registration Reasoning

Specification requires the service to be stateless and thread-safe, making a singleton the most efficient lifetime.

##### 2.3.9.1.5.0.0.0.0 Framework Registration Pattern

Must be provided in the `providers` array of `FeedModule` using a custom provider with `provide: \"IFeedService\"` and `useClass: FeedService`.

#### 2.3.9.2.0.0.0.0.0 Service Interface

##### 2.3.9.2.1.0.0.0.0 Service Interface

IFeedRepository

##### 2.3.9.2.2.0.0.0.0 Service Implementation

FeedRepository

##### 2.3.9.2.3.0.0.0.0 Lifetime

Default (Singleton)

##### 2.3.9.2.4.0.0.0.0 Registration Reasoning

Specification requires the repository to be stateless, making a singleton the most efficient lifetime.

##### 2.3.9.2.5.0.0.0.0 Framework Registration Pattern

Must be provided in the `providers` array of `FeedModule` using a custom provider with `provide: \"IFeedRepository\"` and `useClass: FeedRepository`.

#### 2.3.9.3.0.0.0.0.0 Service Interface

##### 2.3.9.3.1.0.0.0.0 Service Interface

RedisClient

##### 2.3.9.3.2.0.0.0.0 Service Implementation

N/A (Provided by RedisModule)

##### 2.3.9.3.3.0.0.0.0 Lifetime

Singleton

##### 2.3.9.3.4.0.0.0.0 Registration Reasoning

Validation requires the Redis client connection to be established once and reused throughout the application's lifecycle for performance and connection pooling.

##### 2.3.9.3.5.0.0.0.0 Framework Registration Pattern

Must be exported from a global `RedisModule` and injected via a custom provider token (e.g., \"REDIS_CLIENT\").

#### 2.3.9.4.0.0.0.0.0 Service Interface

##### 2.3.9.4.1.0.0.0.0 Service Interface

IConnectionsClientService

##### 2.3.9.4.2.0.0.0.0 Service Implementation

ConnectionsClientService

##### 2.3.9.4.3.0.0.0.0 Lifetime

Default (Singleton)

##### 2.3.9.4.4.0.0.0.0 Registration Reasoning

Specification requires the gRPC client service wrapper to be stateless and reusable.

##### 2.3.9.4.5.0.0.0.0 Framework Registration Pattern

Must be provided in the `providers` array of `ConnectionsClientModule` using a custom provider.

### 2.3.10.0.0.0.0.0.0 External Integration Specifications

#### 2.3.10.1.0.0.0.0.0 Integration Target

##### 2.3.10.1.1.0.0.0.0 Integration Target

Redis

##### 2.3.10.1.2.0.0.0.0 Integration Type

Cache/Data Store

##### 2.3.10.1.3.0.0.0.0 Required Client Classes

- Redis (from \"redis\" package)

##### 2.3.10.1.4.0.0.0.0 Configuration Requirements

Connection URL, password, database number.

##### 2.3.10.1.5.0.0.0.0 Error Handling Requirements

Specification requires handling connection errors gracefully and implementing a retry strategy on application startup. Operations must have timeouts.

##### 2.3.10.1.6.0.0.0.0 Authentication Requirements

Password-based authentication.

##### 2.3.10.1.7.0.0.0.0 Framework Integration Patterns

Validation requires a shared `RedisModule` to be created to provide a single, injectable client instance to the rest of the application using a custom provider.

#### 2.3.10.2.0.0.0.0.0 Integration Target

##### 2.3.10.2.1.0.0.0.0 Integration Target

Connections Service

##### 2.3.10.2.2.0.0.0.0 Integration Type

gRPC Client

##### 2.3.10.2.3.0.0.0.0 Required Client Classes

- ClientGrpc

##### 2.3.10.2.4.0.0.0.0 Configuration Requirements

Service URL, proto file path, package name.

##### 2.3.10.2.5.0.0.0.0 Error Handling Requirements

Specification requires calls to be wrapped to handle gRPC status codes like `UNAVAILABLE` or `DEADLINE_EXCEEDED`. A circuit breaker pattern is recommended for resilience.

##### 2.3.10.2.6.0.0.0.0 Authentication Requirements

Specification assumes communication is within a trusted private network; no specific authentication is required for this internal service call.

##### 2.3.10.2.7.0.0.0.0 Framework Integration Patterns

Validation requires the use of `@nestjs/microservices` `ClientsModule` to register and configure the gRPC client, making it injectable.

#### 2.3.10.3.0.0.0.0.0 Integration Target

##### 2.3.10.3.1.0.0.0.0 Integration Target

AWS SQS

##### 2.3.10.3.2.0.0.0.0 Integration Type

Message Queue Consumer

##### 2.3.10.3.3.0.0.0.0 Required Client Classes

- SQSClient
- ReceiveMessageCommand
- DeleteMessageCommand

##### 2.3.10.3.4.0.0.0.0 Configuration Requirements

AWS Region, Queue URL, Credentials (to be handled via IAM roles in production).

##### 2.3.10.3.5.0.0.0.0 Error Handling Requirements

Specification mandates that failed message processing must not delete the message, allowing it to be retried based on the queue's visibility timeout. A Dead Letter Queue (DLQ) must be configured on the SQS queue itself.

##### 2.3.10.3.6.0.0.0.0 Authentication Requirements

AWS IAM credentials or role.

##### 2.3.10.3.7.0.0.0.0 Framework Integration Patterns

Validation requires a custom injectable provider for the `SQSClient` and a custom background service (`@Injectable()` class implementing `OnModuleInit`) to be created to manage the polling loop.

## 2.4.0.0.0.0.0.0.0 Component Count Validation

| Property | Value |
|----------|-------|
| Total Classes | 8 |
| Total Interfaces | 3 |
| Total Enums | 0 |
| Total Dtos | 3 |
| Total Configurations | 1 |
| Total External Integrations | 3 |
| Grand Total Components | 22 |
| Phase 2 Claimed Count | 0 |
| Phase 2 Actual Count | 0 |
| Validation Added Count | 22 |
| Final Validated Count | 22 |

# 3.0.0.0.0.0.0.0.0 File Structure

## 3.1.0.0.0.0.0.0.0 Directory Organization

### 3.1.1.0.0.0.0.0.0 Directory Path

#### 3.1.1.1.0.0.0.0.0 Directory Path

/

#### 3.1.1.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.1.3.0.0.0.0.0 Contains Files

- package.json
- tsconfig.json
- tsconfig.build.json
- nest-cli.json
- .nvmrc
- .editorconfig
- .env.example
- Dockerfile
- docker-compose.yml
- .eslintrc.js
- .prettierrc
- jest.config.ts
- .gitignore

#### 3.1.1.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.1.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.2.0.0.0.0.0.0 Directory Path

#### 3.1.2.1.0.0.0.0.0 Directory Path

.github/workflows

#### 3.1.2.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.2.3.0.0.0.0.0 Contains Files

- cicd-pipeline.yml

#### 3.1.2.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.2.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.3.0.0.0.0.0.0 Directory Path

#### 3.1.3.1.0.0.0.0.0 Directory Path

.vscode

#### 3.1.3.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.3.3.0.0.0.0.0 Contains Files

- launch.json

#### 3.1.3.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.3.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.4.0.0.0.0.0.0 Directory Path

#### 3.1.4.1.0.0.0.0.0 Directory Path

k8s

#### 3.1.4.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.4.3.0.0.0.0.0 Contains Files

- deployment.yaml
- service.yaml

#### 3.1.4.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.4.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

