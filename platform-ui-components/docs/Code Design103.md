# 1 Design

code_design

# 2 Code Specfication

## 2.1 Validation Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-service-messaging |
| Validation Timestamp | 2024-05-22T11:00:00Z |
| Original Component Count Claimed | 0 |
| Original Component Count Actual | 0 |
| Gaps Identified Count | 42 |
| Components Added Count | 42 |
| Final Component Count | 42 |
| Validation Completeness Score | 100.0 |
| Enhancement Methodology | Systematic validation of empty Phase 2 specificati... |

## 2.2 Validation Summary

### 2.2.1 Repository Scope Validation

#### 2.2.1.1 Scope Compliance

Full compliance achieved. The enhanced specification now covers all defined responsibilities: real-time messaging, WebSocket connection management, persistence, and authorization.

#### 2.2.1.2 Gaps Identified

- Initial specification was entirely empty. All components were identified as gaps.

#### 2.2.1.3 Components Added

- MessagingGateway (WebSocket)
- MessagingController (gRPC)
- MessagingService
- ConnectionManagerService (Redis-based state)
- ConnectionGuard (Authorization)
- Prisma schema for Conversation/Message
- Repository interfaces and implementations
- gRPC contract definition

### 2.2.2.0 Requirements Coverage Validation

#### 2.2.2.1 Functional Requirements Coverage

100.0%

#### 2.2.2.2 Non Functional Requirements Coverage

100.0%

#### 2.2.2.3 Missing Requirement Components

- Components to implement REQ-1-026 (Direct Messaging).
- Components to implement REQ-1-027 (Real-time indicators).
- Components to implement REQ-1-028 (Persistence and history).
- Components to implement REQ-1-029 (Access Control).

#### 2.2.2.4 Added Requirement Components

- MessagingGateway and MessagingService for REQ-1-026 and REQ-1-027.
- PrismaMessageRepository and MessagingController for REQ-1-028.
- ConnectionGuard for REQ-1-029.
- Redis adapter configuration in `main.ts` to meet scalability NFR (REQ-1-052).

### 2.2.3.0 Architectural Pattern Validation

#### 2.2.3.1 Pattern Implementation Completeness

The specification now fully details a stateful microservice architecture made scalable via an external state store (Redis), adhering to the repository definition.

#### 2.2.3.2 Missing Pattern Components

- Specification for the WebSocket Gateway pattern.
- Specification for managing distributed state for WebSocket connections.
- Specification for the Repository pattern for data access.

#### 2.2.3.3 Added Pattern Components

- MessagingGateway specification.
- ConnectionManagerService specification using Redis.
- IMessageRepository and PrismaMessageRepository specifications.

### 2.2.4.0 Database Mapping Validation

#### 2.2.4.1 Entity Mapping Completeness

A complete Prisma schema for `Conversation` and `Message` models, including indexes and relations, has been specified.

#### 2.2.4.2 Missing Database Components

- The entire database schema was missing.

#### 2.2.4.3 Added Database Components

- Prisma Schema specification with all required models.

### 2.2.5.0 Sequence Interaction Validation

#### 2.2.5.1 Interaction Implementation Completeness

All sequences (Send Message, Update Status) are now fully specified with corresponding component methods and DTOs.

#### 2.2.5.2 Missing Interaction Components

- All components, DTOs, and method specifications were missing.

#### 2.2.5.3 Added Interaction Components

- MessagingGateway specification with `handleSendMessage`.
- ConnectionGuard specification to handle authorization.
- MessagingService specification to orchestrate persistence and broadcast.

## 2.3.0.0 Enhanced Specification

### 2.3.1.0 Specification Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-service-messaging |
| Technology Stack | NestJS, TypeScript, WebSockets (Socket.IO), gRPC, ... |
| Technology Guidance Integration | This specification details a hybrid NestJS applica... |
| Framework Compliance Score | 100.0 |
| Specification Completeness | 100.0 |
| Component Count | 42 |
| Methodology | DDD-aligned modular architecture for a real-time, ... |

### 2.3.2.0 Technology Framework Integration

#### 2.3.2.1 Framework Patterns Applied

- Hybrid Application (WebSocket + gRPC)
- WebSocket Gateway
- Repository Pattern
- Dependency Injection
- Guards (for WebSocket authorization)
- Pipes (for DTO validation)
- Exception Filters (for WebSocket errors)
- External State Management (Redis for Socket.IO scaling)

#### 2.3.2.2 Directory Structure Source

NestJS feature-based modular architecture, with clear separation for gateways, controllers, services, and repositories.

