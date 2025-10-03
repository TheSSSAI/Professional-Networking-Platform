# 1 Id

REPO-SVC-FEED

# 2 Name

platform-service-feed

# 3 Description

This microservice has a single, critical responsibility: generating and serving personalized news feeds for users with very low latency. It implements the 'fan-out-on-write' architecture specified in REQ-1-020. Decomposed from the 'platform-api' monorepo, this is a read-optimized service that acts as a consumer of events from other parts of the system. Its primary workflow is to listen for 'PostCreated' events, retrieve the list of the author's connections, and then inject the new post's ID into the feed list of each connected user, which is stored in Redis. When a user requests their feed, this service queries Redis to return a list of post IDs instantly, which the client then uses to fetch the full post data. This approach prioritizes fast read performance for a scalable user base.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Services.Feed

# 6 Output Path

services/feed

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, TypeScript, gRPC, Redis

# 10 Thirdparty Libraries

- @nestjs/microservices
- redis

# 11 Layer Ids

- application-service-layer

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-CORE
- REPO-SVC-CONN

# 13 Requirements

- {'requirementId': 'REQ-1-020'}

# 14 Generate Tests

✅ Yes

# 15 Generate Documentation

✅ Yes

# 16 Architecture Style

Microservice (CQRS Read-Side)

# 17 Architecture Map

- feed-service-007

# 18 Components Map

- feed-service-006

# 19 Requirements Map

- REQ-1-020

# 20 Decomposition Rationale

## 20.1 Operation Type

NEW_DECOMPOSED

## 20.2 Source Repository

REPO-02-API

## 20.3 Decomposition Reasoning

Feed generation is a computationally intensive, read-heavy, and architecturally distinct problem. Isolating it allows for a specialized technology choice (heavy reliance on Redis) and an asynchronous, event-driven design that would needlessly complicate the Posts service. This separation is a classic application of the CQRS pattern for performance and scalability.

## 20.4 Extracted Responsibilities

- Consuming 'PostCreated' events
- Performing the fan-out write operation to user feed caches
- Serving lists of post IDs for a user's feed

## 20.5 Reusability Scope

- The fan-out pattern itself is reusable for other notification-style systems.

## 20.6 Development Benefits

- Allows a team to focus exclusively on the performance and relevance of the news feed.
- Decouples the act of posting from the complexity of feed delivery.

# 21.0 Dependency Contracts

## 21.1 Repo-Svc-Posts

### 21.1.1 Required Interfaces

*No items available*

### 21.1.2 Integration Pattern

Consumes 'PostCreated' events.

### 21.1.3 Communication Protocol

Event Bus (SNS/SQS)

## 21.2.0 Repo-Svc-Conn

### 21.2.1 Required Interfaces

- {'interface': 'ConnectionsService (gRPC)', 'methods': ['getConnections(UserIdRequest) : ConnectionListResponse'], 'events': [], 'properties': []}

### 21.2.2 Integration Pattern

Synchronously calls to get the list of connections needed for the fan-out.

### 21.2.3 Communication Protocol

gRPC

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'FeedService (gRPC)', 'methods': ['getFeed(GetFeedRequest) : FeedResponse'], 'events': [], 'properties': [], 'consumers': ['REPO-GW-API']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Primary consumer of 'PostCreated' events. It may a... |
| Data Flow | Reads from the Connections service via gRPC. Write... |
| Error Handling | Uses a Dead Letter Queue (DLQ) for failed 'PostCre... |
| Async Patterns | Entirely event-driven and asynchronous for the wri... |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Implement the event consumer as a background worke... |
| Performance Considerations | The entire model depends on the high performance o... |
| Security Considerations | Authorization checks must ensure a user can only r... |
| Testing Approach | Integration tests must validate the end-to-end flo... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- The fan-out-on-write logic.
- Storing user feed lists (of post IDs) in Redis.
- An endpoint to retrieve a paginated list of post IDs for a user.

## 25.2.0 Must Not Implement

- Storing the actual post content.
- Ranking or personalizing the feed with an algorithm (in this phase).
- Handling comments, reactions, or any other user interaction.

## 25.3.0 Extension Points

- Implementing a ranking algorithm to sort the feed instead of being purely chronological.
- Injecting other content types into the feed (e.g., ads, articles).

## 25.4.0 Validation Rules

- Each feed list in Redis should be capped at a maximum length (e.g., 500-1000 IDs) to manage memory usage.

