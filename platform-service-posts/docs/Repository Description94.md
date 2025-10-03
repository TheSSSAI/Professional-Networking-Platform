# 1 Id

REPO-SVC-POSTS

# 2 Name

platform-service-posts

# 3 Description

This microservice is responsible for the lifecycle of primary user-generated content: posts, as described in SRS section 1.4. It handles the creation, editing, deletion, and retrieval of posts, including their text content, attached media (images), and generated link previews. Decomposed from the 'platform-api' monorepo, it owns the 'Post' and 'Media' related tables. A key responsibility is publishing a 'PostCreated' event, which is the cornerstone of the asynchronous news feed generation process. This service provides the foundational content layer upon which other features, like comments and reactions, are built. It collaborates with other services to fetch author details or check connection status for visibility rules.

# 4 Type

🔹 Business Logic

# 5 Namespace

Platform.Services.Posts

# 6 Output Path

services/posts

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, TypeScript, gRPC, Prisma, PostgreSQL, AWS S3

# 10 Thirdparty Libraries

- @nestjs/microservices
- prisma
- aws-sdk

# 11 Layer Ids

- application-service-layer

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-CORE
- REPO-SVC-PRF
- REPO-SVC-CONN

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-019

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-024

## 13.3.0 Requirement Id

### 13.3.1 Requirement Id

REQ-1-091

## 13.4.0 Requirement Id

### 13.4.1 Requirement Id

REQ-1-072

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservice

# 17.0.0 Architecture Map

- posts-service-005

# 18.0.0 Components Map

- posts-service-004

# 19.0.0 Requirements Map

- REQ-1-019

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-02-API

## 20.3.0 Decomposition Reasoning

Content management is a distinct domain with its own scaling and storage requirements (e.g., S3 for media). Separating it allows the platform to optimize for high-throughput post creation and retrieval, and decouples the core content logic from the social graph and user identity.

## 20.4.0 Extracted Responsibilities

- CRUD operations for posts
- Handling media uploads associated with posts
- Publishing 'PostCreated' event for fan-out
- Enforcing content visibility rules

## 20.5.0 Reusability Scope

- This service provides the fundamental content object that other services can interact with (e.g., reacting, commenting, reporting).

## 20.6.0 Development Benefits

- Enables a team to focus on content creation features and performance.
- Isolates dependencies on object storage (S3) to a single service.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Svc-Prf

### 21.1.1 Required Interfaces

- {'interface': 'ProfileService (gRPC)', 'methods': ['getProfileByUserId(UserIdRequest) : ProfileResponse'], 'events': [], 'properties': []}

### 21.1.2 Integration Pattern

Fetches author details (name, picture) to enrich post data, and checks profile visibility.

### 21.1.3 Communication Protocol

gRPC

## 21.2.0 Repo-Svc-Conn

### 21.2.1 Required Interfaces

- {'interface': 'ConnectionsService (gRPC)', 'methods': ['isConnected(IsConnectedRequest) : IsConnectedResponse'], 'events': [], 'properties': []}

### 21.2.2 Integration Pattern

Checks if the viewing user is connected to the post author to enforce visibility rules.

### 21.2.3 Communication Protocol

gRPC

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'PostsService (gRPC)', 'methods': ['createPost(CreatePostRequest) : PostResponse', 'getPostById(PostIdRequest) : PostResponse'], 'events': ['PostCreated(postId, authorId, createdAt)'], 'properties': [], 'consumers': ['REPO-GW-API', 'REPO-SVC-FEED']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Publishes 'PostCreated' event to SNS, which is the... |
| Data Flow | Owns the 'Post' table. Interacts with S3 for stori... |
| Error Handling | Returns PERMISSION_DENIED if a user tries to edit ... |
| Async Patterns | Handles file uploads asynchronously. |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Implement logic to handle multipart form data for ... |
| Performance Considerations | Optimize database queries for fetching posts. Cons... |
| Security Considerations | Ensure that user-uploaded media is scanned for mal... |
| Testing Approach | Test the full post creation lifecycle, including m... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- Post creation with text, images, and links.
- Editing and deleting of a user's own posts.
- Publishing the 'PostCreated' event with the required payload.

## 25.2.0 Must Not Implement

- Storing comments or reactions (this is handled by the Engagement service).
- Generating the news feed.
- User profile management.

## 25.3.0 Extension Points

- Support for new media types (e.g., videos, documents).
- Adding features like polls or articles.

## 25.4.0 Validation Rules

- Max character count for post text (3000).
- Max number of images per post (4) and max file size (5MB).

