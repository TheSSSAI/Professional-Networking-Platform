# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | REPO-SVC-ADMIN |
| Extraction Timestamp | 2024-05-24T11:00:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 100% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-041

#### 1.2.1.2 Requirement Text

The Admin Dashboard must include a Content Moderation Queue that displays all content reported by users. Each item in the queue must clearly show the reported content itself (or a link to it), the reason provided by the reporter, and the identity of the user who made the report.

#### 1.2.1.3 Validation Criteria

- Verify that when a user reports a post, it appears as a new item in the moderation queue.
- Verify the queue item displays the post content, report reason, and reporter's name/profile link.

#### 1.2.1.4 Implementation Implications

- This service must consume a 'ContentReported' event from an event bus to populate its local moderation queue table.
- This service must own the database table for storing content reports.
- A gRPC endpoint must be exposed to allow the Admin Dashboard frontend (via the API Gateway) to fetch and display the queue contents with pagination.

#### 1.2.1.5 Extraction Reasoning

This requirement is a primary responsibility of the Admin service, as stated in its description. The service's main purpose is to process this queue, which it builds by consuming events.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-042

#### 1.2.2.2 Requirement Text

From the Content Moderation Queue, administrators must be able to perform a set of moderation actions on a reported item. These actions shall include: (1) Dismissing the report as benign, (2) Removing the offending content from the platform, (3) Issuing a formal warning to the content's author, (4) Temporarily suspending the author's account, and (5) Permanently banning the author's account.

#### 1.2.2.3 Validation Criteria

- Verify an admin can dismiss a report, removing it from the queue.
- Verify an admin can remove content, making it invisible to all users.
- Verify an admin can suspend an account, preventing the user from logging in for a defined period.
- Verify an admin can ban an account, permanently preventing the user from logging in.

#### 1.2.2.4 Implementation Implications

- This service must orchestrate moderation actions by making gRPC calls to other authoritative services.
- It must call the Posts service (REPO-SVC-POSTS) to remove content.
- It must call the Identity service (REPO-SVC-IDT) to ban or suspend a user.
- Each action must be recorded in the Admin Audit Log as part of a single transaction or workflow.

#### 1.2.2.5 Extraction Reasoning

The repository's description and dependency contracts explicitly state that this service is responsible for orchestrating moderation actions by calling other services like Posts and Identity.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-043

#### 1.2.3.2 Requirement Text

The Admin Dashboard shall include a user management section where administrators can search for and view user accounts. Administrators must have the ability to perform management actions, including triggering a password reset email to be sent to a user.

#### 1.2.3.3 Validation Criteria

- Verify an admin can search for users by name or email.
- Verify an admin can view a user's profile information from the dashboard.
- Verify an admin can trigger a password reset for a specific user.

#### 1.2.3.4 Implementation Implications

- This service will expose gRPC methods for searching and viewing user details for administrative purposes.
- It will need to call the Identity service (REPO-SVC-IDT) to trigger actions like password resets on behalf of a user.
- All user management actions performed by an admin must be logged in the audit trail.

#### 1.2.3.5 Extraction Reasoning

The repository description explicitly lists 'user management' as a core responsibility of this service.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-044

#### 1.2.4.2 Requirement Text

The system must maintain an immutable audit log of all actions performed by administrators via the Admin Dashboard. Each log entry must record the identity of the administrator who performed the action, the specific action taken, the ID of the target entity, and a precise timestamp.

#### 1.2.4.3 Validation Criteria

- Verify that when an admin removes a post, a corresponding entry is created in the audit log.
- Verify that when an admin bans a user, an entry is created in the audit log.
- Verify that the audit log is not editable or deletable through the application interface.

#### 1.2.4.4 Implementation Implications

- This service must own and manage the 'AdminAuditLog' database table.
- The table must be designed to be append-only, with database-level permissions (e.g., denying UPDATE/DELETE) enforced for the application user.
- Every gRPC method that performs a state-changing action must create a record in this log as part of its transaction.

#### 1.2.4.5 Extraction Reasoning

This is a critical, explicitly stated responsibility of the Admin service. The repository description highlights this requirement, and the data flow specifies ownership of the 'AdminAuditLog' table.

### 1.2.5.0 Requirement Id

#### 1.2.5.1 Requirement Id

REQ-1-045

#### 1.2.5.2 Requirement Text

The Admin Dashboard shall provide an interface for managing system-level configurations. This must include the ability to enable or disable features using feature flags and to modify other application-wide settings without requiring a code deployment.

#### 1.2.5.3 Validation Criteria

- Verify an admin can view a list of available feature flags.
- Verify an admin can toggle a feature flag on or off.
- Verify that changing a feature flag's state correctly enables or disables the corresponding feature.

#### 1.2.5.4 Implementation Implications

- This service will own the data store for system configurations like feature flags.
- It will expose gRPC methods for reading and writing these configurations.
- All changes to configurations must be recorded in the Admin Audit Log.

#### 1.2.5.5 Extraction Reasoning

The repository description includes 'system configuration' as a core responsibility, and the scope boundaries explicitly mention feature flag management as an extension point.

