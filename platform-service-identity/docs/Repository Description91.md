# 1 Id

REPO-SVC-IDT

# 2 Name

platform-service-identity

# 3 Description

This microservice is the authoritative source for user identity, authentication, and authorization within the platform. Its sole responsibility is to manage the entire user account lifecycle, as detailed in SRS section 1.1. This includes user registration (with email verification), secure login/logout, password hashing and management, and session management using JWTs. It also handles account status changes like deactivation and deletion requests. Extracted from the 'platform-api' monorepo, its isolation is critical for security. It owns the 'User' and related security tables in the database and is the only service that can mint or validate JWTs. All other services delegate authentication decisions to it, adhering to the principle of least privilege.

# 4 Type

🔹 Business Logic

# 5 Namespace

Platform.Services.Identity

# 6 Output Path

services/identity

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, TypeScript, gRPC, Prisma, PostgreSQL, Redis

# 10 Thirdparty Libraries

- @nestjs/microservices
- prisma
- bcrypt
- passport
- passport-jwt

# 11 Layer Ids

- application-service-layer

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-CORE

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-001

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-002

## 13.3.0 Requirement Id

### 13.3.1 Requirement Id

REQ-1-003

## 13.4.0 Requirement Id

### 13.4.1 Requirement Id

REQ-1-004

## 13.5.0 Requirement Id

### 13.5.1 Requirement Id

REQ-1-005

## 13.6.0 Requirement Id

### 13.6.1 Requirement Id

REQ-1-055

## 13.7.0 Requirement Id

### 13.7.1 Requirement Id

REQ-1-092

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservice

# 17.0.0 Architecture Map

- identity-access-service-002

# 18.0.0 Components Map

- identity-access-service-001

# 19.0.0 Requirements Map

- REQ-1-001

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-02-API

## 20.3.0 Decomposition Reasoning

Identity and access management is a fundamental, high-security concern. Isolating this logic into a dedicated microservice and repository minimizes its attack surface, clarifies ownership, and ensures that critical security operations can be developed, audited, and deployed with extreme care, independent of other feature development.

## 20.4.0 Extracted Responsibilities

- User registration and credential management
- Password hashing and comparison
- JWT generation, validation, and revocation
- Account lifecycle management (deactivation, deletion)

## 20.5.0 Reusability Scope

- The core authentication logic could potentially be reused by other systems within the organization.

## 20.6.0 Development Benefits

- Allows a specialized security/identity team to own the component.
- Reduces the risk of security vulnerabilities being introduced by developers working on other features.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Svc-Notify

### 21.1.1 Required Interfaces

*No items available*

### 21.1.2 Integration Pattern

Publishes 'UserRegistered' and 'PasswordResetRequested' events.

### 21.1.3 Communication Protocol

Event Bus (SNS/SQS)

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'IdentityService (gRPC)', 'methods': ['registerUser(RegisterRequest) : UserResponse', 'login(LoginRequest) : JwtResponse', 'validateToken(TokenRequest) : ValidationResponse'], 'events': ['UserRegistered(userId, email)', 'AccountDeleted(userId)'], 'properties': [], 'consumers': ['REPO-GW-API']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Utilizes NestJS DI for managing database clients, ... |
| Event Communication | Publishes domain events like 'UserRegistered' to a... |
| Data Flow | Owns and manages the User, Role, and UserToken tab... |
| Error Handling | Throws specific gRPC error codes for authenticatio... |
| Async Patterns | Asynchronous event publishing after successful dat... |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Implement authentication logic using Passport.js w... |
| Performance Considerations | Login and token validation are on the critical pat... |
| Security Considerations | This is the most security-critical service. Use bc... |
| Testing Approach | Rigorous unit and integration testing of all authe... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- All authentication logic (registration, login, password reset).
- Secure JWT management, including a revocation list in Redis (REQ-1-005).
- Account deletion process with grace period (REQ-1-007).

## 25.2.0 Must Not Implement

- User profile data (name, headline, experience).
- Any business logic unrelated to identity.

## 25.3.0 Extension Points

- Adding new authentication methods (e.g., OAuth with Google/GitHub).
- Implementing Multi-Factor Authentication (MFA) (REQ-1-055).

## 25.4.0 Validation Rules

- Password complexity rules (REQ-1-002).
- Email format and uniqueness.

