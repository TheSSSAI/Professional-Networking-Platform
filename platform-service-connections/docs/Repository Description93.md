# 1 Id

REPO-SVC-CONN

# 2 Name

platform-service-connections

# 3 Description

This microservice is exclusively responsible for managing the professional network graph, as defined in SRS section 1.3. Its core functions include creating and managing connection requests (sending, accepting, declining), viewing a user's network of first-degree connections, and removing existing connections. Decomposed from the 'platform-api' monorepo, this service owns the 'Connection' table, which represents the relationships between users. It provides a gRPC interface for other services to query the relationship status between two users (e.g., are they connected?). Its focused nature allows for specialized optimizations, such as caching a user's connection list in Redis for fast access control checks throughout the platform.

# 4 Type

🔹 Business Logic

# 5 Namespace

Platform.Services.Connections

# 6 Output Path

services/connections

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, TypeScript, gRPC, Prisma, PostgreSQL, Redis

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

REQ-1-015

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-016

## 13.3.0 Requirement Id

### 13.3.1 Requirement Id

REQ-1-017

## 13.4.0 Requirement Id

### 13.4.1 Requirement Id

REQ-1-018

## 13.5.0 Requirement Id

### 13.5.1 Requirement Id

REQ-1-090

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservice

# 17.0.0 Architecture Map

- connections-service-004

# 18.0.0 Components Map

- connections-service-003

# 19.0.0 Requirements Map

- REQ-1-015

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-02-API

## 20.3.0 Decomposition Reasoning

The social graph is a distinct and fundamental domain. Isolating it allows for specialized data modeling and performance optimizations (e.g., graph databases in the future). It decouples the core user and content domains from the relationship logic, simplifying the overall architecture.

## 20.4.0 Extracted Responsibilities

- Managing the lifecycle of connection requests
- Persisting the connection graph
- Providing an authoritative check for connection status between users

## 20.5.0 Reusability Scope

- The 'IsConnected' check is a highly reusable function required by many other services for authorization.

## 20.6.0 Development Benefits

- Allows a team to focus on network growth features and graph-related performance.
- Clear ownership of the data model for user relationships.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Svc-Notify

### 21.1.1 Required Interfaces

*No items available*

### 21.1.2 Integration Pattern

Publishes 'ConnectionRequestSent' and 'ConnectionAccepted' events.

### 21.1.3 Communication Protocol

Event Bus (SNS/SQS)

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'ConnectionsService (gRPC)', 'methods': ['sendRequest(ConnectionRequest) : StatusResponse', 'acceptRequest(ConnectionRequest) : StatusResponse', 'isConnected(IsConnectedRequest) : IsConnectedResponse'], 'events': ['ConnectionAccepted(userAId, userBId)'], 'properties': [], 'consumers': ['REPO-GW-API', 'REPO-SVC-POSTS', 'REPO-SVC-MSG']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Publishes events when connection statuses change, ... |
| Data Flow | Owns and is the single writer for the 'Connection'... |
| Error Handling | Returns FAILED_PRECONDITION gRPC error if a user t... |
| Async Patterns | Asynchronous event publishing. |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Implement business rules, such as preventing dupli... |
| Performance Considerations | Cache users' first-degree connection lists (e.g., ... |
| Security Considerations | Authorization checks must ensure a user can only a... |
| Testing Approach | Focus on testing the state machine of a connection... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- Sending, accepting, declining, and viewing connection requests.
- Removing a connection, which must be a reciprocal action.
- Logic to prevent duplicate pending requests.

## 25.2.0 Must Not Implement

- User profile data.
- Storing messages or content exchanged between connections.
- Connection recommendations or 'people you may know' logic.

## 25.3.0 Extension Points

- Adding support for different connection degrees (2nd, 3rd).
- Implementing a feature to 'follow' a user instead of connecting.

## 25.4.0 Validation Rules

- Character limit on the personalized message (REQ-1-015).

