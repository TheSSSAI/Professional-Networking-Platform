# 1 Id

REPO-SVC-MSG

# 2 Name

platform-service-messaging

# 3 Description

This microservice facilitates all real-time, private communication between connected users, as specified in SRS section 1.5. Its primary responsibility is to manage persistent WebSocket connections for clients, handle the sending and receiving of one-on-one text messages, and persist the conversation history. Decomposed from the 'platform-api' monorepo, this is a stateful service that maintains active connections. It provides real-time feedback to users, such as 'delivered' and 'read' statuses, and 'typing' indicators. It owns the 'Conversation' and 'Message' tables. Access control is critical, and it integrates with the Connections service to ensure messaging is restricted to first-degree connections.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Services.Messaging

# 6 Output Path

services/messaging

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, TypeScript, WebSockets (Socket.IO), Prisma, PostgreSQL

# 10 Thirdparty Libraries

- @nestjs/websockets
- socket.io
- prisma

# 11 Layer Ids

- application-service-layer

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-CORE
- REPO-SVC-CONN

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-026

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-027

## 13.3.0 Requirement Id

### 13.3.1 Requirement Id

REQ-1-028

## 13.4.0 Requirement Id

### 13.4.1 Requirement Id

REQ-1-029

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservice (Stateful)

# 17.0.0 Architecture Map

- messaging-service-008

# 18.0.0 Components Map

- messaging-service-007

# 19.0.0 Requirements Map

- REQ-1-026

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-02-API

## 20.3.0 Decomposition Reasoning

Real-time messaging is a stateful and network-intensive concern, fundamentally different from the stateless, request-response nature of other services. Isolating it allows for specialized infrastructure and scaling strategies (e.g., sticky sessions, connection management) and prevents its resource requirements (CPU, memory for connections) from impacting the rest of the backend.

## 20.4.0 Extracted Responsibilities

- Managing WebSocket lifecycle and connections
- Real-time message transport
- Persisting conversation history
- Enforcing messaging access control (1st-degree connections only)

## 20.5.0 Reusability Scope

- The real-time infrastructure could be a foundation for other collaborative features.

## 20.6.0 Development Benefits

- Allows a team to specialize in real-time communication protocols and challenges.
- Simplifies the architecture of stateless services by offloading state management.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Svc-Conn

### 21.1.1 Required Interfaces

- {'interface': 'ConnectionsService (gRPC)', 'methods': ['isConnected(IsConnectedRequest) : IsConnectedResponse'], 'events': [], 'properties': []}

### 21.1.2 Integration Pattern

Calls this service to authorize if two users are allowed to message each other.

### 21.1.3 Communication Protocol

gRPC

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

### 22.1.1 Interface

#### 22.1.1.1 Interface

Messaging (WebSocket API)

#### 22.1.1.2 Methods

- emit('sendMessage', MessagePayload)
- emit('markAsRead', ReadPayload)

#### 22.1.1.3 Events

- on('newMessage', Message)
- on('messageRead', ReadConfirmation)

#### 22.1.1.4 Properties

*No items available*

#### 22.1.1.5 Consumers

- REPO-APP-WEB

### 22.1.2.0 Interface

#### 22.1.2.1 Interface

MessagingService (gRPC)

#### 22.1.2.2 Methods

- getMessageHistory(HistoryRequest) : HistoryResponse

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
| Event Communication | Internal event handling for WebSocket connection/d... |
| Data Flow | Owns the 'Conversation' and 'Message' tables. Mana... |
| Error Handling | Emits error events back to the client over WebSock... |
| Async Patterns | Asynchronous database writes for messages. |

# 24.0.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Use NestJS WebSocket gateways with the Socket.IO a... |
| Performance Considerations | The service needs to handle a large number of conc... |
| Security Considerations | WebSocket connections must be authenticated (e.g.,... |
| Testing Approach | End-to-end testing with a WebSocket client is cruc... |

# 25.0.0.0 Scope Boundaries

## 25.1.0.0 Must Implement

- One-on-one text messaging.
- Message persistence.
- Real-time delivery, read status, and typing indicators.
- Restriction of messaging to 1st-degree connections.

## 25.2.0.0 Must Not Implement

- Group messaging.
- Media attachments in messages (in this phase).
- Video/audio calls.

## 25.3.0.0 Extension Points

- Adding support for sending images or files.
- Implementing group chat functionality.

## 25.4.0.0 Validation Rules

*No items available*