## 1.3.0.0 Relevant Components

- {'component_name': 'Admin Service', 'component_specification': 'A backend microservice that implements the core business logic for all administrative functions. Its responsibilities include managing the content moderation queue, orchestrating moderation actions by calling other services, providing user management capabilities to admins, managing system configurations, and maintaining the immutable admin audit log.', 'implementation_requirements': ['Must be implemented using NestJS and TypeScript.', "All exposed methods must be protected by strict Role-Based Access Control (RBAC) guards, allowing access only to users with the 'Administrator' role.", "Must consume 'ContentReported' events asynchronously to populate its moderation queue.", "Must own and manage the 'ContentReport' and 'AdminAuditLog' PostgreSQL tables using Prisma.", 'Must act as a gRPC client to communicate commands to other services like the Identity and Posts services.'], 'architectural_context': "This component is a Business Logic microservice residing in the 'Application Services Layer'. It is an internal service, with its gRPC API consumed exclusively by the API Gateway.", 'extraction_reasoning': 'This component is the direct implementation of the platform-service-admin repository, encapsulating all of its specified logic and responsibilities.'}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Application Services Layer (Backend Microservices)', 'layer_responsibilities': 'This layer contains independent, business-capability-oriented microservices. Each service implements core business logic, exposes APIs (typically gRPC for internal communication), communicates with other services, and manages its own data persistence.', 'layer_constraints': ['Services in this layer should be independently deployable.', 'Communication between services should use well-defined contracts (gRPC, events).', "Services should not directly access each other's databases."], 'implementation_patterns': ['Microservices', 'Domain-Driven Design (DDD)', 'Event-Driven Architecture', 'Database per Service'], 'extraction_reasoning': "The platform-service-admin repository is explicitly mapped to the 'application-service-layer', and its responsibilities and communication patterns perfectly align with the definition of this architectural layer."}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

PostsService (gRPC)

#### 1.5.1.2 Source Repository

REPO-SVC-POSTS

#### 1.5.1.3 Method Contracts

- {'method_name': 'deletePostAsAdmin', 'method_signature': 'deletePostAsAdmin(request: { postId: string, adminId: string }): StatusResponse', 'method_purpose': 'To instruct the Posts service to permanently delete a post and its associated content as a result of an administrative moderation decision.', 'integration_context': "This method is called synchronously by the Admin service after an administrator confirms a 'Remove Content' action from the moderation dashboard."}

#### 1.5.1.4 Integration Pattern

Synchronous Request/Response via gRPC Client. The Admin service acts as an orchestrator, issuing a command to the Posts service.

#### 1.5.1.5 Communication Protocol

gRPC

#### 1.5.1.6 Extraction Reasoning

The repository's dependency contracts explicitly require this interface to fulfill the 'Remove Content' moderation action (REQ-1-042).

### 1.5.2.0 Interface Name

#### 1.5.2.1 Interface Name

IdentityService (gRPC)

#### 1.5.2.2 Source Repository

REPO-SVC-IDT

#### 1.5.2.3 Method Contracts

##### 1.5.2.3.1 Method Name

###### 1.5.2.3.1.1 Method Name

banUser

###### 1.5.2.3.1.2 Method Signature

banUser(request: { userId: string, adminId: string, reason: string }): StatusResponse

###### 1.5.2.3.1.3 Method Purpose

To instruct the Identity service to change a user's account status to 'banned', effectively preventing them from logging in or accessing the platform.

###### 1.5.2.3.1.4 Integration Context

This method is called synchronously by the Admin service when an administrator executes a 'Ban User' action from the moderation or user management dashboard.

##### 1.5.2.3.2.0 Method Name

###### 1.5.2.3.2.1 Method Name

suspendUser

###### 1.5.2.3.2.2 Method Signature

suspendUser(request: { userId: string, adminId: string, reason: string, durationSeconds: number }): StatusResponse

###### 1.5.2.3.2.3 Method Purpose

To instruct the Identity service to change a user's account status to 'suspended' for a specified duration.

###### 1.5.2.3.2.4 Integration Context

Called synchronously by the Admin service as part of the 'Temporarily Suspend' moderation action (REQ-1-042).

##### 1.5.2.3.3.0 Method Name

###### 1.5.2.3.3.1 Method Name

triggerPasswordResetForUser

###### 1.5.2.3.3.2 Method Signature

triggerPasswordResetForUser(request: { userId: string, adminId: string }): StatusResponse

###### 1.5.2.3.3.3 Method Purpose

To instruct the Identity service to initiate the standard password reset flow for a user.

###### 1.5.2.3.3.4 Integration Context

Called synchronously by the Admin service when an administrator triggers a password reset from the user management dashboard (REQ-1-043).

#### 1.5.2.4.0.0 Integration Pattern

Synchronous Request/Response via gRPC Client. The Admin service orchestrates user state changes by commanding the Identity service.

#### 1.5.2.5.0.0 Communication Protocol

gRPC

#### 1.5.2.6.0.0 Extraction Reasoning

