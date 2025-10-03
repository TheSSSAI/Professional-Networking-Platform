# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-service-messaging |
| Extraction Timestamp | 2024-05-22T11:00:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 100% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-026

#### 1.2.1.2 Requirement Text

The system shall provide a direct messaging feature that allows users to engage in private, one-on-one, text-based conversations with their first-degree connections.

#### 1.2.1.3 Validation Criteria

- Verify a user can initiate a new conversation with a connection.
- Verify a user can send and receive text messages within a conversation.
- Verify a user can view a list of their ongoing conversations.

#### 1.2.1.4 Implementation Implications

- The service must manage the lifecycle of conversations between two participants.
- It must handle the real-time transport of text messages between connected clients.
- It needs to expose an interface for clients to fetch their list of active conversations.

#### 1.2.1.5 Extraction Reasoning

This is the primary functional requirement that defines the core purpose of the messaging service: enabling one-on-one text conversations.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-027

#### 1.2.2.2 Requirement Text

The messaging system must deliver messages in near real-time using WebSockets. The user interface must provide visual indicators for message status, including 'sending', 'delivered', and 'read'. It must also display a 'typing' indicator to a user when the other participant in the conversation is actively composing a message.

#### 1.2.2.3 Validation Criteria

- Verify that when a user sends a message, it appears in the recipient's chat window almost instantly.
- Verify a 'delivered' status is shown when the message reaches the recipient's device.
- Verify a 'read' status is shown when the recipient has viewed the message.
- Verify that a 'typing...' indicator appears for User A when User B is typing in their conversation window.

#### 1.2.2.4 Implementation Implications

- The service must be stateful to manage persistent WebSocket connections using a library like Socket.IO.
- It must implement the business logic for tracking and broadcasting message status events ('delivered', 'read') to relevant clients.
- It must handle transient 'typing' events, including a timeout mechanism to automatically clear the indicator.

#### 1.2.2.5 Extraction Reasoning

This requirement dictates the key technical implementation (WebSockets) and user-facing real-time features that this service is solely responsible for.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-028

#### 1.2.3.2 Requirement Text

The system must persist all messages exchanged between two users. When a user opens a conversation, the full historical log of messages for that conversation must be displayed, allowing the user to scroll back through previous messages.

#### 1.2.3.3 Validation Criteria

- Verify that after closing and reopening a conversation, all previous messages are present.
- Verify the user can scroll up to load and view older messages in a long conversation.

#### 1.2.3.4 Implementation Implications

- The service must own and manage the 'Conversation' and 'Message' database tables.
- It must expose a paginated API endpoint (gRPC) to fetch historical messages for a given conversation.
- Database queries for message history must be optimized for performance, using indexes on conversation ID and timestamps.

#### 1.2.3.5 Extraction Reasoning

This requirement defines the data persistence and retrieval responsibilities of the service, confirming its role as the owner of messaging data.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-029

#### 1.2.4.2 Requirement Text

The system must enforce access control on the messaging feature, restricting its use to only users who are first-degree connections. A user must not be able to initiate a conversation with or send a message to another user unless they are mutually connected.

#### 1.2.4.3 Validation Criteria

- Verify a user can initiate a message with a first-degree connection.
- Verify a user cannot initiate a message with a user who is not a first-degree connection.

#### 1.2.4.4 Implementation Implications

- The service must integrate with the Connections Service before processing any message-sending or conversation-creation request.
- This integration will be a synchronous, blocking call (gRPC) to verify the connection status between the sender and receiver.
- The service must emit an authorization error back to the client if the connection check fails.

#### 1.2.4.5 Extraction Reasoning

This is a critical security and business rule requirement that this service must enforce, defining its dependency on the Connections service.

## 1.3.0.0 Relevant Components

