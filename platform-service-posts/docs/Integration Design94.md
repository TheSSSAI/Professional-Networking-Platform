# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | REPO-SVC-POSTS |
| Extraction Timestamp | 2024-04-20T11:00:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 100% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-019

#### 1.2.1.2 Requirement Text

The system shall allow users to create and publish posts. A post can contain text with a maximum of 3000 characters. Users can optionally attach up to 4 images per post, with each image being in JPEG or PNG format and not exceeding 5MB. If a post contains an external URL, the system must automatically generate and display a link preview (e.g., with title, description, and image).

#### 1.2.1.3 Validation Criteria

- Verify a user can create and publish a text-only post.
- Verify the 3000 character limit for text is enforced.
- Verify a user can upload 1 to 4 valid images to a post.
- Verify image uploads are validated for file type (JPEG/PNG) and size (max 5MB).
- Verify that pasting a valid URL into the post editor generates a link preview.

#### 1.2.1.4 Implementation Implications

- The service must implement a gRPC method createPost to handle incoming post creation requests.
- The service must perform server-side validation for text length, image count, image format, and image size.
- An asynchronous event PostCreated must be published to an event bus upon successful creation to trigger the news feed fan-out process.
- Requires integration with AWS S3 for storing uploaded image files, likely using a pre-signed URL pattern.

#### 1.2.1.5 Extraction Reasoning

This is the primary functional requirement defining the core responsibility of the Posts service, covering the creation of posts with text, images, and link previews.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-023

#### 1.2.2.2 Requirement Text

The system must provide a feature for users to report posts they find inappropriate. When a post is reported, it must be flagged and added to a dedicated content moderation queue within the Admin Dashboard for review by an administrator.

#### 1.2.2.3 Validation Criteria

- Verify a user can find and use a 'Report' option on any post.
- Verify that after submission, the reported post appears in the Admin Dashboard's moderation queue.

#### 1.2.2.4 Implementation Implications

- The service must expose a gRPC method, `reportPost`, to receive reports from users via the API Gateway.
- Upon receiving a report, the service must publish a `ContentReported` event to the event bus for consumption by the Admin Service (REPO-SVC-ADMIN).

#### 1.2.2.5 Extraction Reasoning

This requirement mandates that the Posts service, as the owner of the 'Post' entity, must be the entry point for reporting actions against that entity. It then decouples the action from the moderation workflow via an event.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-024

#### 1.2.3.2 Requirement Text

The system shall allow users to edit or delete the posts they have created. Editing shall allow modification of the post's text content. Deleting a post must permanently remove it and its associated reactions and comments from the platform.

#### 1.2.3.3 Validation Criteria

- Verify a user can find and use an 'Edit' option on their own posts.
- Verify that after editing, the post content is updated.
- Verify a user can find and use a 'Delete' option on their own posts.
- Verify that after deleting, the post is no longer visible anywhere on the platform.
- Verify a user cannot edit or delete posts created by other users.

#### 1.2.3.4 Implementation Implications

- The service must implement gRPC methods updatePost and deletePost.
- A strict authorization check must be implemented in both methods to ensure the requesting user is the author of the post.
- The deletePost method should publish a PostDeleted event to notify other services (e.g., Engagement Service, Search Service) to perform cascading deletes or cleanup of associated data.

#### 1.2.3.5 Extraction Reasoning

This requirement defines the modification and deletion lifecycle of a post, which are core responsibilities of this service. The event-driven cleanup is a critical integration point.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-091

#### 1.2.4.2 Requirement Text

The system must enforce content visibility rules based on profile settings. If a user's profile is set to 'Private', their posts must only be visible to their first-degree connections. If a user's profile is set to 'Public', their posts must be visible to all logged-in users of the platform.

#### 1.2.4.3 Validation Criteria

- Verify that a non-connection cannot see posts from a user with a private profile.
- Verify that a first-degree connection can see posts from a user with a private profile.
- Verify that any user can see posts from a user with a public profile.

#### 1.2.4.4 Implementation Implications

