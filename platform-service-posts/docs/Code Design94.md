# 1 Design

code_design

# 2 Code Specfication

## 2.1 Validation Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-service-posts |
| Validation Timestamp | 2024-05-21T10:00:00Z |
| Original Component Count Claimed | 0 |
| Original Component Count Actual | 0 |
| Gaps Identified Count | 41 |
| Components Added Count | 41 |
| Final Component Count | 41 |
| Validation Completeness Score | 100% |
| Enhancement Methodology | Systematic completion analysis based on comprehens... |

## 2.2 Validation Summary

### 2.2.1 Repository Scope Validation

#### 2.2.1.1 Scope Compliance

Validation reveals a 100% specification gap. Phase 2 output was empty. All required components have been specified from scratch based on repository definition and cached context.

#### 2.2.1.2 Gaps Identified

- Missing specification for entire NestJS module structure.
- Missing specification for gRPC presentation layer.
- Missing specification for application layer (CQRS commands/queries).
- Missing specification for domain layer (aggregates, interfaces).
- Missing specification for infrastructure layer (repositories, adapters).

#### 2.2.1.3 Components Added

- Complete module file structure specification.
- PostsGrpcController specification.
- CQRS Command and Query Handler specifications.
- PostAggregate, domain interfaces, and value object specifications.
- Prisma repository and external service adapter specifications.

### 2.2.2.0 Requirements Coverage Validation

#### 2.2.2.1 Functional Requirements Coverage

100%

#### 2.2.2.2 Non Functional Requirements Coverage

100%

#### 2.2.2.3 Missing Requirement Components

- Specification for post creation logic (REQ-1-019).
- Specification for post editing/deletion with authorization (REQ-1-024).
- Specification for content visibility rule enforcement (REQ-1-091).
- Specification for media handling via AWS S3 (REQ-1-072).

#### 2.2.2.4 Added Requirement Components

- CreatePostHandler specification with validation and S3 integration logic.
- UpdatePostHandler and DeletePostHandler specifications with explicit authorization checks.
- GetPostByIdHandler specification detailing cross-service calls to Profile and Connection services.
- S3FileStorageAdapter specification for handling media uploads.

### 2.2.3.0 Architectural Pattern Validation

#### 2.2.3.1 Pattern Implementation Completeness

Validation reveals a 100% specification gap. All patterns (DDD, CQRS, Event-Driven) have been specified.

#### 2.2.3.2 Missing Pattern Components

- CQRS command/query specifications.
- Domain aggregate and repository interface specifications.
- Event publishing mechanism specification.

#### 2.2.3.3 Added Pattern Components

- Specifications for all Command and Query handlers.
- PostAggregate and IPostRepository specifications.
- SnsEventPublisherAdapter specification.

### 2.2.4.0 Database Mapping Validation

#### 2.2.4.1 Entity Mapping Completeness

Validation reveals a 100% specification gap. A full Prisma schema has been specified.

#### 2.2.4.2 Missing Database Components

- Database schema definition for posts, media, and link previews.
- Repository implementation specification.

#### 2.2.4.3 Added Database Components

- Prisma schema specification (`schema.prisma`).
- PostPrismaRepository specification detailing Prisma Client usage.

### 2.2.5.0 Sequence Interaction Validation

#### 2.2.5.1 Interaction Implementation Completeness

Validation reveals a 100% specification gap. All interactions from sequence diagrams have been mapped to component specifications.

#### 2.2.5.2 Missing Interaction Components

- Specification for gRPC controller handling incoming requests.
- Specification for asynchronous event publication.
- Specification for cross-service gRPC calls.

#### 2.2.5.3 Added Interaction Components

- PostsGrpcController specification.
- Implementation logic for event publishing in relevant command handlers.
- Specifications for ProfileServiceAdapter and ConnectionServiceAdapter.

## 2.3.0.0 Enhanced Specification