- {'component_name': 'Messaging Service', 'component_specification': "A stateful microservice responsible for managing all real-time, one-on-one user communication. Its duties include managing persistent WebSocket connections, transporting messages, persisting conversation history, and broadcasting real-time feedback events like 'typing', 'delivered', and 'read' statuses. It enforces the business rule that only first-degree connections can communicate.", 'implementation_requirements': ['Must be implemented using NestJS and TypeScript.', "Must use the Socket.IO library with a Redis adapter ('socket.io-redis-adapter') for scalable WebSocket communication.", 'Must use Prisma as the ORM to interact with the PostgreSQL database.', "Must own the 'Conversation' and 'Message' database tables.", 'Must implement a gRPC client to communicate with the Connections Service for authorization.'], 'architectural_context': 'This component resides in the Application Services Layer. It is unique in this layer as a stateful service, designed specifically to handle a large number of concurrent, long-lived client connections, made scalable via a Redis backplane.', 'extraction_reasoning': 'This component directly maps to the platform-service-messaging repository, encapsulating all the requirements and responsibilities defined for it.'}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Application Services Layer', 'layer_responsibilities': 'Implements core business logic within distinct, independently deployable microservices. Services in this layer manage their own data, expose APIs (typically gRPC for internal communication), and communicate asynchronously via an event bus.', 'layer_constraints': ['Services should be designed around business capabilities (DDD).', 'Services should be stateless where possible; stateful services like this one require special consideration for scaling.', 'Inter-service communication must use gRPC.'], 'implementation_patterns': ['Microservices', 'Domain-Driven Design (DDD)', 'Command Query Responsibility Segregation (CQRS) for read/write separation (e.g., fetching history vs. sending messages).'], 'extraction_reasoning': "The repository is explicitly mapped to the application-service-layer, and its characteristics (business-capability focus, gRPC communication, data ownership) align perfectly with this layer's definition."}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

IConnectionsService

#### 1.5.1.2 Source Repository

REPO-SVC-CONN

#### 1.5.1.3 Method Contracts

- {'method_name': 'isConnected', 'method_signature': 'isConnected(IsConnectedRequest{ userIdA: string, userIdB: string }) : IsConnectedResponse{ areConnected: boolean }', 'method_purpose': 'To synchronously verify if a first-degree connection exists between two users.', 'integration_context': 'This method must be called as a blocking authorization check before creating a new conversation or processing a sendMessage event to enforce REQ-1-029. To meet performance NFRs, the result of this call must be cached locally (e.g., in Redis) with a short TTL, and the call itself must be wrapped in a circuit breaker pattern to ensure resilience.'}

#### 1.5.1.4 Integration Pattern

Synchronous Request/Response

#### 1.5.1.5 Communication Protocol

gRPC

#### 1.5.1.6 Extraction Reasoning

The repository definition explicitly states a dependency on the Connections service to enforce access control (REQ-1-029), and the dependency contract specifies this gRPC interface is required.

### 1.5.2.0 Interface Name

#### 1.5.2.1 Interface Name

IPlatformContracts

#### 1.5.2.2 Source Repository

REPO-LIB-CONTRACTS

#### 1.5.2.3 Method Contracts

- {'method_name': 'gRPC Service Definitions', 'method_signature': "Contains .proto files for 'MessagingService' (exposed) and 'ConnectionsService' (consumed).", 'method_purpose': 'To provide the authoritative gRPC contract definitions for code generation of server stubs and client proxies.', 'integration_context': 'Consumed at build-time. The `protoc` compiler uses these files to generate TypeScript interfaces and classes, ensuring type-safe communication with other services.'}

#### 1.5.2.4 Integration Pattern

Build-Time Dependency (NPM Package)

#### 1.5.2.5 Communication Protocol

N/A (File consumption)

#### 1.5.2.6 Extraction Reasoning

As a microservice that both exposes and consumes gRPC interfaces, it has a mandatory build-time dependency on the central contracts repository for all its .proto file definitions.

### 1.5.3.0 Interface Name

#### 1.5.3.1 Interface Name

IPlatformCoreLibs

#### 1.5.3.2 Source Repository

REPO-LIB-CORE

#### 1.5.3.3 Method Contracts

- {'method_name': 'ObservabilityModule', 'method_signature': 'Provides standardized logging, metrics, and tracing services.', 'method_purpose': 'To ensure consistent observability across all microservices as per REQ-1-083.', 'integration_context': 'Imported into the root AppModule to provide injectable services like `LoggerService` and automatically instrument the application.'}

#### 1.5.3.4 Integration Pattern

Build-Time Dependency (NPM Package)

#### 1.5.3.5 Communication Protocol

TypeScript/NestJS Module Imports

#### 1.5.3.6 Extraction Reasoning

All backend services depend on this library for standardized cross-cutting concerns, particularly observability, which is essential for a distributed system.

### 1.5.4.0 Interface Name

