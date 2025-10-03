# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | REPO-SVC-CONN |
| Extraction Timestamp | 2024-05-21T10:00:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 100% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-015

#### 1.2.1.2 Requirement Text

The system shall enable users to send a connection request to other users on the platform. When sending a request, the user must have the option to include a personalized message, limited to a maximum of 300 characters.

#### 1.2.1.3 Validation Criteria

- Verify a user can send a connection request to another user from their profile page or search results.
- Verify the option to add a personalized message is present.
- Verify the message is limited to 300 characters.
- Verify the recipient receives the connection request along with the personalized message, if provided.

#### 1.2.1.4 Implementation Implications

- The service must implement a 'sendRequest' method.
- The method's DTO must include an optional 'message' field with a 300-character validation rule.
- The service needs to persist the pending connection request with the associated message.

#### 1.2.1.5 Extraction Reasoning

This requirement is a core responsibility of the Connections service, as defined in the repository's explicit requirements mapping.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-016

#### 1.2.2.2 Requirement Text

The system shall provide users with an interface to view and manage their pending incoming connection requests. For each pending request, the user must have the options to 'Accept' or 'Decline'. Accepting a request establishes a first-degree connection between the two users. Declining a request dismisses it.

#### 1.2.2.3 Validation Criteria

- Verify a user can see a list of all pending incoming connection requests.
- Verify that accepting a request adds the other user to the connection list and vice-versa.
- Verify that declining a request removes it from the pending list.
- Verify the sender is notified when their request is accepted.

#### 1.2.2.4 Implementation Implications

- The service must implement 'acceptRequest' and 'declineRequest' methods.
- These methods will change the state of a connection record from 'pending' to 'accepted' or 'declined'.
- Upon accepting, a 'ConnectionAccepted' event must be published for the Notifications service.
- A 'getPendingRequests' method is required to supply the data for the user interface.

#### 1.2.2.5 Extraction Reasoning

This requirement dictates the state management of connection requests, which is a primary function of this service.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-017

#### 1.2.3.2 Requirement Text

The system shall provide a feature for users to view a list of all their first-degree connections. This list must be sortable by the connection's name (alphabetically) and by the date the connection was established (most recent first).

#### 1.2.3.3 Validation Criteria

- Verify a user can access a page displaying all their connections.
- Verify the user can sort the list alphabetically by name.
- Verify the user can sort the list by connection date.

#### 1.2.3.4 Implementation Implications

- The service must implement a 'getConnections' method that supports pagination and sorting parameters.
- The underlying database query must be optimized for sorting by connection date and, through a JOIN, by user name.
- The 'Connection' entity must store a timestamp for when the connection was established.

#### 1.2.3.5 Extraction Reasoning

This requirement defines the primary read operation for a user's established network, which is owned by this service.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-018

#### 1.2.4.2 Requirement Text

The system shall allow a user to remove an existing first-degree connection. This action must be reciprocal, meaning both users are removed from each other's connection lists simultaneously. The system must not send a notification to the user who has been removed.

#### 1.2.4.3 Validation Criteria

- Verify a user can select a connection and choose to remove them.
- Verify that after removal, the user is no longer in the initiator's connection list.
- Verify that after removal, the initiator is no longer in the removed user's connection list.
- Verify that no notification is sent to the removed user.

#### 1.2.4.4 Implementation Implications

- The service must implement a 'removeConnection' method.
- This method must perform a hard delete on the connection record, which represents the reciprocal relationship.
- The service must explicitly NOT publish any event that would trigger a notification for this action.

#### 1.2.4.5 Extraction Reasoning

This requirement defines the 'delete' part of the CRUD operations for connections, a core responsibility of this service.

### 1.2.5.0 Requirement Id

#### 1.2.5.1 Requirement Id

REQ-1-090

#### 1.2.5.2 Requirement Text

The system must enforce the business rule that a connection is a bidirectional relationship requiring mutual acceptance. The system must prevent a user from sending a new connection request to another user if there is already a pending request between them in either direction (A to B, or B to A).

#### 1.2.5.3 Validation Criteria

- Verify that after User A sends a request to User B, User A cannot send another request to User B.
- Verify that after User A sends a request to User B, User B cannot send a request to User A, but is instead prompted to accept the existing request.