The repository's dependency contracts explicitly require this interface to fulfill moderation actions (REQ-1-042) and user management tasks (REQ-1-043).

### 1.5.3.0.0.0 Interface Name

#### 1.5.3.1.0.0 Interface Name

ContentReported Event Consumer

#### 1.5.3.2.0.0 Source Repository

REPO-SVC-POSTS

#### 1.5.3.3.0.0 Method Contracts

- {'method_name': 'onContentReported', 'method_signature': "Handles event payload: { reporterId: string, contentId: string, contentType: 'POST' | 'COMMENT', reason: string, timestamp: string }", 'method_purpose': 'To receive notifications of newly reported content and create a corresponding entry in the local moderation queue database.', 'integration_context': "The service subscribes to an SQS queue which is a target for an SNS topic where the Posts service (and other content services) publish 'ContentReported' events."}

#### 1.5.3.4.0.0 Integration Pattern

Asynchronous Pub/Sub via Event Bus. The Admin service must implement an idempotent and resilient consumer for these events.

#### 1.5.3.5.0.0 Communication Protocol

AWS SNS/SQS

#### 1.5.3.6.0.0 Extraction Reasoning

The repository's integration patterns specify that it consumes 'ContentReported' events to populate its moderation queue, a core function related to REQ-1-041.

## 1.6.0.0.0.0 Exposed Interfaces

- {'interface_name': 'AdminService (gRPC)', 'consumer_repositories': ['REPO-GW-API'], 'method_contracts': [{'method_name': 'getModerationQueue', 'method_signature': 'getModerationQueue(request: PaginatedRequest): QueueResponse', 'method_purpose': 'Allows an authorized client (the API Gateway) to fetch a paginated and sortable list of content reports from the moderation queue.', 'implementation_requirements': "The implementation must query the local 'ContentReport' table and handle pagination and sorting parameters."}, {'method_name': 'takeModerationAction', 'method_signature': 'takeModerationAction(request: ActionRequest): ActionResponse', 'method_purpose': 'The primary entry point for an administrator to execute a moderation decision, such as dismissing a report, removing content, or banning a user.', 'implementation_requirements': "The method must be transactional, first creating an immutable record in the 'AdminAuditLog' table, and then orchestrating the action by making downstream gRPC calls to other services (e.g., PostsService, IdentityService)."}, {'method_name': 'getAuditLogs', 'method_signature': 'getAuditLogs(request: PaginatedRequest): AuditLogResponse', 'method_purpose': 'Allows an authorized client to fetch a paginated list of all actions performed by administrators.', 'implementation_requirements': "The implementation must query the 'AdminAuditLog' table and support pagination."}, {'method_name': 'getFeatureFlags', 'method_signature': 'getFeatureFlags(): FeatureFlagListResponse', 'method_purpose': 'Allows an authorized client to fetch the current state of all system feature flags.', 'implementation_requirements': "The implementation must query the 'FeatureFlag' table."}, {'method_name': 'updateFeatureFlag', 'method_signature': 'updateFeatureFlag(request: UpdateFlagRequest): FeatureFlagResponse', 'method_purpose': 'Allows an authorized client to enable or disable a specific feature flag.', 'implementation_requirements': "The implementation must update the state in the 'FeatureFlag' table and record the action in the 'AdminAuditLog'."}], 'service_level_requirements': ['Must have a P95 latency of < 500ms for all read operations.', 'Must provide 99.9% availability.'], 'implementation_constraints': ["All methods must enforce 'Administrator' Role-Based Access Control (RBAC) via a NestJS Guard.", 'All state-changing actions must be logged to the immutable audit log.'], 'extraction_reasoning': "The repository's exposed contracts define this gRPC interface as the sole entry point for the API Gateway to interact with the admin backend, fulfilling all administrative requirements from REQ-1-041 through REQ-1-045."}

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The service must be built using the NestJS framework on Node.js with TypeScript. It will use the @nestjs/microservices package for gRPC communication and Prisma as the ORM for PostgreSQL.

### 1.7.2.0.0.0 Integration Technologies

- gRPC for synchronous inter-service communication.
- Prisma for database access to a PostgreSQL database.
- AWS SQS for asynchronous event consumption.
- Shared libraries: REPO-LIB-CONTRACTS for API/event contracts and REPO-LIB-CORE for observability and security primitives.

### 1.7.3.0.0.0 Performance Constraints

The AdminAuditLog and ModerationQueue tables must be indexed by timestamp and relevant foreign keys to ensure performant querying as they grow.

### 1.7.4.0.0.0 Security Requirements

This is a high-value, privileged service. It must be deployed in a private subnet with strict network policies. All gRPC methods must have RBAC guards. All actions must be logged immutably to the audit log. The database user for this service should have append-only permissions on the audit log table.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | All requirements (REQ-1-041 to REQ-1-045) and resp... |
| Cross Reference Validation | All cross-references are validated. Requirements a... |
| Implementation Readiness Assessment | The context is highly implementation-ready. It pro... |
| Quality Assurance Confirmation | The extraction was performed systematically. All m... |