#### 1.5.4.1 Interface Name

IRedisStore

#### 1.5.4.2 Source Repository

REPO-INFRA

#### 1.5.4.3 Method Contracts

##### 1.5.4.3.1 Method Name

###### 1.5.4.3.1.1 Method Name

Socket.IO Adapter Interface

###### 1.5.4.3.1.2 Method Signature

Pub/Sub channels for broadcasting WebSocket events.

###### 1.5.4.3.1.3 Method Purpose

To enable horizontal scaling of the stateful WebSocket service by sharing connection state and broadcasting events across all instances.

###### 1.5.4.3.1.4 Integration Context

Configured in the main application bootstrap, this adapter uses Redis's Pub/Sub capabilities to create a backplane for Socket.IO.

##### 1.5.4.3.2.0 Method Name

###### 1.5.4.3.2.1 Method Name

Cache Interface

###### 1.5.4.3.2.2 Method Signature

GET/SET operations on keys.

###### 1.5.4.3.2.3 Method Purpose

To provide a high-performance cache for frequently accessed, externally sourced data.

###### 1.5.4.3.2.4 Integration Context

Used to cache the results of the `isConnected` gRPC call to the Connections service, mitigating the performance impact of frequent authorization checks.

#### 1.5.4.4.0.0 Integration Pattern

Client-Service

#### 1.5.4.5.0.0 Communication Protocol

Redis Protocol

#### 1.5.4.6.0.0 Extraction Reasoning

Redis is a critical infrastructure dependency for this service, required to solve the architectural challenge of scalability (REQ-1-052) and to meet performance NFRs by caching authorization data.

### 1.5.5.0.0.0 Interface Name

#### 1.5.5.1.0.0 Interface Name

IPostgreSQLDatabase

#### 1.5.5.2.0.0 Source Repository

REPO-INFRA

#### 1.5.5.3.0.0 Method Contracts

- {'method_name': 'Data Persistence', 'method_signature': "SQL operations (SELECT, INSERT, UPDATE, DELETE) on 'Conversation' and 'Message' tables.", 'method_purpose': 'To provide durable storage for all conversation and message history, fulfilling REQ-1-028.', 'integration_context': "Accessed via the Prisma ORM client from the service's repository layer for all CRUD operations on messaging data."}

#### 1.5.5.4.0.0 Integration Pattern

ORM Client

#### 1.5.5.5.0.0 Communication Protocol

PostgreSQL Protocol

#### 1.5.5.6.0.0 Extraction Reasoning

As the owner of messaging data, the service has a direct, mandatory dependency on the primary relational database for data persistence.

## 1.6.0.0.0.0 Exposed Interfaces

### 1.6.1.0.0.0 Interface Name

#### 1.6.1.1.0.0 Interface Name

Messaging (WebSocket API)

#### 1.6.1.2.0.0 Consumer Repositories

- REPO-APP-WEB

#### 1.6.1.3.0.0 Method Contracts

##### 1.6.1.3.1.0 Method Name

###### 1.6.1.3.1.1 Method Name

emit('sendMessage')

###### 1.6.1.3.1.2 Method Signature

sendMessage(payload: { conversationId: string, text: string })

###### 1.6.1.3.1.3 Method Purpose

Allows an authenticated client to send a new message to a conversation.

###### 1.6.1.3.1.4 Implementation Requirements

The server must derive the sender's ID from the authenticated socket, not the payload. It must authorize the action by checking the connection status before persisting and broadcasting the message.

##### 1.6.1.3.2.0 Method Name

###### 1.6.1.3.2.1 Method Name

on('newMessage')

###### 1.6.1.3.2.2 Method Signature

newMessage(payload: { messageId: string, conversationId: string, senderId: string, text: string, timestamp: string })

###### 1.6.1.3.2.3 Method Purpose

Delivers a new message in real-time to the recipient's client.

###### 1.6.1.3.2.4 Implementation Requirements

This event is broadcast to the recipient's socket and conversation room.

##### 1.6.1.3.3.0 Method Name

###### 1.6.1.3.3.1 Method Name

emit('markAsRead')

###### 1.6.1.3.3.2 Method Signature

markAsRead(payload: { conversationId: string, lastReadMessageId: string })

###### 1.6.1.3.3.3 Method Purpose

Allows a client to inform the server that messages in a conversation have been read.