#### 1.2.5.4 Implementation Implications

- The business logic within the 'sendRequest' method must perform a check for an existing pending connection in either direction before creating a new one.
- If a duplicate request is attempted, the service must return a specific error (e.g., FAILED_PRECONDITION gRPC status) to the caller.

#### 1.2.5.5 Extraction Reasoning

This requirement defines a critical business rule and constraint that must be enforced by the Connections service's logic.

## 1.3.0.0 Relevant Components

- {'component_name': 'Connections Service', 'component_specification': "A microservice that exclusively manages the professional network graph. Its responsibilities include handling the lifecycle of connection requests (pending, accepted, declined), managing the list of first-degree connections for a user, and providing an authoritative source for the connection status between any two users. It is the sole owner and writer of the 'Connection' data model.", 'implementation_requirements': ["Implement a gRPC server to expose the service's methods to other internal microservices.", "Use Prisma as the ORM to interact with the 'Connection' table in the PostgreSQL database.", "Integrate with a Redis client to cache users' connection lists (sets of user IDs) for high-performance lookups.", "Publish events ('ConnectionRequestSent', 'ConnectionAccepted') to the configured Event Bus for consumption by other services like Notifications.", 'Enforce all business rules related to connection states, such as preventing duplicate requests.'], 'architectural_context': "This component is a domain-specific microservice within the Application Services Layer. It encapsulates the 'Connections' bounded context.", 'extraction_reasoning': "This is the single, primary component being implemented by the 'platform-service-connections' repository, as explicitly stated in the repository's definition and its mapping to the architecture."}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Application Services Layer (Backend Microservices)', 'layer_responsibilities': 'This layer is responsible for implementing the core business logic of the application within distinct, independently deployable microservices. Services in this layer manage their own data, expose APIs (typically gRPC for internal communication), and communicate with other services asynchronously via an event bus.', 'layer_constraints': ['All services must be developed using the Node.js runtime with the NestJS framework and TypeScript.', 'Services must be packaged as Docker containers and be ready for orchestration by Kubernetes (AWS EKS).', 'Services should be stateless to allow for horizontal scaling.'], 'implementation_patterns': ['Domain-Driven Design (DDD)', 'Event-Driven Architecture', 'API Gateway'], 'extraction_reasoning': "The repository definition explicitly maps the 'platform-service-connections' service to this architectural layer, and its responsibilities align perfectly with the layer's definition."}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

IEventPublisher

#### 1.5.1.2 Source Repository

REPO-SVC-NOTIFY

#### 1.5.1.3 Method Contracts

##### 1.5.1.3.1 Method Name

###### 1.5.1.3.1.1 Method Name

publishConnectionRequestSent

###### 1.5.1.3.1.2 Method Signature

publish(event: { senderId: string, recipientId: string, message?: string })

###### 1.5.1.3.1.3 Method Purpose

To notify the system, specifically the Notifications service, that a new connection request has been created, allowing it to generate a real-time notification for the recipient.

###### 1.5.1.3.1.4 Integration Context

Published asynchronously immediately after a new pending connection request is successfully persisted in the database.

##### 1.5.1.3.2.0 Method Name

###### 1.5.1.3.2.1 Method Name

publishConnectionAccepted

###### 1.5.1.3.2.2 Method Signature

publish(event: { accepterId: string, requesterId: string })

###### 1.5.1.3.2.3 Method Purpose

To notify the system, specifically the Notifications service, that a pending connection request has been accepted, allowing it to generate a real-time notification for the original sender.

###### 1.5.1.3.2.4 Integration Context

Published asynchronously immediately after a connection's status is successfully updated from 'pending' to 'accepted'.

#### 1.5.1.4.0.0 Integration Pattern

Publish-Subscribe (Pub/Sub)

#### 1.5.1.5.0.0 Communication Protocol

Event Bus (AWS SNS/SQS)

#### 1.5.1.6.0.0 Extraction Reasoning

The repository definition explicitly states that it publishes events for the Notifications service (REPO-SVC-NOTIFY), defining this as a key dependency for asynchronous communication to fulfill requirements like REQ-1-016.