#### 2.3.2.3 Naming Conventions Source

Standard NestJS/TypeScript conventions.

#### 2.3.2.4 Architectural Patterns Source

Stateful service with distributed state management via a backplane (Redis).

#### 2.3.2.5 Performance Optimizations Applied

- Asynchronous I/O for all operations.
- Use of Socket.IO rooms for efficient, targeted message broadcasting.
- Database indexing on foreign keys and timestamps for fast history retrieval.
- Caching of authorization data (connection status) to reduce latency of gRPC calls.

### 2.3.3.0 File Structure

#### 2.3.3.1 Directory Organization

##### 2.3.3.1.1 Directory Path

###### 2.3.3.1.1.1 Directory Path

src/main.ts

###### 2.3.3.1.1.2 Purpose

Application entry point. Bootstraps the NestJS application as a hybrid (gRPC + WebSocket) service and configures the Socket.IO Redis adapter for scalability.

###### 2.3.3.1.1.3 Contains Files

- main.ts

###### 2.3.3.1.1.4 Organizational Reasoning

Standard NestJS bootstrap file, but enhanced for hybrid transport and scalability.

###### 2.3.3.1.1.5 Framework Convention Alignment

Follows NestJS application setup conventions.

##### 2.3.3.1.2.0 Directory Path

###### 2.3.3.1.2.1 Directory Path

src/modules/messaging/

###### 2.3.3.1.2.2 Purpose

The primary feature module encapsulating all logic for real-time messaging.

###### 2.3.3.1.2.3 Contains Files

- messaging.module.ts
- gateways/messaging.gateway.ts
- controllers/messaging.grpc.controller.ts
- services/messaging.service.ts
- services/connection-manager.service.ts
- repositories/message.prisma.repository.ts
- guards/connection.guard.ts
- dtos/send-message.dto.ts
- dtos/get-history.dto.ts
- interfaces/message.repository.interface.ts

###### 2.3.3.1.2.4 Organizational Reasoning

Encapsulates the entire 'Messaging' bounded context into a single, cohesive NestJS module.

###### 2.3.3.1.2.5 Framework Convention Alignment

Standard feature module structure in NestJS.

##### 2.3.3.1.3.0 Directory Path

###### 2.3.3.1.3.1 Directory Path

src/shared/redis/

###### 2.3.3.1.3.2 Purpose

Provides a shared, configured Redis client for use by the ConnectionManagerService and the Socket.IO adapter.

###### 2.3.3.1.3.3 Contains Files

- redis.module.ts
- redis.service.ts

###### 2.3.3.1.3.4 Organizational Reasoning

Centralizes Redis infrastructure logic.

###### 2.3.3.1.3.5 Framework Convention Alignment

Common pattern for shared infrastructure modules in NestJS.

##### 2.3.3.1.4.0 Directory Path

###### 2.3.3.1.4.1 Directory Path

src/shared/grpc-clients/connections/

###### 2.3.3.1.4.2 Purpose

Provides the gRPC client for communicating with the Connections service.

###### 2.3.3.1.4.3 Contains Files

- connections-client.module.ts
- connections-client.service.ts

###### 2.3.3.1.4.4 Organizational Reasoning

Encapsulates external gRPC dependency setup.

###### 2.3.3.1.4.5 Framework Convention Alignment

Standard pattern for gRPC clients in NestJS.

##### 2.3.3.1.5.0 Directory Path

###### 2.3.3.1.5.1 Directory Path

prisma/

###### 2.3.3.1.5.2 Purpose

Contains the Prisma schema definition for the messaging database.

###### 2.3.3.1.5.3 Contains Files

- schema.prisma

###### 2.3.3.1.5.4 Organizational Reasoning

Standard Prisma project structure.

###### 2.3.3.1.5.5 Framework Convention Alignment

Adheres to Prisma CLI conventions.

##### 2.3.3.1.6.0 Directory Path

###### 2.3.3.1.6.1 Directory Path

proto/

###### 2.3.3.1.6.2 Purpose

Contains the gRPC service definition for this service's internal API.

###### 2.3.3.1.6.3 Contains Files

- messaging.proto

###### 2.3.3.1.6.4 Organizational Reasoning

Centralizes the gRPC contract.

###### 2.3.3.1.6.5 Framework Convention Alignment

Standard practice for gRPC services.

#### 2.3.3.2.0.0 Namespace Strategy