- All data retrieval methods (e.g., getPostById) must accept the viewer's user ID as a parameter from the gRPC metadata.
- The service must make synchronous gRPC calls to the Profile Service (to get the author's visibility setting) and the Connections Service (to check if the viewer is connected to the author).
- The service must implement resilience patterns (e.g., circuit breakers, timeouts, caching) for these cross-service calls to meet performance NFRs.

#### 1.2.4.5 Extraction Reasoning

This requirement defines the access control and authorization logic that the Posts service is responsible for enforcing when serving post content, necessitating key synchronous integrations.

### 1.2.5.0 Requirement Id

#### 1.2.5.1 Requirement Id

REQ-1-072

#### 1.2.5.2 Requirement Text

All user-uploaded media files (e.g., profile pictures, post images) must be stored in an AWS S3 bucket. A Cloudflare CDN must be configured to serve these assets to end-users to ensure low-latency global delivery and to provide security services such as a Web Application Firewall (WAF) and DDoS protection.

#### 1.2.5.3 Validation Criteria

- Verify an S3 bucket is provisioned for media storage.
- Verify that uploaded files are successfully stored in the S3 bucket.
- Verify that media URLs served to the client point to the Cloudflare CDN domain, not directly to S3.

#### 1.2.5.4 Implementation Implications

- The service must integrate with the AWS S3 SDK, likely to generate pre-signed URLs for direct client uploads.
- The service will store the S3 object key in the database alongside the post data and construct the final CDN URL when serving data.
- The service must have a mechanism, possibly asynchronous, for deleting S3 objects when a post is deleted.

#### 1.2.5.5 Extraction Reasoning

This technical requirement directly governs how the Posts service must handle the storage of image media attached to posts.

## 1.3.0.0 Relevant Components

- {'component_name': 'Posts Service', 'component_specification': 'This component, implemented by the platform-service-posts repository, manages the full lifecycle of user-generated posts. Its responsibilities include creation, retrieval, update, and deletion of posts, handling associated media uploads, enforcing visibility rules, and publishing events for consumption by other services.', 'implementation_requirements': ['Must be developed as a NestJS application using TypeScript.', 'Must expose a gRPC interface for synchronous operations (CRUD).', 'Must publish domain events (e.g., PostCreated, PostDeleted, ContentReported) to an event bus for asynchronous workflows.', 'Must integrate with Prisma for PostgreSQL database access and the AWS SDK for S3 interaction.'], 'architectural_context': "Belongs to the Application Services Layer (L3). It encapsulates the business logic for the 'Post' domain, following a microservice architecture and Domain-Driven Design principles.", 'extraction_reasoning': "This is the primary architectural component that the repository is tasked with implementing. The repository's entire purpose is to realize this component's responsibilities."}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Application Services Layer (Backend Microservices)', 'layer_responsibilities': 'A collection of independent, business-capability-oriented microservices. Each service has its own codebase, manages its own data, and communicates with other services via gRPC and an event bus.', 'layer_constraints': ['Services must be stateless to allow for horizontal scaling.', 'Internal, synchronous communication must use gRPC.', 'Asynchronous communication must be handled via a message bus (e.g., SNS/SQS).'], 'implementation_patterns': ['Domain-Driven Design (DDD)', 'Command Query Responsibility Segregation (CQRS)', 'Event-Driven Architecture'], 'extraction_reasoning': 'The repository is explicitly defined as a microservice within this layer, and it must adhere to the technology stack (NestJS, TypeScript, gRPC) and communication patterns specified for this architectural tier.'}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

IProfileService

#### 1.5.1.2 Source Repository

REPO-SVC-PRF

#### 1.5.1.3 Method Contracts

- {'method_name': 'getProfileByUserId', 'method_signature': 'getProfileByUserId(request: { userId: string }): ProfileResponse', 'method_purpose': "To retrieve a user's profile data, including their chosen visibility setting (public/private).", 'integration_context': "Called synchronously by the Posts Service whenever a post is retrieved to determine the author's privacy preference, which is a required input for enforcing visibility rules as per REQ-1-091."}

#### 1.5.1.4 Integration Pattern

Synchronous Request/Response with Caching

#### 1.5.1.5 Communication Protocol

gRPC

#### 1.5.1.6 Extraction Reasoning

This dependency is essential for implementing the content visibility rules (REQ-1-091), as the Posts service does not own profile data and must fetch it from the authoritative source. Caching is required to meet performance NFRs.

### 1.5.2.0 Interface Name

#### 1.5.2.1 Interface Name

IConnectionsService

#### 1.5.2.2 Source Repository

REPO-SVC-CONN

#### 1.5.2.3 Method Contracts

- {'method_name': 'isConnected', 'method_signature': 'isConnected(request: { userIdA: string, userIdB: string }): IsConnectedResponse', 'method_purpose': 'To determine if a bidirectional, first-degree connection exists between two users.', 'integration_context': "Called synchronously when retrieving a post from a user with a 'private' profile to verify if the requesting user is a first-degree connection and is therefore authorized to view the content (REQ-1-091)."}

#### 1.5.2.4 Integration Pattern

Synchronous Request/Response with Caching

#### 1.5.2.5 Communication Protocol

gRPC

#### 1.5.2.6 Extraction Reasoning

This dependency is critical for enforcing the access control logic on private posts, as required by REQ-1-091. The Posts service relies on the Connections service as the source of truth for the social graph. Caching is required to meet performance NFRs.

### 1.5.3.0 Interface Name

#### 1.5.3.1 Interface Name

IFileStorageService

#### 1.5.3.2 Source Repository

REPO-INFRA (AWS S3)

#### 1.5.3.3 Method Contracts

##### 1.5.3.3.1 Method Name

###### 1.5.3.3.1.1 Method Name

generatePresignedUploadUrl

###### 1.5.3.3.1.2 Method Signature

generatePresignedUploadUrl(request: { userId: string, fileType: string, fileSize: number }): PresignedUrlResponse

###### 1.5.3.3.1.3 Method Purpose

To generate a secure, time-limited URL that allows a client to upload a media file directly to AWS S3.

###### 1.5.3.3.1.4 Integration Context

Called by the createPost and updatePost methods to facilitate media uploads without proxying file data through the service, as per REQ-1-019 and REQ-1-072.

##### 1.5.3.3.2.0 Method Name

###### 1.5.3.3.2.1 Method Name

deleteFile

###### 1.5.3.3.2.2 Method Signature

deleteFile(request: { objectKey: string }): Promise<void>

###### 1.5.3.3.2.3 Method Purpose

To delete a media file from AWS S3.

###### 1.5.3.3.2.4 Integration Context

Called asynchronously after a post is deleted to clean up associated media files.

#### 1.5.3.4.0.0 Integration Pattern

Cloud API (SDK)

#### 1.5.3.5.0.0 Communication Protocol

HTTPS

#### 1.5.3.6.0.0 Extraction Reasoning

This interface abstracts the direct interaction with AWS S3 for media management, a core responsibility of the service.

### 1.5.4.0.0.0 Interface Name

#### 1.5.4.1.0.0 Interface Name

IPlatformContracts

#### 1.5.4.2.0.0 Source Repository

REPO-LIB-CONTRACTS

#### 1.5.4.3.0.0 Method Contracts

- {'method_name': 'N/A (Contract Definitions)', 'method_signature': 'Provides .proto files for gRPC and TypeScript interfaces for events.', 'method_purpose': 'To ensure type-safe and consistent communication between this service and all its dependencies and consumers.', 'integration_context': 'Consumed at build-time to generate gRPC clients, server stubs, and event payload types.'}

#### 1.5.4.4.0.0 Integration Pattern

Build-Time Dependency (NPM Package)

#### 1.5.4.5.0.0 Communication Protocol

N/A

#### 1.5.4.6.0.0 Extraction Reasoning

As a microservice in a contract-first ecosystem, this service is fundamentally dependent on the shared contracts library for all its external communication definitions.

### 1.5.5.0.0.0 Interface Name

#### 1.5.5.1.0.0 Interface Name

ICoreLibrary

#### 1.5.5.2.0.0 Source Repository

REPO-LIB-CORE

#### 1.5.5.3.0.0 Method Contracts

- {'method_name': 'N/A (Shared Modules)', 'method_signature': 'Provides NestJS modules for Observability, Security (Guards), and common utilities.', 'method_purpose': 'To standardize cross-cutting concerns like logging, tracing, metrics, and authentication checks.', 'integration_context': 'Imported at application bootstrap to provide foundational utilities and middleware for the service.'}

#### 1.5.5.4.0.0 Integration Pattern

Build-Time Dependency (NPM Package)

#### 1.5.5.5.0.0 Communication Protocol

N/A

#### 1.5.5.6.0.0 Extraction Reasoning

As a standard backend service, it relies on the core library to satisfy non-functional requirements for observability, security, and code quality.

## 1.6.0.0.0.0 Exposed Interfaces

### 1.6.1.0.0.0 Interface Name

#### 1.6.1.1.0.0 Interface Name

IPostsService (gRPC)

#### 1.6.1.2.0.0 Consumer Repositories

- REPO-GW-API
- REPO-SVC-ADMIN

#### 1.6.1.3.0.0 Method Contracts

##### 1.6.1.3.1.0 Method Name

###### 1.6.1.3.1.1 Method Name

createPost

###### 1.6.1.3.1.2 Method Signature

createPost(CreatePostRequest) returns (PostResponse)

###### 1.6.1.3.1.3 Method Purpose

Creates a new post with associated text and media.

###### 1.6.1.3.1.4 Implementation Requirements

Handles validation, media upload orchestration, database persistence, and triggers the PostCreated event.

##### 1.6.1.3.2.0 Method Name

###### 1.6.1.3.2.1 Method Name

getPostById

###### 1.6.1.3.2.2 Method Signature

getPostById(PostIdRequest, viewerId) returns (PostResponse)

###### 1.6.1.3.2.3 Method Purpose

Retrieves a single post by its ID, enforcing visibility rules.

###### 1.6.1.3.2.4 Implementation Requirements

Must implement the authorization logic defined in REQ-1-091 by calling dependent services based on the viewerId passed in gRPC metadata.

##### 1.6.1.3.3.0 Method Name

###### 1.6.1.3.3.1 Method Name

updatePost

###### 1.6.1.3.3.2 Method Signature

updatePost(UpdatePostRequest) returns (PostResponse)

###### 1.6.1.3.3.3 Method Purpose

Updates the content of an existing post.

###### 1.6.1.3.3.4 Implementation Requirements

Must perform a strict authorization check to ensure the caller is the post's author.

##### 1.6.1.3.4.0 Method Name

###### 1.6.1.3.4.1 Method Name

deletePost

###### 1.6.1.3.4.2 Method Signature

deletePost(PostIdRequest) returns (EmptyResponse)

###### 1.6.1.3.4.3 Method Purpose

Permanently deletes a post.

###### 1.6.1.3.4.4 Implementation Requirements

Must perform a strict authorization check and publish a PostDeleted event for downstream cleanup.

##### 1.6.1.3.5.0 Method Name

###### 1.6.1.3.5.1 Method Name

deletePostAsAdmin

###### 1.6.1.3.5.2 Method Signature

deletePostAsAdmin(AdminDeletePostRequest) returns (EmptyResponse)

###### 1.6.1.3.5.3 Method Purpose

Allows an administrator to permanently delete a post.

###### 1.6.1.3.5.4 Implementation Requirements

Bypasses author ownership check but requires an 'Administrator' role check. Publishes a PostDeleted event.

##### 1.6.1.3.6.0 Method Name

###### 1.6.1.3.6.1 Method Name

reportPost

###### 1.6.1.3.6.2 Method Signature

reportPost(ReportPostRequest) returns (EmptyResponse)

###### 1.6.1.3.6.3 Method Purpose

Allows a user to report a post as inappropriate.

###### 1.6.1.3.6.4 Implementation Requirements

Publishes a ContentReported event for the moderation queue.

#### 1.6.1.4.0.0 Service Level Requirements

- All methods must enforce authentication and authorization.
- P95 latency for all methods must be < 200ms.

#### 1.6.1.5.0.0 Implementation Constraints

*No items available*

#### 1.6.1.6.0.0 Extraction Reasoning

This service exposes the primary gRPC interface for managing the post lifecycle, consumed by the API Gateway for user-facing actions and by the Admin Service for moderation. The contracts have been expanded to include all necessary methods.

### 1.6.2.0.0.0 Interface Name

#### 1.6.2.1.0.0 Interface Name

Post Events (Event Bus)

#### 1.6.2.2.0.0 Consumer Repositories

- REPO-SVC-FEED
- REPO-SVC-SEARCH
- REPO-SVC-ENGAGE
- REPO-SVC-ADMIN

#### 1.6.2.3.0.0 Method Contracts

##### 1.6.2.3.1.0 Method Name

###### 1.6.2.3.1.1 Method Name

PostCreated

###### 1.6.2.3.1.2 Method Signature

EventPayload: { postId: string, authorId: string, createdAt: string }

###### 1.6.2.3.1.3 Method Purpose

Notifies the system that a new post has been created, primarily to trigger the news feed fan-out process.

###### 1.6.2.3.1.4 Implementation Requirements

Published to a designated SNS topic upon successful post creation.

##### 1.6.2.3.2.0 Method Name

###### 1.6.2.3.2.1 Method Name

PostDeleted

###### 1.6.2.3.2.2 Method Signature

EventPayload: { postId: string, authorId: string }

###### 1.6.2.3.2.3 Method Purpose

Notifies downstream services to perform cleanup related to a deleted post (e.g., remove comments, de-index from search).

###### 1.6.2.3.2.4 Implementation Requirements

Published to an SNS topic upon successful post deletion.

##### 1.6.2.3.3.0 Method Name

###### 1.6.2.3.3.1 Method Name

ContentReported

###### 1.6.2.3.3.2 Method Signature

EventPayload: { contentId: string, contentType: 'POST', reporterId: string, reason: string }

###### 1.6.2.3.3.3 Method Purpose

Notifies the Admin Service that a post has been reported, adding it to the moderation queue.

###### 1.6.2.3.3.4 Implementation Requirements

Published to an SNS topic upon a user reporting a post.

#### 1.6.2.4.0.0 Service Level Requirements

- Events must be published reliably, ideally as part of the same transaction as the database write (using a Transactional Outbox pattern).

#### 1.6.2.5.0.0 Implementation Constraints

- Event payloads must be versioned and adhere to the schemas defined in REPO-LIB-CONTRACTS.

#### 1.6.2.6.0.0 Extraction Reasoning

This asynchronous interface is critical for decoupling the Posts service from other system components that need to react to content lifecycle events, ensuring scalability and resilience.

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The service must be built using the NestJS framework on Node.js, written in TypeScript.

### 1.7.2.0.0.0 Integration Technologies

- gRPC: For all synchronous, internal service-to-service communication.
- Prisma: As the ORM for interacting with the PostgreSQL database.
- AWS SDK for S3: For managing image file storage via pre-signed URLs.
- AWS SDK for SNS/SQS: For publishing and consuming domain events.

### 1.7.3.0.0.0 Performance Constraints

Database queries for post retrieval must be optimized with indexes. The synchronous gRPC calls for visibility checks are a performance-critical path and must be cached using Redis with short TTLs to meet the P95 latency NFR of < 200ms.

### 1.7.4.0.0.0 Security Requirements

Strict authorization must be enforced on all write operations (update, delete) to ensure a user can only modify their own posts. A separate, role-based authorization path must exist for administrative actions. All user-generated content must be treated as untrusted and sanitized to prevent XSS.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | The integration design now covers all identified i... |
| Cross Reference Validation | The repository's dependencies and exposed interfac... |
| Implementation Readiness Assessment | The service is ready for implementation. The API c... |
| Quality Assurance Confirmation | The analysis has systematically identified and fil... |