### 1.5.2.0.0.0 Interface Name

#### 1.5.2.1.0.0 Interface Name

IProfileService

#### 1.5.2.2.0.0 Source Repository

REPO-SVC-PRF

#### 1.5.2.3.0.0 Method Contracts

- {'method_name': 'getProfileSummaries', 'method_signature': 'getProfileSummaries(request: { userIds: string[] }): Promise<{ profiles: { userId: string, name: string }[] }>', 'method_purpose': 'To retrieve a batch of basic profile information (like user names) for a given list of user IDs.', 'integration_context': "Called by this service when fetching a user's connection list to enrich the data with names for sorting, as required by REQ-1-017. A batch endpoint is used to prevent N+1 query problems."}

#### 1.5.2.4.0.0 Integration Pattern

Synchronous Request/Response

#### 1.5.2.5.0.0 Communication Protocol

gRPC

#### 1.5.2.6.0.0 Extraction Reasoning

This dependency is required to fulfill REQ-1-017 (sort connections by name). The Connections service owns the relationship graph (the IDs), but the Profile service owns the profile data (the names).

### 1.5.3.0.0.0 Interface Name

#### 1.5.3.1.0.0 Interface Name

IPlatformContracts

#### 1.5.3.2.0.0 Source Repository

REPO-LIB-CONTRACTS

#### 1.5.3.3.0.0 Method Contracts

- {'method_name': 'N/A (Package Consumption)', 'method_signature': "import { ConnectionsService, IsConnectedRequest, ... } from 'platform-contracts';", 'method_purpose': 'To provide the authoritative gRPC service definitions (.proto files) and TypeScript interfaces for event payloads.', 'integration_context': 'Consumed at build-time. The .proto files are used to generate the server stubs and client interfaces that this service implements and consumes. TypeScript types are used for event publishing.'}

#### 1.5.3.4.0.0 Integration Pattern

Build-Time Dependency (NPM Package)

#### 1.5.3.5.0.0 Communication Protocol

TypeScript Type Imports / Protobuf Compilation

#### 1.5.3.6.0.0 Extraction Reasoning

As a microservice in a contract-first architecture, this service depends on the central contracts library for all its communication interface definitions.

### 1.5.4.0.0.0 Interface Name

#### 1.5.4.1.0.0 Interface Name

ICoreLibs

#### 1.5.4.2.0.0 Source Repository

REPO-LIB-CORE

#### 1.5.4.3.0.0 Method Contracts

- {'method_name': 'N/A (Package Consumption)', 'method_signature': "import { JwtAuthGuard, LoggerService, ... } from 'platform-core-libs';", 'method_purpose': 'To provide common, reusable backend functionalities such as standardized logging, observability instrumentation, and security guards.', 'integration_context': 'Consumed at build-time and runtime. The service will import and use modules like the ObservabilityModule and apply guards like the JwtAuthGuard to its gRPC controllers to enforce consistent cross-cutting concerns.'}

#### 1.5.4.4.0.0 Integration Pattern

Build-Time Dependency (NPM Package)

#### 1.5.4.5.0.0 Communication Protocol

TypeScript Module Imports

#### 1.5.4.6.0.0 Extraction Reasoning

To avoid code duplication and enforce consistent architectural patterns, all backend services depend on the core library for cross-cutting concerns like observability (REQ-1-083) and security.

## 1.6.0.0.0.0 Exposed Interfaces