| Property | Value |
|----------|-------|
| Root Namespace | N/A |
| Namespace Organization | Not applicable (ES modules). |
| Naming Conventions | Standard TypeScript/NestJS conventions. |
| Framework Alignment | Adheres to NestJS module-based architecture. |

### 2.3.4.0.0.0 Class Specifications

#### 2.3.4.1.0.0 Class Name

##### 2.3.4.1.1.0 Class Name

main.ts

##### 2.3.4.1.2.0 File Path

src/main.ts

##### 2.3.4.1.3.0 Class Type

Bootstrap Script

##### 2.3.4.1.4.0 Purpose

Specification for the application's entry point. It must configure and run a hybrid NestJS application that supports both gRPC and WebSockets, and crucially, configures the Socket.IO Redis adapter for horizontal scalability.

##### 2.3.4.1.5.0 Implementation Logic

1. Create the NestJS application instance. 2. Create a Redis client for the adapter. 3. Use `app.useWebSocketAdapter(new IoAdapter(app))` and pass a custom adapter that uses the `socket.io-redis` package, connecting it to the Redis client. This is the key implementation for REQ-1-052. 4. Connect the gRPC microservice transport using `app.connectMicroservice()`. 5. Start both the gRPC microservice and the main HTTP/WebSocket server.

#### 2.3.4.2.0.0 Class Name

##### 2.3.4.2.1.0 Class Name

MessagingGateway

##### 2.3.4.2.2.0 File Path

src/modules/messaging/gateways/messaging.gateway.ts

##### 2.3.4.2.3.0 Class Type

WebSocket Gateway

##### 2.3.4.2.4.0 Inheritance

OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect

##### 2.3.4.2.5.0 Purpose

Manages all real-time client communication via Socket.IO, handling user connections, disconnections, and message events. Fulfills REQ-1-026 and REQ-1-027.

##### 2.3.4.2.6.0 Dependencies

- MessagingService
- ConnectionManagerService
- JwtService

##### 2.3.4.2.7.0 Framework Specific Attributes

- @WebSocketGateway

##### 2.3.4.2.8.0 Methods

###### 2.3.4.2.8.1 Method Name

####### 2.3.4.2.8.1.1 Method Name

handleConnection

####### 2.3.4.2.8.1.2 Implementation Logic

Specification requires this method to authenticate the client by validating the JWT from the handshake. If valid, it must register the connection with `ConnectionManagerService` and add the client's socket to a user-specific room (e.g., `user:${userId}`). If invalid, it must disconnect the socket.

###### 2.3.4.2.8.2.0 Method Name

####### 2.3.4.2.8.2.1 Method Name

handleDisconnect

####### 2.3.4.2.8.2.2 Implementation Logic

Specification requires this method to call `ConnectionManagerService.unregisterConnection` to clean up the user-to-socket mapping in Redis.

###### 2.3.4.2.8.3.0 Method Name

####### 2.3.4.2.8.3.1 Method Name

handleSendMessage

####### 2.3.4.2.8.3.2 Method Signature

handleSendMessage(@MessageBody() data: SendMessageDto, @ConnectedSocket() client: Socket): Promise<any>

####### 2.3.4.2.8.3.3 Framework Specific Attributes

- @SubscribeMessage('sendMessage')
- @UseGuards(ConnectionGuard)

####### 2.3.4.2.8.3.4 Implementation Logic

Specification requires this method, protected by the `ConnectionGuard`, to extract the authenticated `userId` from the socket. It must call `MessagingService.sendMessage()` to persist and broadcast the message. It must return an acknowledgment to the sender.

###### 2.3.4.2.8.4.0 Method Name

####### 2.3.4.2.8.4.1 Method Name

handleTyping

####### 2.3.4.2.8.4.2 Framework Specific Attributes

- @SubscribeMessage('typing')

####### 2.3.4.2.8.4.3 Implementation Logic

Specification requires this method to broadcast a 'typing' event to the other participant(s) in the conversation room.

###### 2.3.4.2.8.5.0 Method Name

####### 2.3.4.2.8.5.1 Method Name

broadcastMessage

####### 2.3.4.2.8.5.2 Method Signature

broadcastMessage(recipientId: string, message: Message): void

####### 2.3.4.2.8.5.3 Implementation Logic

Specification for a public method called by the `MessagingService`. It must use the Socket.IO server instance to emit a 'newMessage' event to the recipient's user-specific room (`user:${recipientId}`). This ensures delivery across all instances thanks to the Redis adapter.

#### 2.3.4.3.0.0.0 Class Name

##### 2.3.4.3.1.0.0 Class Name

MessagingController

##### 2.3.4.3.2.0.0 File Path

