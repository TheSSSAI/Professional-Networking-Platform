# 1 Id

REPO-SVC-ADMIN

# 2 Name

platform-service-admin

# 3 Description

This microservice provides the backend functionality for the administrative dashboard, as specified in SRS section 1.8. It is a highly privileged service responsible for content moderation, user management, and system configuration. Its core features include processing the user-reported content queue, allowing administrators to take actions (dismiss, remove, ban), and managing user accounts. A critical responsibility of this service is to record every action taken by an administrator into an immutable audit log for accountability (REQ-1-044). Decomposed from the 'platform-api' monorepo, its isolation is paramount for security and auditability. It communicates with other services via gRPC to enact its decisions (e.g., telling the Posts service to delete content).

# 4 Type

🔹 Business Logic

# 5 Namespace

Platform.Services.Admin

# 6 Output Path

services/admin

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
- REPO-SVC-IDT
- REPO-SVC-POSTS

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-041

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-042

## 13.3.0 Requirement Id

### 13.3.1 Requirement Id

REQ-1-043

## 13.4.0 Requirement Id

### 13.4.1 Requirement Id

REQ-1-044

## 13.5.0 Requirement Id

### 13.5.1 Requirement Id

REQ-1-045

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservice

# 17.0.0 Architecture Map

- admin-service-011

# 18.0.0 Components Map

- admin-service-010

# 19.0.0 Requirements Map

- REQ-1-041

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-02-API

## 20.3.0 Decomposition Reasoning

Administrative functions carry elevated privileges and present a significant security risk. Isolating them in a dedicated service allows for stringent access controls (network policies, IAM roles), focused security audits, and ensures that this powerful functionality is completely decoupled from the public-facing application logic.

## 20.4.0 Extracted Responsibilities

- Managing the content moderation queue.
- Executing moderation actions (remove content, ban user).
- Providing user management capabilities to admins.
- Maintaining the immutable admin audit log.

## 20.5.0 Reusability Scope

- This service is highly specific to the platform's administrative needs.

## 20.6.0 Development Benefits

- Enforces the Principle of Least Privilege in the architecture.
- Creates a clear, auditable trail for all privileged operations.
- Protects core services from potential vulnerabilities in admin-facing code.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Svc-Posts

### 21.1.1 Required Interfaces

- {'interface': 'PostsService (gRPC)', 'methods': ['deletePostAsAdmin(AdminDeleteRequest) : StatusResponse'], 'events': [], 'properties': []}

### 21.1.2 Integration Pattern

Calls other services to execute moderation decisions.

### 21.1.3 Communication Protocol

gRPC

## 21.2.0 Repo-Svc-Idt

### 21.2.1 Required Interfaces

- {'interface': 'IdentityService (gRPC)', 'methods': ['banUser(AdminBanRequest) : StatusResponse'], 'events': [], 'properties': []}

### 21.2.2 Integration Pattern

Calls the Identity service to change a user's account status.

### 21.2.3 Communication Protocol

gRPC

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'AdminService (gRPC)', 'methods': ['getModerationQueue(QueueRequest) : QueueResponse', 'takeModerationAction(ActionRequest) : ActionResponse'], 'events': [], 'properties': [], 'consumers': ['REPO-GW-API']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Consumes 'ContentReported' events to populate its ... |
| Data Flow | Owns the 'ContentReport' and 'AdminAuditLog' table... |
| Error Handling | Returns PERMISSION_DENIED if a non-admin user atte... |
| Async Patterns | Consumes events asynchronously. |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Implement strict Role-Based Access Control (RBAC) ... |
| Performance Considerations | The audit log table can grow large. Ensure it is p... |
| Security Considerations | This service is a high-value target. It should be ... |
| Testing Approach | Test RBAC rules extensively. Verify that every act... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- A content moderation queue.
- Actions to remove content and ban users.
- An immutable audit log for all admin actions.
- Strict administrator-only access control.

## 25.2.0 Must Not Implement

- Any user-facing features.
- The logic for reporting content (it only consumes the report event).

## 25.3.0 Extension Points

- Adding system-level configuration management (e.g., feature flags).
- Adding more granular admin roles (e.g., 'Moderator', 'SuperAdmin').

## 25.4.0 Validation Rules

*No items available*