- {'interface_name': 'IConnectionsService', 'consumer_repositories': ['REPO-GW-API', 'REPO-SVC-POSTS', 'REPO-SVC-MSG', 'REPO-SVC-PRF', 'REPO-SVC-SEARCH', 'REPO-SVC-ENGAGE'], 'method_contracts': [{'method_name': 'sendRequest', 'method_signature': 'sendRequest(request: { senderId: string, recipientId: string, message?: string }) : Promise<StatusResponse>', 'method_purpose': "To create a new 'pending' connection request between two users.", 'implementation_requirements': 'Must validate that no existing connection or pending request exists between the users in either direction before creating a new record (REQ-1-090).'}, {'method_name': 'acceptRequest', 'method_signature': 'acceptRequest(request: { accepterId: string, requesterId: string }) : Promise<StatusResponse>', 'method_purpose': "To change the status of a 'pending' connection request to 'accepted', establishing a first-degree connection.", 'implementation_requirements': "Must perform an authorization check to ensure the 'accepterId' is the original recipient of the request. Must publish a 'ConnectionAccepted' event upon success."}, {'method_name': 'declineRequest', 'method_signature': 'declineRequest(request: { declinerId: string, requesterId: string }) : Promise<StatusResponse>', 'method_purpose': "To change the status of a 'pending' connection request to 'declined'.", 'implementation_requirements': "Must perform an authorization check to ensure the 'declinerId' is the original recipient of the request. Must NOT publish a user-facing notification event."}, {'method_name': 'removeConnection', 'method_signature': 'removeConnection(request: { removerId: string, connectionId: string }) : Promise<StatusResponse>', 'method_purpose': "To permanently and reciprocally delete an 'accepted' connection between two users.", 'implementation_requirements': "Must perform an authorization check to ensure the 'removerId' is one of the parties in the connection. Must NOT publish a user-facing notification event (REQ-1-018)."}, {'method_name': 'getPendingRequests', 'method_signature': 'getPendingRequests(request: { userId: string, pagination: any }) : Promise<PendingRequestsResponse>', 'method_purpose': 'To retrieve a paginated list of incoming pending connection requests for a user.', 'implementation_requirements': "Must perform an authorization check to ensure the 'userId' matches the authenticated user."}, {'method_name': 'getConnections', 'method_signature': 'getConnections(request: { userId: string, pagination: any, sort: any }) : Promise<ConnectionsResponse>', 'method_purpose': "To retrieve a paginated and sortable list of a user's first-degree connections.", 'implementation_requirements': 'Must perform an authorization check. Logic will involve calls to the Profile service to enrich data for sorting by name (REQ-1-017).'}, {'method_name': 'isConnected', 'method_signature': 'isConnected(request: { userIdA: string, userIdB: string }) : Promise<{ areConnected: boolean }>', 'method_purpose': 'To provide a high-performance, authoritative check on whether two users are first-degree connections. This is a critical authorization check for other services.', 'implementation_requirements': 'This method must be highly optimized. It must first check a Redis cache (ConnectionSet) for the connection status before falling back to a database query to meet low-latency requirements (REQ-1-051).'}], 'service_level_requirements': ["The 'isConnected' method must have a p99 latency of <50ms, as it is a frequent authorization check gating access to content and messaging.", 'The service must maintain high availability as it is a core dependency for multiple other services.'], 'implementation_constraints': ["The gRPC contract for this service is defined in the 'REPO-LIB-CONTRACTS' repository and must be strictly adhered to.", 'All methods must perform authorization checks to ensure a user is only acting on their own connections or requests.'], 'extraction_reasoning': 'The repository definition explicitly defines this gRPC service as its public, exposed contract for consumption by other internal services.'}

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The service must be built using NestJS and TypeScript. It must use Prisma as the ORM for interacting with the PostgreSQL database.

### 1.7.2.0.0.0 Integration Technologies

- gRPC: For exposing the synchronous service interface to other microservices.
- PostgreSQL: The primary database for persisting connection data.
- Redis: A mandatory caching layer for storing sets of user connection IDs to enable high-performance lookups for the 'isConnected' method.
- Event Bus (AWS SNS/SQS): For publishing events related to connection status changes asynchronously.

### 1.7.3.0.0.0 Performance Constraints

The service must cache users' first-degree connection lists in Redis to provide extremely fast lookups for other services. This is a critical performance requirement to avoid database hotspots and ensure low latency on visibility checks platform-wide.

### 1.7.4.0.0.0 Security Requirements

Strict server-side authorization is required on all methods. The service must ensure that a user can only accept/decline requests sent to them, send requests from their own ID, and remove connections they are a part of.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | The extracted context covers all explicitly mapped... |
| Cross Reference Validation | All cross-references have been validated and enhan... |
| Implementation Readiness Assessment | The context is highly implementation-ready. It spe... |
| Quality Assurance Confirmation | The analysis systematically identified and filled ... |