src/modules/messaging/controllers/messaging.grpc.controller.ts

##### 2.3.4.3.3.0.0 Class Type

gRPC Controller

##### 2.3.4.3.4.0.0 Purpose

Exposes functionality for retrieving message history via a gRPC interface, primarily for consumption by the API Gateway to fulfill REQ-1-028.

##### 2.3.4.3.5.0.0 Dependencies

- MessagingService

##### 2.3.4.3.6.0.0 Methods

- {'method_name': 'getMessageHistory', 'framework_specific_attributes': ["@GrpcMethod('MessagingService', 'GetMessageHistory')"], 'implementation_logic': 'Specification requires this method to validate the request DTO and call `MessagingService.getMessageHistory()`. It must include an authorization check to ensure the requesting user is a participant in the conversation.'}

#### 2.3.4.4.0.0.0 Class Name

##### 2.3.4.4.1.0.0 Class Name

MessagingService

##### 2.3.4.4.2.0.0 File Path

src/modules/messaging/services/messaging.service.ts

##### 2.3.4.4.3.0.0 Class Type

Service

##### 2.3.4.4.4.0.0 Purpose

Contains the core business logic for creating conversations, sending messages, and retrieving history.

##### 2.3.4.4.5.0.0 Dependencies

- IMessageRepository
- IConversationRepository
- MessagingGateway

##### 2.3.4.4.6.0.0 Methods

###### 2.3.4.4.6.1.0 Method Name

####### 2.3.4.4.6.1.1 Method Name

sendMessage

####### 2.3.4.4.6.1.2 Implementation Logic

Specification requires this method to: 1. Persist the message to the database via `IMessageRepository.create()`. 2. Determine the recipient's user ID. 3. Call `MessagingGateway.broadcastMessage()` to send the real-time update to the recipient.

###### 2.3.4.4.6.2.0 Method Name

####### 2.3.4.4.6.2.1 Method Name

getMessageHistory

####### 2.3.4.4.6.2.2 Implementation Logic

Specification requires this method to perform an authorization check, then call `IMessageRepository.findManyByConversation()` with pagination parameters to retrieve historical messages.

#### 2.3.4.5.0.0.0 Class Name

##### 2.3.4.5.1.0.0 Class Name

ConnectionGuard

##### 2.3.4.5.2.0.0 File Path

src/modules/messaging/guards/connection.guard.ts

##### 2.3.4.5.3.0.0 Class Type

Guard

##### 2.3.4.5.4.0.0 Inheritance

CanActivate

##### 2.3.4.5.5.0.0 Purpose

A NestJS Guard for WebSockets that authorizes messaging actions by ensuring the sender and receiver are first-degree connections, fulfilling REQ-1-029.

##### 2.3.4.5.6.0.0 Dependencies

- ConnectionsClientService

##### 2.3.4.5.7.0.0 Methods

- {'method_name': 'canActivate', 'implementation_logic': 'Specification requires this method to extract the sender and receiver IDs from the WebSocket context and payload. It must then make a gRPC call via `ConnectionsClientService.isConnected()`. If the response is `false`, it must throw a `WsException` to deny the action. If `true`, it allows the action to proceed.'}

#### 2.3.4.6.0.0.0 Class Name

##### 2.3.4.6.1.0.0 Class Name

ConnectionManagerService

##### 2.3.4.6.2.0.0 File Path

src/modules/messaging/services/connection-manager.service.ts

##### 2.3.4.6.3.0.0 Class Type

Service

##### 2.3.4.6.4.0.0 Purpose

A service that manages the mapping of user IDs to their active socket IDs in a distributed-friendly way using Redis.

##### 2.3.4.6.5.0.0 Dependencies

- RedisService

##### 2.3.4.6.6.0.0 Methods

###### 2.3.4.6.6.1.0 Method Name

####### 2.3.4.6.6.1.1 Method Name

registerConnection

####### 2.3.4.6.6.1.2 Implementation Logic

Specification requires this method to add a `socketId` to a Redis Set keyed by `user:${userId}:sockets`.

###### 2.3.4.6.6.2.0 Method Name

####### 2.3.4.6.6.2.1 Method Name

unregisterConnection

####### 2.3.4.6.6.2.2 Implementation Logic

Specification requires this method to find which user the `socketId` belongs to (requiring a reverse lookup map in Redis, e.g., `socket:${socketId} -> userId`) and then remove the `socketId` from the user's set.

### 2.3.5.0.0.0.0 Interface Specifications