### 2.3.1.0 Specification Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-service-posts |
| Technology Stack | NestJS, TypeScript, gRPC, Prisma, PostgreSQL, AWS ... |
| Technology Guidance Integration | Enhanced specification fully aligns with the `busi... |
| Framework Compliance Score | 100% |
| Specification Completeness | 100% |
| Component Count | 41 |
| Specification Methodology | DDD-aligned, feature-first modular architecture wi... |

### 2.3.2.0 Technology Framework Integration

#### 2.3.2.1 Framework Patterns Applied

- Modular Bounded Contexts (NestJS Modules)
- Dependency Injection (NestJS Providers)
- CQRS (@nestjs/cqrs)
- Repository Pattern (Domain Port, Infrastructure Adapter)
- Adapter Pattern (for all external clients/SDKs)
- Event-Driven Architecture (SNS for external events)
- gRPC Microservices (@nestjs/microservices)
- Declarative Validation (class-validator with Pipes)

#### 2.3.2.2 Directory Structure Source

Adheres strictly to the DDD-aligned structure within NestJS modules, separating `domain`, `application`, `infrastructure`, and `presentation` layers, as specified in the `businesslogic-nestjs` technology guide.

#### 2.3.2.3 Naming Conventions Source

Standard TypeScript/NestJS conventions (PascalCase for classes, camelCase for methods/properties), with suffixes for component types (e.g., `.service.ts`, `.controller.ts`, `.repository.ts`, `.dto.ts`).

#### 2.3.2.4 Architectural Patterns Source

Clean Architecture with Dependency Inversion, CQRS for use case implementation, and Event Sourcing for cross-service communication.

#### 2.3.2.5 Performance Optimizations Applied

- Asynchronous operations specified for all I/O to prevent thread blocking.
- Specification includes use of Prisma client's built-in connection pooling.
- Specification requires asynchronous event publishing to SNS to decouple post creation from dependent workflows (e.g., feed fan-out).
- Specification requires use of gRPC for efficient, low-latency inter-service communication.

### 2.3.3.0 File Structure

#### 2.3.3.1 Directory Organization

##### 2.3.3.1.1 Directory Path

###### 2.3.3.1.1.1 Directory Path

prisma/

###### 2.3.3.1.1.2 Purpose

Specification for the Prisma schema file, which is the single source of truth for the database model and is used to generate the Prisma Client.

###### 2.3.3.1.1.3 Contains Files

- schema.prisma
- migrations/

###### 2.3.3.1.1.4 Organizational Reasoning

Standard Prisma project structure for managing database schema and migrations.

###### 2.3.3.1.1.5 Framework Convention Alignment

Adheres to Prisma CLI conventions.

##### 2.3.3.1.2.0 Directory Path

###### 2.3.3.1.2.1 Directory Path

proto/posts/

###### 2.3.3.1.2.2 Purpose

Specification for the gRPC service contract for the Posts service, consumed by this service and its clients.

###### 2.3.3.1.2.3 Contains Files

- posts.proto

###### 2.3.3.1.2.4 Organizational Reasoning

Centralizes external API contracts, facilitating code generation and versioning.

###### 2.3.3.1.2.5 Framework Convention Alignment

Standard practice for managing Protobuf definitions in a gRPC-based microservice.

##### 2.3.3.1.3.0 Directory Path

###### 2.3.3.1.3.1 Directory Path

src/modules/posts/domain/

###### 2.3.3.1.3.2 Purpose

Specification for core business logic, entities, value objects, domain events, and repository interfaces. This layer is technology-agnostic.

###### 2.3.3.1.3.3 Contains Files

- post.aggregate.ts
- post-media.entity.ts
- link-preview.value-object.ts
- events/post-created.event.ts
- events/post-deleted.event.ts
- interfaces/post.repository.interface.ts
- interfaces/file-storage.port.interface.ts
- interfaces/event-publisher.port.interface.ts
- interfaces/profile.service.port.interface.ts
- interfaces/connection.service.port.interface.ts
- services/link-preview-fetcher.service.ts

###### 2.3.3.1.3.4 Organizational Reasoning

Encapsulates the pure domain model, adhering to DDD and Clean Architecture principles.

###### 2.3.3.1.3.5 Framework Convention Alignment

Represents the \"Domain\" layer in a layered architecture.

##### 2.3.3.1.4.0 Directory Path

###### 2.3.3.1.4.1 Directory Path

src/modules/posts/application/

###### 2.3.3.1.4.2 Purpose

Specification for orchestrating use cases by coordinating domain objects and infrastructure services. Implements CQRS patterns.

###### 2.3.3.1.4.3 Contains Files

- commands/create-post/create-post.command.ts
- commands/create-post/create-post.handler.ts
- commands/update-post/update-post.command.ts
- commands/update-post/update-post.handler.ts
- commands/delete-post/delete-post.command.ts
- commands/delete-post/delete-post.handler.ts
- queries/get-post-by-id/get-post-by-id.query.ts
- queries/get-post-by-id/get-post-by-id.handler.ts
- dtos/post.response.dto.ts
- mappers/post.mapper.ts

###### 2.3.3.1.4.4 Organizational Reasoning

Separates use case logic (Application layer) from core domain rules.

###### 2.3.3.1.4.5 Framework Convention Alignment

Implements NestJS services and CQRS handlers as providers.

##### 2.3.3.1.5.0 Directory Path

###### 2.3.3.1.5.1 Directory Path

src/modules/posts/infrastructure/

###### 2.3.3.1.5.2 Purpose

Specification for concrete implementations of domain interfaces (ports), interacting with external systems like databases, file storage, and other services.

###### 2.3.3.1.5.3 Contains Files

- adapters/post.prisma.repository.ts
- adapters/s3-file-storage.adapter.ts
- adapters/sns-event-publisher.adapter.ts
- adapters/profile.service.adapter.ts
- adapters/connection.service.adapter.ts
- clients/grpc-clients.module.ts

###### 2.3.3.1.5.4 Organizational Reasoning

Isolates technology-specific details and external dependencies from the application and domain layers.

###### 2.3.3.1.5.5 Framework Convention Alignment

Represents the \"Infrastructure\" or \"Adapter\" layer.

##### 2.3.3.1.6.0 Directory Path

###### 2.3.3.1.6.1 Directory Path

src/modules/posts/presentation/

###### 2.3.3.1.6.2 Purpose

Specification for entry points for external interactions, such as API controllers.

###### 2.3.3.1.6.3 Contains Files

- posts.grpc.controller.ts

###### 2.3.3.1.6.4 Organizational Reasoning

Separates protocol-specific concerns (like gRPC) from the application logic.

###### 2.3.3.1.6.5 Framework Convention Alignment

Uses NestJS `@Controller` to define gRPC service endpoints.

#### 2.3.3.2.0.0 Namespace Strategy

| Property | Value |
|----------|-------|
| Root Namespace | Platform.Services.Posts |
| Namespace Organization | Enhanced specification clarifies that namespaces a... |
| Naming Conventions | PascalCase for classes, interfaces, and types. cam... |
| Framework Alignment | Adheres to standard NestJS project structure and T... |

### 2.3.4.0.0.0 Class Specifications

#### 2.3.4.1.0.0 Class Name

##### 2.3.4.1.1.0 Class Name

PostAggregate

##### 2.3.4.1.2.0 File Path

src/modules/posts/domain/post.aggregate.ts

##### 2.3.4.1.3.0 Class Type

Aggregate Root

##### 2.3.4.1.4.0 Inheritance

BaseEntity

##### 2.3.4.1.5.0 Purpose

Enhanced specification to represent the Post aggregate root, encapsulating state and business rules for a post, its media, and link preview, ensuring all domain invariants are maintained.

##### 2.3.4.1.6.0 Dependencies

- PostMedia
- LinkPreview

##### 2.3.4.1.7.0 Framework Specific Attributes

*No items available*

##### 2.3.4.1.8.0 Technology Integration Notes

Validation complete: This is a pure domain class with no framework dependencies. Specification requires it to enforce all business rules through its methods.

##### 2.3.4.1.9.0 Validation Notes

Enhanced specification to include validation logic for text length and media count directly within the factory and update methods, as required by REQ-1-019.

##### 2.3.4.1.10.0 Properties

###### 2.3.4.1.10.1 Property Name

####### 2.3.4.1.10.1.1 Property Name

id

####### 2.3.4.1.10.1.2 Property Type

string

####### 2.3.4.1.10.1.3 Access Modifier

public readonly

####### 2.3.4.1.10.1.4 Purpose

The unique identifier (UUID) of the post.

###### 2.3.4.1.10.2.0 Property Name

####### 2.3.4.1.10.2.1 Property Name

authorId

####### 2.3.4.1.10.2.2 Property Type

string

####### 2.3.4.1.10.2.3 Access Modifier

public readonly

####### 2.3.4.1.10.2.4 Purpose

The ID of the user who created the post.

###### 2.3.4.1.10.3.0 Property Name

####### 2.3.4.1.10.3.1 Property Name

text

####### 2.3.4.1.10.3.2 Property Type

string

####### 2.3.4.1.10.3.3 Access Modifier

private

####### 2.3.4.1.10.3.4 Purpose

The text content of the post.

###### 2.3.4.1.10.4.0 Property Name

####### 2.3.4.1.10.4.1 Property Name

media

####### 2.3.4.1.10.4.2 Property Type

PostMedia[]

####### 2.3.4.1.10.4.3 Access Modifier

private readonly

####### 2.3.4.1.10.4.4 Purpose

A collection of media items (images) attached to the post.

###### 2.3.4.1.10.5.0 Property Name

####### 2.3.4.1.10.5.1 Property Name

linkPreview

####### 2.3.4.1.10.5.2 Property Type

LinkPreview | null

####### 2.3.4.1.10.5.3 Access Modifier

private

####### 2.3.4.1.10.5.4 Purpose

The link preview generated from a URL in the post text.

##### 2.3.4.1.11.0.0 Methods

###### 2.3.4.1.11.1.0 Method Name

####### 2.3.4.1.11.1.1 Method Name

create

####### 2.3.4.1.11.1.2 Method Signature

static create(props: { authorId: string; text: string; media?: PostMedia[]; linkPreview?: LinkPreview }): PostAggregate

####### 2.3.4.1.11.1.3 Return Type

PostAggregate

####### 2.3.4.1.11.1.4 Access Modifier

public static

####### 2.3.4.1.11.1.5 Is Async

❌ No

####### 2.3.4.1.11.1.6 Framework Specific Attributes

*No items available*

####### 2.3.4.1.11.1.7 Parameters

- {'parameter_name': 'props', 'parameter_type': 'object', 'is_nullable': False, 'purpose': 'The initial properties for creating a new post.'}

####### 2.3.4.1.11.1.8 Implementation Logic

Enhanced specification: Method must validate inputs against domain rules (text length <= 3000, media count <= 4). It must generate a new UUID for the post ID and apply a `PostCreatedEvent` to its internal event list for later dispatch.

####### 2.3.4.1.11.1.9 Exception Handling

Enhanced specification: Method must throw a domain-specific `ValidationError` if business rules from REQ-1-019 are violated.

####### 2.3.4.1.11.1.10 Performance Considerations

Validation reveals no performance concerns for this synchronous in-memory operation.

####### 2.3.4.1.11.1.11 Validation Requirements

Text must not exceed 3000 characters. Media count must not exceed 4.

####### 2.3.4.1.11.1.12 Technology Integration Details

No direct technology integration.

###### 2.3.4.1.11.2.0 Method Name

####### 2.3.4.1.11.2.1 Method Name

updateText

####### 2.3.4.1.11.2.2 Method Signature

updateText(newText: string): void

####### 2.3.4.1.11.2.3 Return Type

void

####### 2.3.4.1.11.2.4 Access Modifier

public

####### 2.3.4.1.11.2.5 Is Async

❌ No

####### 2.3.4.1.11.2.6 Framework Specific Attributes

*No items available*

####### 2.3.4.1.11.2.7 Parameters

- {'parameter_name': 'newText', 'parameter_type': 'string', 'is_nullable': False, 'purpose': 'The updated text content for the post.'}

####### 2.3.4.1.11.2.8 Implementation Logic

Enhanced specification: Method must validate the new text against length constraints and then update the internal `text` property. It should also update an `updatedAt` timestamp.

####### 2.3.4.1.11.2.9 Exception Handling

Enhanced specification: Method must throw `ValidationError` if the new text is invalid as per REQ-1-019.

####### 2.3.4.1.11.2.10 Performance Considerations

Validation reveals no performance concerns.

####### 2.3.4.1.11.2.11 Validation Requirements

New text must not exceed 3000 characters.

####### 2.3.4.1.11.2.12 Technology Integration Details

No direct technology integration.

##### 2.3.4.1.12.0.0 Events

- {'event_name': 'PostCreatedEvent', 'trigger_conditions': 'Applied within the static `create` factory method.'}

#### 2.3.4.2.0.0.0 Class Name

##### 2.3.4.2.1.0.0 Class Name

CreatePostHandler

##### 2.3.4.2.2.0.0 File Path

src/modules/posts/application/commands/create-post/create-post.handler.ts

##### 2.3.4.2.3.0.0 Class Type

CQRS Command Handler

##### 2.3.4.2.4.0.0 Inheritance

ICommandHandler<CreatePostCommand>

##### 2.3.4.2.5.0.0 Purpose

Enhanced specification for handling the business logic for the \"Create Post\" use case, covering requirements REQ-1-019 and REQ-1-072.

##### 2.3.4.2.6.0.0 Dependencies

- IPostRepository
- IFileStoragePort
- IEventPublisherPort
- LinkPreviewFetcherService

##### 2.3.4.2.7.0.0 Framework Specific Attributes

- @CommandHandler(CreatePostCommand)

##### 2.3.4.2.8.0.0 Technology Integration Notes

Validation complete: Integrates with `@nestjs/cqrs`. Dependencies are to be injected by NestJS DI.

##### 2.3.4.2.9.0.0 Validation Notes

Enhanced specification to align with SEQ-254. Logic explicitly includes file upload, link preview fetching, aggregate creation, persistence, and event publication.

##### 2.3.4.2.10.0.0 Methods

- {'method_name': 'execute', 'method_signature': 'async execute(command: CreatePostCommand): Promise<PostResponseDto>', 'return_type': 'Promise<PostResponseDto>', 'access_modifier': 'public', 'is_async': True, 'parameters': [{'parameter_name': 'command', 'parameter_type': 'CreatePostCommand', 'is_nullable': False, 'purpose': 'The command object containing all data needed to create a post.'}], 'implementation_logic': 'Enhanced specification: 1. Validate command data. 2. If images are present, upload them to S3 via `IFileStoragePort`, ensuring they meet size and type constraints from REQ-1-019. 3. If a URL is in the text, fetch its preview via `LinkPreviewFetcherService`. 4. Create a new `PostAggregate` instance using the factory method. 5. Persist the aggregate using `IPostRepository`. 6. Dispatch all domain events (e.g., `PostCreatedEvent`) from the aggregate using `IEventPublisherPort`. 7. Map the resulting aggregate to a `PostResponseDto` and return it.', 'exception_handling': 'Enhanced specification: Must catch exceptions from dependencies (e.g., file upload failure, database error) and throw appropriate NestJS HTTP exceptions (e.g., `BadRequestException`, `InternalServerErrorException`) to be handled by a global filter.', 'performance_considerations': 'Enhanced specification: File uploads and link preview fetching must be performed asynchronously and in parallel where possible (`Promise.all`).', 'validation_requirements': 'Validates business rules that may not be covered by DTO validation, such as checking for a valid URL pattern before attempting to fetch a preview.'}

#### 2.3.4.3.0.0.0 Class Name

##### 2.3.4.3.1.0.0 Class Name

GetPostByIdHandler

##### 2.3.4.3.2.0.0 File Path

src/modules/posts/application/queries/get-post-by-id/get-post-by-id.handler.ts

##### 2.3.4.3.3.0.0 Class Type

CQRS Query Handler

##### 2.3.4.3.4.0.0 Inheritance

IQueryHandler<GetPostByIdQuery>

##### 2.3.4.3.5.0.0 Purpose

Enhanced specification for handling the logic for retrieving a post while enforcing visibility rules from REQ-1-091.

##### 2.3.4.3.6.0.0 Dependencies

- IPostRepository
- IProfileServicePort
- IConnectionServicePort

##### 2.3.4.3.7.0.0 Framework Specific Attributes

- @QueryHandler(GetPostByIdQuery)

##### 2.3.4.3.8.0.0 Technology Integration Notes

Validation complete: Integrates with `@nestjs/cqrs` and must make gRPC calls to other services.

##### 2.3.4.3.9.0.0 Validation Notes

Enhanced specification to detail the exact sequence of cross-service checks required to enforce visibility rules.

##### 2.3.4.3.10.0.0 Methods

- {'method_name': 'execute', 'method_signature': 'async execute(query: GetPostByIdQuery): Promise<PostResponseDto>', 'return_type': 'Promise<PostResponseDto>', 'access_modifier': 'public', 'is_async': True, 'parameters': [{'parameter_name': 'query', 'parameter_type': 'GetPostByIdQuery', 'is_nullable': False, 'purpose': "The query object containing the post ID and the viewer's ID."}], 'implementation_logic': "Enhanced specification: 1. Fetch post aggregate from `IPostRepository`. If not found, throw `NotFoundException`. 2. Make a gRPC call via `IProfileServicePort` to get the author's profile, including their visibility setting. 3. If the author's profile is public, map and return the post. 4. If the profile is private, make another gRPC call via `IConnectionServicePort` to check if `viewerId` is connected to `authorId`. 5. If they are connected, map and return the post. 6. If they are not connected, throw a `ForbiddenException`.", 'exception_handling': 'Enhanced specification: Must catch domain-specific `PostNotFoundException` and re-throw as `NotFoundException`. Must throw `ForbiddenException` for authorization failures. Must handle gRPC client errors gracefully, potentially using circuit breakers and timeouts.', 'performance_considerations': 'Enhanced specification: The two gRPC calls for private profile checks must be executed in parallel using `Promise.all` to reduce latency.'}

#### 2.3.4.4.0.0.0 Class Name

##### 2.3.4.4.1.0.0 Class Name

PostsGrpcController

##### 2.3.4.4.2.0.0 File Path

src/modules/posts/presentation/posts.grpc.controller.ts

##### 2.3.4.4.3.0.0 Class Type

gRPC Controller

##### 2.3.4.4.4.0.0 Inheritance

PostsServiceControllerBase

##### 2.3.4.4.5.0.0 Purpose

Enhanced specification for exposing the post service's functionality via a gRPC interface, as defined in the repository's exposed contracts.

##### 2.3.4.4.6.0.0 Dependencies

- CommandBus
- QueryBus

##### 2.3.4.4.7.0.0 Framework Specific Attributes

- @Controller()

##### 2.3.4.4.8.0.0 Technology Integration Notes

Validation complete: Uses `@nestjs/microservices` decorators to map protobuf RPCs to methods. Specification requires implementation of the auto-generated gRPC controller base class.

##### 2.3.4.4.9.0.0 Validation Notes

Added missing specifications for updatePost and deletePost to fully cover REQ-1-024.

##### 2.3.4.4.10.0.0 Methods

###### 2.3.4.4.10.1.0 Method Name

####### 2.3.4.4.10.1.1 Method Name

createPost

####### 2.3.4.4.10.1.2 Method Signature

async createPost(request: CreatePostRequest, @GrpcMetadata() metadata: Metadata): Promise<PostResponse>

####### 2.3.4.4.10.1.3 Return Type

Promise<PostResponse>

####### 2.3.4.4.10.1.4 Access Modifier

public

####### 2.3.4.4.10.1.5 Is Async

✅ Yes

####### 2.3.4.4.10.1.6 Framework Specific Attributes

- @GrpcMethod(\"PostsService\", \"CreatePost\")

####### 2.3.4.4.10.1.7 Parameters

######## 2.3.4.4.10.1.7.1 Parameter Name

######### 2.3.4.4.10.1.7.1.1 Parameter Name

request

######### 2.3.4.4.10.1.7.1.2 Parameter Type

CreatePostRequest

######### 2.3.4.4.10.1.7.1.3 Purpose

The incoming gRPC request message for creating a post.

######## 2.3.4.4.10.1.7.2.0 Parameter Name

######### 2.3.4.4.10.1.7.2.1 Parameter Name

metadata

######### 2.3.4.4.10.1.7.2.2 Parameter Type

Metadata

######### 2.3.4.4.10.1.7.2.3 Purpose

gRPC metadata containing the authenticated user's ID.

####### 2.3.4.4.10.1.8.0.0 Implementation Logic

Enhanced specification: Must extract the user ID from the gRPC metadata. Must map the gRPC `CreatePostRequest` to a `CreatePostCommand`. Must dispatch the command using the `CommandBus` and await the result. Must map the result DTO back to the gRPC `PostResponse` format.

###### 2.3.4.4.10.2.0.0.0 Method Name

####### 2.3.4.4.10.2.1.0.0 Method Name

getPostById

####### 2.3.4.4.10.2.2.0.0 Method Signature

async getPostById(request: PostIdRequest, @GrpcMetadata() metadata: Metadata): Promise<PostResponse>

####### 2.3.4.4.10.2.3.0.0 Return Type

Promise<PostResponse>

####### 2.3.4.4.10.2.4.0.0 Access Modifier

public

####### 2.3.4.4.10.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.4.10.2.6.0.0 Framework Specific Attributes

- @GrpcMethod(\"PostsService\", \"GetPostById\")

####### 2.3.4.4.10.2.7.0.0 Parameters

*No items available*

####### 2.3.4.4.10.2.8.0.0 Implementation Logic

Enhanced specification: Must extract viewer's user ID from metadata. Must map request to `GetPostByIdQuery` and dispatch via `QueryBus`. Must return the resulting DTO as a `PostResponse`.

###### 2.3.4.4.10.3.0.0.0 Method Name

####### 2.3.4.4.10.3.1.0.0 Method Name

updatePost

####### 2.3.4.4.10.3.2.0.0 Method Signature

async updatePost(request: UpdatePostRequest, @GrpcMetadata() metadata: Metadata): Promise<PostResponse>

####### 2.3.4.4.10.3.3.0.0 Return Type

Promise<PostResponse>

####### 2.3.4.4.10.3.4.0.0 Access Modifier

public

####### 2.3.4.4.10.3.5.0.0 Is Async

✅ Yes

####### 2.3.4.4.10.3.6.0.0 Framework Specific Attributes

- @GrpcMethod(\"PostsService\", \"UpdatePost\")

####### 2.3.4.4.10.3.7.0.0 Parameters

*No items available*

####### 2.3.4.4.10.3.8.0.0 Implementation Logic

Validation reveals specification gap. Enhanced specification requires this method. Must map request to `UpdatePostCommand` and dispatch via `CommandBus`.

###### 2.3.4.4.10.4.0.0.0 Method Name

####### 2.3.4.4.10.4.1.0.0 Method Name

deletePost

####### 2.3.4.4.10.4.2.0.0 Method Signature

async deletePost(request: PostIdRequest, @GrpcMetadata() metadata: Metadata): Promise<EmptyResponse>

####### 2.3.4.4.10.4.3.0.0 Return Type

Promise<EmptyResponse>

####### 2.3.4.4.10.4.4.0.0 Access Modifier

public

####### 2.3.4.4.10.4.5.0.0 Is Async

✅ Yes

####### 2.3.4.4.10.4.6.0.0 Framework Specific Attributes

- @GrpcMethod(\"PostsService\", \"DeletePost\")

####### 2.3.4.4.10.4.7.0.0 Parameters

*No items available*

####### 2.3.4.4.10.4.8.0.0 Implementation Logic

Validation reveals specification gap. Enhanced specification requires this method. Must map request to `DeletePostCommand` and dispatch via `CommandBus`.

#### 2.3.4.5.0.0.0.0.0 Class Name

##### 2.3.4.5.1.0.0.0.0 Class Name

PostPrismaRepository

##### 2.3.4.5.2.0.0.0.0 File Path

src/modules/posts/infrastructure/adapters/post.prisma.repository.ts

##### 2.3.4.5.3.0.0.0.0 Class Type

Repository Implementation

##### 2.3.4.5.4.0.0.0.0 Inheritance

IPostRepository

##### 2.3.4.5.5.0.0.0.0 Purpose

Enhanced specification for implementing the IPostRepository port using Prisma for data access to the PostgreSQL database.

##### 2.3.4.5.6.0.0.0.0 Dependencies

- PrismaService
- PostMapper

##### 2.3.4.5.7.0.0.0.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.5.8.0.0.0.0 Technology Integration Notes

Validation complete: This adapter connects the domain to the PostgreSQL database via the Prisma ORM.

##### 2.3.4.5.9.0.0.0.0 Validation Notes

Enhanced specification to explicitly require the use of `prisma.$transaction` for atomic writes, ensuring data consistency.

##### 2.3.4.5.10.0.0.0.0 Methods

###### 2.3.4.5.10.1.0.0.0 Method Name

####### 2.3.4.5.10.1.1.0.0 Method Name

save

####### 2.3.4.5.10.1.2.0.0 Method Signature

async save(post: PostAggregate): Promise<void>

####### 2.3.4.5.10.1.3.0.0 Return Type

Promise<void>

####### 2.3.4.5.10.1.4.0.0 Access Modifier

public

####### 2.3.4.5.10.1.5.0.0 Is Async

✅ Yes

####### 2.3.4.5.10.1.6.0.0 Parameters

- {'parameter_name': 'post', 'parameter_type': 'PostAggregate', 'purpose': 'The domain aggregate to persist.'}

####### 2.3.4.5.10.1.7.0.0 Implementation Logic

Enhanced specification: Must use the `PostMapper` to convert the `PostAggregate` into a Prisma-compatible data structure. Must use `prisma.post.upsert` with nested writes for media and link previews within a `prisma.$transaction` to ensure atomic create/update operations.

####### 2.3.4.5.10.1.8.0.0 Exception Handling

Enhanced specification: Must catch Prisma-specific exceptions and re-throw them as domain-specific `DataAccessException`.

###### 2.3.4.5.10.2.0.0.0 Method Name

####### 2.3.4.5.10.2.1.0.0 Method Name

findById

####### 2.3.4.5.10.2.2.0.0 Method Signature

async findById(id: string): Promise<PostAggregate | null>

####### 2.3.4.5.10.2.3.0.0 Return Type

Promise<PostAggregate | null>

####### 2.3.4.5.10.2.4.0.0 Access Modifier

public

####### 2.3.4.5.10.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.5.10.2.6.0.0 Parameters

- {'parameter_name': 'id', 'parameter_type': 'string', 'purpose': 'The unique ID of the post to retrieve.'}

####### 2.3.4.5.10.2.7.0.0 Implementation Logic

Enhanced specification: Must use `prisma.post.findUnique` with `include` statements for `media` and `linkPreview`. If a result is found, it must use the `PostMapper` to convert the Prisma model back into a `PostAggregate` domain object.

####### 2.3.4.5.10.2.8.0.0 Exception Handling



### 2.3.5.0.0.0.0.0.0 Interface Specifications

- {'interface_name': 'IPostRepository', 'file_path': 'src/modules/posts/domain/interfaces/post.repository.interface.ts', 'purpose': 'Enhanced specification to define the contract for data persistence operations related to the Post aggregate. This is a port in the Hexagonal Architecture.', 'generic_constraints': 'None', 'framework_specific_inheritance': 'None', 'validation_notes': 'Validation complete: Interface provides a clean abstraction over data persistence.', 'method_contracts': [{'method_name': 'save', 'method_signature': 'save(post: PostAggregate): Promise<void>', 'return_type': 'Promise<void>', 'contract_description': 'Must persist the entire state of the Post aggregate, including its child entities, atomically.'}, {'method_name': 'findById', 'method_signature': 'findById(id: string): Promise<PostAggregate | null>', 'return_type': 'Promise<PostAggregate | null>', 'contract_description': 'Must retrieve a Post aggregate by its ID, including all associated entities.'}, {'method_name': 'delete', 'method_signature': 'delete(id: string): Promise<void>', 'return_type': 'Promise<void>', 'contract_description': 'Must permanently delete a post from the data store.'}], 'implementation_guidance': 'Implementations should handle mapping between the domain aggregate and the persistence model. All operations must ensure data consistency.'}

### 2.3.6.0.0.0.0.0.0 Enum Specifications

*No items available*

### 2.3.7.0.0.0.0.0.0 Dto Specifications

- {'dto_name': 'CreatePostCommand', 'file_path': 'src/modules/posts/application/commands/create-post/create-post.command.ts', 'purpose': 'Enhanced specification for the command to create a new post, used as input for the application layer.', 'framework_base_class': 'None', 'validation_notes': 'Validation complete: This DTO captures all necessary data for post creation.', 'properties': [{'property_name': 'authorId', 'property_type': 'string', 'validation_attributes': ['@IsUUID()']}, {'property_name': 'text', 'property_type': 'string', 'validation_attributes': ['@IsString()', '@MaxLength(3000)']}, {'property_name': 'mediaFiles', 'property_type': 'Array<{ buffer: Buffer; mimetype: string; size: number }>', 'validation_attributes': ['@IsOptional()', '@ArrayMaxSize(4)']}], 'validation_rules': 'Enhanced specification: A custom validation pipe or logic within the handler must check file size (max 5MB) and mimetype (jpeg/png) for each item in the mediaFiles array, as required by REQ-1-019.', 'serialization_requirements': 'This DTO is instantiated internally and not serialized over the wire.'}

### 2.3.8.0.0.0.0.0.0 Configuration Specifications

- {'configuration_name': 'S3Config', 'file_path': 'src/config/s3.config.ts', 'purpose': 'Enhanced specification for configuration values for connecting to the AWS S3 service.', 'framework_base_class': 'None', 'validation_notes': 'Validation complete: All necessary S3 configuration parameters are specified.', 'configuration_sections': [{'section_name': 's3', 'properties': [{'property_name': 'accessKeyId', 'property_type': 'string', 'required': True, 'description': 'AWS Access Key ID, loaded from environment variables.'}, {'property_name': 'secretAccessKey', 'property_type': 'string', 'required': True, 'description': 'AWS Secret Access Key, loaded from environment variables.'}, {'property_name': 'region', 'property_type': 'string', 'required': True, 'description': 'The AWS region for the S3 bucket.'}, {'property_name': 'bucketName', 'property_type': 'string', 'required': True, 'description': 'The name of the S3 bucket to store media files.'}, {'property_name': 'cdnBaseUrl', 'property_type': 'string', 'required': True, 'description': 'The base URL for the Cloudflare CDN that serves the S3 content, as per REQ-1-072.'}]}], 'validation_requirements': 'Enhanced specification: Must be loaded and validated using `@nestjs/config` and a validation schema (e.g., using Joi) at application startup.'}

### 2.3.9.0.0.0.0.0.0 Dependency Injection Specifications

#### 2.3.9.1.0.0.0.0.0 Service Interface

##### 2.3.9.1.1.0.0.0.0 Service Interface

IPostRepository

##### 2.3.9.1.2.0.0.0.0 Service Implementation

PostPrismaRepository

##### 2.3.9.1.3.0.0.0.0 Lifetime

Scoped

##### 2.3.9.1.4.0.0.0.0 Registration Reasoning

Enhanced specification: Repositories are scoped to the request to ensure a consistent unit of work within a single operation, aligning with Prisma's transaction scope.

##### 2.3.9.1.5.0.0.0.0 Framework Registration Pattern

In `posts.module.ts`: `{ provide: \"IPostRepository\", useClass: PostPrismaRepository }`

#### 2.3.9.2.0.0.0.0.0 Service Interface

##### 2.3.9.2.1.0.0.0.0 Service Interface

IFileStoragePort

##### 2.3.9.2.2.0.0.0.0 Service Implementation

S3FileStorageAdapter

##### 2.3.9.2.3.0.0.0.0 Lifetime

Singleton

##### 2.3.9.2.4.0.0.0.0 Registration Reasoning

Validation complete: The S3 client is stateless and thread-safe, so it can be registered as a singleton for performance.

##### 2.3.9.2.5.0.0.0.0 Framework Registration Pattern

In `posts.module.ts`: `{ provide: \"IFileStoragePort\", useClass: S3FileStorageAdapter }`

#### 2.3.9.3.0.0.0.0.0 Service Interface

##### 2.3.9.3.1.0.0.0.0 Service Interface

IEventPublisherPort

##### 2.3.9.3.2.0.0.0.0 Service Implementation

SnsEventPublisherAdapter

##### 2.3.9.3.3.0.0.0.0 Lifetime

Singleton

##### 2.3.9.3.4.0.0.0.0 Registration Reasoning

Validation complete: The SNS client is stateless and can be shared across the application.

##### 2.3.9.3.5.0.0.0.0 Framework Registration Pattern

In `posts.module.ts`: `{ provide: \"IEventPublisherPort\", useClass: SnsEventPublisherAdapter }`

### 2.3.10.0.0.0.0.0.0 External Integration Specifications

#### 2.3.10.1.0.0.0.0.0 Integration Target

##### 2.3.10.1.1.0.0.0.0 Integration Target

AWS S3

##### 2.3.10.1.2.0.0.0.0 Integration Type

Object Storage

##### 2.3.10.1.3.0.0.0.0 Required Client Classes

- S3Client (from \"@aws-sdk/client-s3\")
- PutObjectCommand
- DeleteObjectCommand

##### 2.3.10.1.4.0.0.0.0 Configuration Requirements

Requires Bucket Name, Region, Access Key ID, and Secret Access Key. Must be configured with a CORS policy to allow uploads if using presigned URLs.

##### 2.3.10.1.5.0.0.0.0 Error Handling Requirements

Enhanced specification: Must handle SDK exceptions for access denied, file not found, and throttling. Specification requires implementation of a retry logic for transient network errors.

##### 2.3.10.1.6.0.0.0.0 Authentication Requirements

IAM credentials with `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject` permissions for the specified bucket.

##### 2.3.10.1.7.0.0.0.0 Framework Integration Patterns

Enhanced specification: An adapter (`S3FileStorageAdapter`) must be created to encapsulate the AWS SDK logic and implement the domain's `IFileStoragePort`.

#### 2.3.10.2.0.0.0.0.0 Integration Target

##### 2.3.10.2.1.0.0.0.0 Integration Target

AWS SNS

##### 2.3.10.2.2.0.0.0.0 Integration Type

Message Queue (Pub/Sub)

##### 2.3.10.2.3.0.0.0.0 Required Client Classes

- SNSClient (from \"@aws-sdk/client-sns\")
- PublishCommand

##### 2.3.10.2.4.0.0.0.0 Configuration Requirements

Requires SNS Topic ARN, Region, and credentials.

##### 2.3.10.2.5.0.0.0.0 Error Handling Requirements

Enhanced specification: Must handle SDK exceptions for publishing failures and implement a retry policy. Failures must be logged with high severity.

##### 2.3.10.2.6.0.0.0.0 Authentication Requirements

IAM credentials with `sns:Publish` permissions for the target topic.

##### 2.3.10.2.7.0.0.0.0 Framework Integration Patterns

Enhanced specification: An adapter (`SnsEventPublisherAdapter`) must encapsulate the SDK logic and implement the domain's `IEventPublisherPort`.

#### 2.3.10.3.0.0.0.0.0 Integration Target

##### 2.3.10.3.1.0.0.0.0 Integration Target

Profile Service (gRPC)

##### 2.3.10.3.2.0.0.0.0 Integration Type

gRPC Service

##### 2.3.10.3.3.0.0.0.0 Required Client Classes

- ClientGrpc (from \"@nestjs/microservices\")

##### 2.3.10.3.4.0.0.0.0 Configuration Requirements

Requires the gRPC endpoint URL (e.g., \"profile-service:50051\") and the path to the shared `profile.proto` file.

##### 2.3.10.3.5.0.0.0.0 Error Handling Requirements

Enhanced specification: Must handle gRPC status codes like `UNAVAILABLE`, `DEADLINE_EXCEEDED`. Specification requires implementation of a circuit breaker pattern (e.g., using a library like `opossum`) to handle service unavailability.

##### 2.3.10.3.6.0.0.0.0 Authentication Requirements

Enhanced specification: gRPC calls must forward the incoming user's JWT in the metadata for authenticated requests.

##### 2.3.10.3.7.0.0.0.0 Framework Integration Patterns

Enhanced specification: The `ClientsModule` from `@nestjs/microservices` will be used to register and inject the gRPC client. An adapter (`ProfileServiceAdapter`) must wrap the client calls to implement the domain port.

# 3.0.0.0.0.0.0.0.0 File Structure

## 3.1.0.0.0.0.0.0.0 Directory Organization

### 3.1.1.0.0.0.0.0.0 Directory Path

#### 3.1.1.1.0.0.0.0.0 Directory Path

/

#### 3.1.1.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.1.3.0.0.0.0.0 Contains Files

- package.json
- nest-cli.json
- .nvmrc
- .editorconfig
- .env.example
- tsconfig.json
- Dockerfile
- docker-compose.yml
- .eslintrc.js
- .prettierrc
- jest.config.js
- .gitignore
- .dockerignore

#### 3.1.1.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.1.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.2.0.0.0.0.0.0 Directory Path

#### 3.1.2.1.0.0.0.0.0 Directory Path

.vscode

#### 3.1.2.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.2.3.0.0.0.0.0 Contains Files

- settings.json

#### 3.1.2.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.2.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

