# 1 Id

REPO-SVC-ENGAGE

# 2 Name

platform-service-engagement

# 3 Description

This microservice is dedicated to managing high-volume, lightweight user interactions with content, specifically reactions (likes) and comments as per SRS section 1.4, and skill endorsements from section 1.2. Its purpose is to offload these frequent, high-throughput write operations from the main Posts and Profile services. Decomposed from the 'platform-api' monorepo, it owns the 'PostReaction', 'Comment', and 'SkillEndorsement' tables. It is designed to be highly scalable and resilient. It publishes events like 'PostReacted' or 'CommentAdded' which the Notifications service consumes to inform users of engagement with their content. This separation allows the core content services to remain stable while the engagement system can be scaled independently to handle potentially viral activity.

# 4 Type

🔹 Business Logic

# 5 Namespace

Platform.Services.Engagement

# 6 Output Path

services/engagement

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, TypeScript, gRPC, Prisma, PostgreSQL

# 10 Thirdparty Libraries

- @nestjs/microservices
- prisma

# 11 Layer Ids

- application-service-layer

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-CORE

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-011

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-021

## 13.3.0 Requirement Id

### 13.3.1 Requirement Id

REQ-1-022

## 13.4.0 Requirement Id

### 13.4.1 Requirement Id

REQ-1-025

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservice

# 17.0.0 Architecture Map

- engagement-service-006

# 18.0.0 Components Map

- engagement-service-005

# 19.0.0 Requirements Map

- REQ-1-011

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-02-API

## 20.3.0 Decomposition Reasoning

User engagement actions (likes, comments) can generate a massive volume of writes, especially on popular content. Isolating this functionality into a separate service prevents this high-frequency traffic from impacting the performance and stability of more critical services like Posts or Profiles. It follows the CQRS principle by separating the write-heavy engagement commands.

## 20.4.0 Extracted Responsibilities

- Storing and managing reactions to posts.
- Storing and managing comments on posts.
- Storing and managing endorsements of skills.
- Publishing engagement events for notifications.

## 20.5.0 Reusability Scope

- The pattern of handling lightweight interactions can be extended to other features like voting, polls, etc.

## 20.6.0 Development Benefits

- Allows independent scaling of write-intensive operations.
- Simplifies the logic in the Posts and Profile services.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Svc-Notify

### 21.1.1 Required Interfaces

*No items available*

### 21.1.2 Integration Pattern

Publishes events for new comments, likes, and endorsements.

### 21.1.3 Communication Protocol

Event Bus (SNS/SQS)

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'EngagementService (gRPC)', 'methods': ['addReaction(AddReactionRequest) : StatusResponse', 'addComment(AddCommentRequest) : CommentResponse', 'addSkillEndorsement(AddEndorsementRequest) : StatusResponse'], 'events': ['PostReacted(postId, userId)', 'CommentAdded(commentId, postId, authorId)'], 'properties': [], 'consumers': ['REPO-GW-API']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Primary producer of engagement events for the Noti... |
| Data Flow | Owns the Comment, PostReaction, and SkillEndorseme... |
| Error Handling | Returns ALREADY_EXISTS if a user tries to like a p... |
| Async Patterns | Asynchronous event publishing. |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Service methods should be idempotent where possibl... |
| Performance Considerations | Database tables for reactions and comments can gro... |
| Security Considerations | Validate that the user has permission to comment o... |
| Testing Approach | Load testing is critical for this service to ensur... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- Liking/reacting to posts.
- Commenting on posts (creating, editing, deleting own comments).
- Endorsing skills on a user's profile.

## 25.2.0 Must Not Implement

- Storing the posts themselves.
- Generating notifications (it only publishes the events).
- Storing user profile or skill data.

## 25.3.0 Extension Points

- Adding different types of reactions (e.g., celebrate, support).
- Implementing nested comments (replies).

## 25.4.0 Validation Rules

- Max character count for comments (1500).