###### 1.6.1.3.3.4 Implementation Requirements

The server will update the status of messages in the database and emit a messageRead event to the other user in the conversation.

##### 1.6.1.3.4.0 Method Name

###### 1.6.1.3.4.1 Method Name

on('messageRead')

###### 1.6.1.3.4.2 Method Signature

messageRead(payload: { conversationId: string, messageId: string, readAt: string })

###### 1.6.1.3.4.3 Method Purpose

Notifies a sender in real-time that their message has been read by the recipient.

###### 1.6.1.3.4.4 Implementation Requirements

Triggered by the markAsRead event from the recipient.

##### 1.6.1.3.5.0 Method Name

###### 1.6.1.3.5.1 Method Name

emit('startTyping')

###### 1.6.1.3.5.2 Method Signature

startTyping(payload: { conversationId: string })

###### 1.6.1.3.5.3 Method Purpose

Notifies the server that the user has started typing in a conversation.

###### 1.6.1.3.5.4 Implementation Requirements

The server will broadcast a typing event to the other user in the conversation.

##### 1.6.1.3.6.0 Method Name

###### 1.6.1.3.6.1 Method Name

on('typing')

###### 1.6.1.3.6.2 Method Signature

typing(payload: { conversationId: string, userId: string })

###### 1.6.1.3.6.3 Method Purpose

Notifies a client that the other user is typing.

###### 1.6.1.3.6.4 Implementation Requirements

The client UI will display a 'typing...' indicator for a short duration.

#### 1.6.1.4.0.0 Service Level Requirements

- Message delivery latency (end-to-end) must be under 500ms in nominal conditions.

#### 1.6.1.5.0.0 Implementation Constraints

- Must use the Socket.IO library.
- Connections must be authenticated using the session JWT during the handshake.

#### 1.6.1.6.0.0 Extraction Reasoning

This interface is the primary contract for the client-facing, real-time functionality of the service, directly fulfilling REQ-1-026 and REQ-1-027. It's explicitly defined in the exposed_contracts.

### 1.6.2.0.0.0 Interface Name

#### 1.6.2.1.0.0 Interface Name

MessagingService (gRPC)

#### 1.6.2.2.0.0 Consumer Repositories

- REPO-GW-API

#### 1.6.2.3.0.0 Method Contracts

- {'method_name': 'getMessageHistory', 'method_signature': 'getMessageHistory(HistoryRequest{ conversationId: string, paginationCursor?: string, pageSize?: number }) : HistoryResponse{ messages: Message[], nextCursor?: string }', 'method_purpose': 'Allows the API Gateway to fetch a paginated history of messages for a specific conversation on behalf of a client.', 'implementation_requirements': 'The service must authorize that the requesting user (forwarded from the gateway) is a participant in the conversation. The database query must be indexed for efficient, cursor-based pagination.'}

#### 1.6.2.4.0.0 Service Level Requirements

- P95 latency for a page of messages must be < 200ms.

#### 1.6.2.5.0.0 Implementation Constraints

*No items available*

#### 1.6.2.6.0.0 Extraction Reasoning

This interface is required to fulfill REQ-1-028 (Persist and display message history). It provides a backend-facing way for the system to retrieve historical data, separating it from the real-time WebSocket flow. It's explicitly defined in the exposed_contracts.

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The service must be built using the NestJS framework on Node.js with TypeScript.

### 1.7.2.0.0.0 Integration Technologies

- WebSockets (Socket.IO with socket.io-redis-adapter)
- gRPC (@nestjs/microservices)
- Prisma (ORM for PostgreSQL)
- Redis (for caching and the Socket.IO backplane)

### 1.7.3.0.0.0 Performance Constraints

The service must be optimized to handle a large number of concurrent, long-lived WebSocket connections. The synchronous gRPC call to the Connections Service is a performance-critical dependency and its results must be cached.

### 1.7.4.0.0.0 Security Requirements

WebSocket connections must be authenticated via JWT in the handshake. All API calls (WebSocket events and gRPC methods) must perform authorization checks, especially verifying connection status before allowing messaging actions.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | The analysis has been systematically performed, en... |
| Cross Reference Validation | All specified interfaces have been cross-reference... |
| Implementation Readiness Assessment | The integration design is highly actionable. It sp... |
| Quality Assurance Confirmation | The final integration specification is verified to... |