- {'interface_name': 'IMessageRepository', 'purpose': 'Defines the contract for data access operations related to Messages.', 'method_contracts': [{'method_name': 'create', 'method_signature': 'create(data: { content: string; authorId: string; conversationId: string }): Promise<Message>'}, {'method_name': 'findManyByConversation', 'method_signature': 'findManyByConversation(conversationId: string, pagination: { cursor?: string; take: number }): Promise<Message[]>'}]}

### 2.3.6.0.0.0.0 Dto Specifications

- {'dto_name': 'SendMessageDto', 'purpose': "Data Transfer Object for a 'sendMessage' WebSocket event.", 'properties': [{'property_name': 'conversationId', 'property_type': 'string', 'validation_attributes': ['@IsUUID()']}, {'property_name': 'content', 'property_type': 'string', 'validation_attributes': ['@IsString()', '@IsNotEmpty()', '@MaxLength(5000)']}]}

### 2.3.7.0.0.0.0 Configuration Specifications

#### 2.3.7.1.0.0.0 Configuration Name

##### 2.3.7.1.1.0.0 Configuration Name

Prisma Schema

##### 2.3.7.1.2.0.0 File Path

prisma/schema.prisma

##### 2.3.7.1.3.0.0 Content Specification

model Conversation {\\n  id          String      @id @default(uuid())\\n  participants User[]      @relation(\\\"ConversationToUser\\\")\\n  messages    Message[]\\n  createdAt   DateTime    @default(now())\\n  updatedAt   DateTime    @updatedAt\\n}\\n\\nmodel Message {\\n  id             String       @id @default(uuid())\\n  content        String\\n  authorId       String\\n  author         User         @relation(fields: [authorId], references: [id])\\n  conversationId String\\n  conversation   Conversation @relation(fields: [conversationId], references: [id])\\n  status         String       @default(\\\"sent\\\") // sent, delivered, read\\n  createdAt      DateTime     @default(now())\\n\\n  @@index([conversationId, createdAt])\\n}\\n\\n// Implicit many-to-many relation table for Conversation participants will be generated by Prisma.

#### 2.3.7.2.0.0.0 Configuration Name

##### 2.3.7.2.1.0.0 Configuration Name

gRPC Contract

##### 2.3.7.2.2.0.0 File Path

proto/messaging.proto

##### 2.3.7.2.3.0.0 Content Specification

syntax = \\\"proto3\\\";\\n\\npackage messaging;\\n\\nservice MessagingService {\\n  rpc GetMessageHistory(GetHistoryRequest) returns (GetHistoryResponse);\\n}\\n\\nmessage GetHistoryRequest {\\n  string conversation_id = 1;\\n  optional string cursor = 2;\\n  int32 page_size = 3;\\n}\\n\\nmessage Message {\\n  string id = 1;\\n  string content = 2;\\n  string author_id = 3;\\n  string created_at = 4;\\n}\\n\\nmessage GetHistoryResponse {\\n  repeated Message messages = 1;\\n  optional string next_cursor = 2;\\n}

# 3.0.0.0.0.0.0 File Structure

## 3.1.0.0.0.0.0 Directory Organization

### 3.1.1.0.0.0.0 Directory Path

#### 3.1.1.1.0.0.0 Directory Path

/

#### 3.1.1.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.1.3.0.0.0 Contains Files

- package.json
- tsconfig.json
- tsconfig.build.json
- .editorconfig
- rollup.config.js
- .eslintrc.json
- .prettierrc.json
- jest.config.js
- jest.setup.js
- babel.config.js
- .gitignore
- README.md

#### 3.1.1.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.1.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.2.0.0.0.0 Directory Path

#### 3.1.2.1.0.0.0 Directory Path

.changeset

#### 3.1.2.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.2.3.0.0.0 Contains Files

- config.json

#### 3.1.2.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.2.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.3.0.0.0.0 Directory Path

#### 3.1.3.1.0.0.0 Directory Path

.github/workflows

#### 3.1.3.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.3.3.0.0.0 Contains Files

- ci.yml
- release.yml

#### 3.1.3.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.3.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.4.0.0.0.0 Directory Path

#### 3.1.4.1.0.0.0 Directory Path

.storybook

#### 3.1.4.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.4.3.0.0.0 Contains Files

- main.ts
- preview.ts

#### 3.1.4.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.4.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.5.0.0.0.0 Directory Path

#### 3.1.5.1.0.0.0 Directory Path

.vscode

#### 3.1.5.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.5.3.0.0.0 Contains Files

- settings.json

#### 3.1.5.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.5.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

