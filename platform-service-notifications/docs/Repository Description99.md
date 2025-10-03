# 1 Id

REPO-SVC-NOTIFY

# 2 Name

platform-service-notifications

# 3 Description

This microservice is responsible for informing users of relevant activity on the platform, as defined in SRS section 1.7. It is an event-driven service that consumes events from various other microservices (e.g., 'ConnectionAccepted', 'PostReacted', 'CommentAdded'). Upon receiving an event, it creates a notification, persists it to the database, and delivers it to the user in real-time via a WebSocket connection. It also handles notification aggregation to avoid overwhelming users (e.g., 'User A and 5 others liked your post'). Decomposed from the 'platform-api' monorepo, this service centralizes all notification logic, making it easy to add new notification types or delivery channels in the future.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Services.Notifications

# 6 Output Path

services/notifications

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, TypeScript, gRPC, WebSockets (Socket.IO), Prisma, PostgreSQL

# 10 Thirdparty Libraries

- @nestjs/microservices
- @nestjs/websockets
- prisma

# 11 Layer Ids

- application-service-layer

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-CORE

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-036

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-037

## 13.3.0 Requirement Id

### 13.3.1 Requirement Id

REQ-1-038

## 13.4.0 Requirement Id

### 13.4.1 Requirement Id

REQ-1-039

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservice

# 17.0.0 Architecture Map

- notifications-service-010

# 18.0.0 Components Map

- notifications-service-009

# 19.0.0 Requirements Map

- REQ-1-036

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-02-API

## 20.3.0 Decomposition Reasoning

Notification generation is a classic cross-cutting concern that is triggered by many different business domains. Centralizing this logic into a single consumer service prevents scattering notification code across the entire system. This improves maintainability, consistency, and makes it simple to manage user notification preferences or add new delivery channels (e.g., email, push) later.

## 20.4.0 Extracted Responsibilities

- Consuming business domain events
- Creating and persisting notifications
- Delivering real-time notifications via WebSockets
- Managing notification history and read status

## 20.5.0 Reusability Scope

- This service is the single entry point for any part of the system that needs to generate a user notification.

## 20.6.0 Development Benefits

- Decouples business logic services from the details of notification delivery.
- Provides a single place to manage notification templates, batching logic, and user preferences.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Svc-Conn

### 21.1.1 Required Interfaces

*No items available*

### 21.1.2 Integration Pattern

Consumes 'ConnectionAccepted' and 'ConnectionRequestSent' events.

### 21.1.3 Communication Protocol

Event Bus (SNS/SQS)

## 21.2.0 Repo-Svc-Engage

### 21.2.1 Required Interfaces

*No items available*

### 21.2.2 Integration Pattern

Consumes 'PostReacted' and 'CommentAdded' events.

### 21.2.3 Communication Protocol

Event Bus (SNS/SQS)

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

### 22.1.1 Interface

#### 22.1.1.1 Interface

Notifications (WebSocket API)

#### 22.1.1.2 Methods

*No items available*

#### 22.1.1.3 Events

- on('newNotification', Notification)

#### 22.1.1.4 Properties

*No items available*

#### 22.1.1.5 Consumers

- REPO-APP-WEB

### 22.1.2.0 Interface

#### 22.1.2.1 Interface

NotificationsService (gRPC)

#### 22.1.2.2 Methods

- getNotifications(GetNotificationsRequest) : NotificationListResponse

#### 22.1.2.3 Events

*No items available*

#### 22.1.2.4 Properties

*No items available*

#### 22.1.2.5 Consumers

- REPO-GW-API

# 23.0.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Acts as a consumer for a wide range of domain even... |
| Data Flow | Owns the 'Notification' table. Pushes data to clie... |
| Error Handling | Uses a DLQ for failed incoming events. Handles Web... |
| Async Patterns | Fully event-driven and asynchronous. |

# 24.0.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Use NestJS event emitters or a similar pattern to ... |
| Performance Considerations | Batching logic (REQ-1-037) is important to prevent... |
| Security Considerations | Ensure that notifications containing sensitive inf... |
| Testing Approach | Test that the service correctly consumes various e... |

# 25.0.0.0 Scope Boundaries

## 25.1.0.0 Must Implement

- Notifications for new connection requests, acceptances, likes, and comments.
- A notification center to view history.
- Real-time delivery and unread indicators.
- Batching similar notifications.

## 25.2.0.0 Must Not Implement

- The business logic that triggers the notification (e.g., it doesn't handle the 'like' itself).
- Email delivery (this is handled by a separate, dedicated email service).

## 25.3.0.0 Extension Points

- Adding user preferences to enable/disable specific notification types (REQ-1-039).
- Adding new delivery channels like email or mobile push.

## 25.4.0.0 Validation Rules

*No items available*

