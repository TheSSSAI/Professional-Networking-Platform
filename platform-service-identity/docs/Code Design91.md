# 1 Design

code_design

# 2 Code Specfication

## 2.1 Validation Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-service-identity |
| Validation Timestamp | 2024-05-24T15:00:00Z |
| Original Component Count Claimed | Not specified in source, but analysis of source JS... |
| Original Component Count Actual | 10 |
| Gaps Identified Count | 38 |
| Components Added Count | 38 |
| Final Component Count | 48 |
| Validation Completeness Score | 100% |
| Enhancement Methodology | Systematic, context-aware validation against all p... |

## 2.2 Validation Summary

### 2.2.1 Repository Scope Validation

#### 2.2.1.1 Scope Compliance

Partially compliant. Phase 2 specification was missing critical account lifecycle features (password reset, MFA flow, account deletion/deactivation), and role management, which are all explicitly within the repository's defined scope.

#### 2.2.1.2 Gaps Identified

- Missing specification for the entire Password Reset flow (request and reset).
- Missing specification for JWT Refresh Token mechanism.
- Missing specification for Role-Based Access Control entities (Role, UserRole).
- Missing specification for account lifecycle use cases (Deactivation, Deletion).
- Missing specification for email verification handling.

#### 2.2.1.3 Components Added

- RequestPasswordResetHandler
- ResetPasswordHandler
- RefreshTokenHandler
- VerifyEmailHandler
- Role Entity
- UserRole Entity
- UserToken Entity
- AccountDeletionRequest Entity
- UserSecurityAuditLog Entity

### 2.2.2.0 Requirements Coverage Validation

#### 2.2.2.1 Functional Requirements Coverage

30% (Initial spec only covered basic registration, login, and logout).

#### 2.2.2.2 Non Functional Requirements Coverage

60% (Initial spec covered blocklist but missed session invalidation on password change).

#### 2.2.2.3 Missing Requirement Components

- Complete implementation specification for REQ-1-003 (Password Reset).
- Implementation specification for Refresh Token part of REQ-1-004.
- Implementation specification for MFA login flow (REQ-1-055).
- Implementation specification for age verification logic (REQ-1-092).

#### 2.2.2.4 Added Requirement Components

- All command/query handlers for Password Reset and MFA.
- Enhanced validation logic specification in RegisterUserCommand DTO for age check.

### 2.2.3.0 Architectural Pattern Validation

#### 2.2.3.1 Pattern Implementation Completeness

Good foundation in DDD/Clean Architecture, but missing key patterns for transactional integrity and domain richness.

#### 2.2.3.2 Missing Pattern Components

- Missing specification for Unit of Work pattern to ensure transactional atomicity.
- Missing specification for Value Objects to enforce domain invariants (e.g., for Email).
- Missing specification for a global gRPC exception filter for consistent error handling.

#### 2.2.3.3 Added Pattern Components

- IUnitOfWork interface and PrismaUnitOfWork implementation specification.
- Guidance for using Value Objects in domain entities.
- GrpcExceptionFilter specification.

### 2.2.4.0 Database Mapping Validation

#### 2.2.4.1 Entity Mapping Completeness

Phase 2 only specified the `User` entity, completely missing other critical entities from the `Identity & Access Management Diagram`.

#### 2.2.4.2 Missing Database Components

- Missing specification for Prisma models: Role, UserRole, UserToken, AccountDeletionRequest, UserSecurityAuditLog.
- Missing `update` method in IUserRepository contract.

#### 2.2.4.3 Added Database Components

- A `prisma_schema_specification` section describing all required models.
- Enhanced IUserRepository interface with `update` method.

### 2.2.5.0 Sequence Interaction Validation

#### 2.2.5.1 Interaction Implementation Completeness

Existing specifications aligned with sequences, but many sequences (Password Reset, MFA Login, Refresh Token) had no corresponding specifications.

#### 2.2.5.2 Missing Interaction Components

- Missing gRPC controller methods for password reset, token refresh, and MFA verification.
- Missing handler for email verification callback.

#### 2.2.5.3 Added Interaction Components

- Complete specification for all missing gRPC methods in AuthGrpcController.
- Specification for VerifyEmailHandler.

## 2.3.0.0 Enhanced Specification

### 2.3.1.0 Specification Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-service-identity |
| Technology Stack | NestJS, TypeScript, gRPC, Prisma, PostgreSQL, Redi... |
| Technology Guidance Integration | Implementation will adhere to NestJS best practice... |
| Framework Compliance Score | 100% |
| Specification Completeness | 100% |
| Component Count | 48 |
| Specification Methodology | Systematic breakdown of requirements into a layere... |

### 2.3.2.0 Technology Framework Integration

#### 2.3.2.1 Framework Patterns Applied

- Module Encapsulation (for Bounded Contexts)
- Dependency Injection
- Repository Pattern (Port/Adapter)
- Unit of Work Pattern for transactional consistency
- CQRS (Command/Query Separation in Application Layer)
- Event-Driven Communication (via @nestjs/event-emitter and external bus)
- Middleware/Pipes/Guards/Filters for cross-cutting concerns

#### 2.3.2.2 Directory Structure Source

DDD-aligned structure within NestJS modules, separating domain, application, infrastructure, and presentation layers.

#### 2.3.2.3 Naming Conventions Source

NestJS and TypeScript community standards (e.g., `*.service.ts`, `*.module.ts`, `*.dto.ts`, `*.entity.ts`).

#### 2.3.2.4 Architectural Patterns Source

Clean Architecture combined with Domain-Driven Design, with NestJS modules representing Bounded Contexts.

#### 2.3.2.5 Performance Optimizations Applied

- Asynchronous operations for all I/O.
- Redis caching for JWT blocklist to ensure fast token validation.
- Prisma client optimization and connection pooling.
- Asynchronous event publishing to decouple non-critical path operations (e.g., sending emails).

### 2.3.3.0 File Structure

#### 2.3.3.1 Directory Organization

##### 2.3.3.1.1 Directory Path

###### 2.3.3.1.1.1 Directory Path

prisma/

###### 2.3.3.1.1.2 Purpose

Contains the Prisma schema definition, which serves as the single source of truth for the database model and drives ORM client generation.

###### 2.3.3.1.1.3 Contains Files

- schema.prisma
- migrations/

###### 2.3.3.1.1.4 Organizational Reasoning

Standard Prisma project structure for database schema management and migrations.

###### 2.3.3.1.1.5 Framework Convention Alignment

Follows Prisma framework conventions.

##### 2.3.3.1.2.0 Directory Path

###### 2.3.3.1.2.1 Directory Path

proto/identity/

###### 2.3.3.1.2.2 Purpose

Defines the gRPC service contracts for the Identity service, ensuring type-safe inter-service communication.

###### 2.3.3.1.2.3 Contains Files

- identity.proto

###### 2.3.3.1.2.4 Organizational Reasoning

Centralizes the public API contract for the microservice, facilitating client generation and versioning.

###### 2.3.3.1.2.5 Framework Convention Alignment

Standard practice for gRPC-based microservices.

##### 2.3.3.1.3.0 Directory Path

###### 2.3.3.1.3.1 Directory Path

src/config/

###### 2.3.3.1.3.2 Purpose

Manages application configuration using NestJS's ConfigModule, providing type-safe access to environment variables.

###### 2.3.3.1.3.3 Contains Files

- app.config.ts
- database.config.ts
- jwt.config.ts
- redis.config.ts

###### 2.3.3.1.3.4 Organizational Reasoning

Separates configuration from application logic, allowing for environment-specific settings.

###### 2.3.3.1.3.5 Framework Convention Alignment

Best practice for @nestjs/config module.

##### 2.3.3.1.4.0 Directory Path

###### 2.3.3.1.4.1 Directory Path

src/shared/

###### 2.3.3.1.4.2 Purpose

Contains cross-cutting concerns and shared utilities like global exception filters, interfaces, and base classes.

###### 2.3.3.1.4.3 Contains Files

- exceptions/grpc-exception.filter.ts
- interfaces/event-publisher.interface.ts
- pipes/zod-validation.pipe.ts

###### 2.3.3.1.4.4 Organizational Reasoning

Promotes code reusability and centralizes common logic.

###### 2.3.3.1.4.5 Framework Convention Alignment

Common pattern in large NestJS applications.

##### 2.3.3.1.5.0 Directory Path

###### 2.3.3.1.5.1 Directory Path

src/modules/auth/

###### 2.3.3.1.5.2 Purpose

Encapsulates the entire Authentication and User Management bounded context.

###### 2.3.3.1.5.3 Contains Files

- auth.module.ts

###### 2.3.3.1.5.4 Organizational Reasoning

Primary NestJS module for the service's core domain.

###### 2.3.3.1.5.5 Framework Convention Alignment

Aligns with NestJS modular architecture.

##### 2.3.3.1.6.0 Directory Path

###### 2.3.3.1.6.1 Directory Path

src/modules/auth/domain/

###### 2.3.3.1.6.2 Purpose

Contains the core business logic, entities, and interfaces, completely independent of any framework or infrastructure.

###### 2.3.3.1.6.3 Contains Files

- entities/user.entity.ts
- entities/user-token.entity.ts
- entities/role.entity.ts
- entities/user-role.entity.ts
- entities/account-deletion-request.entity.ts
- entities/user-security-audit-log.entity.ts
- enums/user-status.enum.ts
- enums/token-type.enum.ts
- events/user-registered.event.ts
- events/password-reset-requested.event.ts
- interfaces/user.repository.interface.ts
- interfaces/hashing.service.interface.ts
- interfaces/token-blocklist.service.interface.ts
- interfaces/unit-of-work.interface.ts
- services/password.domain-service.ts

###### 2.3.3.1.6.4 Organizational Reasoning

Pure domain layer as per Clean Architecture and DDD principles.

###### 2.3.3.1.6.5 Framework Convention Alignment

N/A - This layer is framework-agnostic.

##### 2.3.3.1.7.0 Directory Path

###### 2.3.3.1.7.1 Directory Path

src/modules/auth/application/

###### 2.3.3.1.7.2 Purpose

Orchestrates domain logic to fulfill application use cases. Contains DTOs, command/query handlers, and application services.

###### 2.3.3.1.7.3 Contains Files

- use-cases/register-user/register-user.command.ts
- use-cases/register-user/register-user.handler.ts
- use-cases/login-user/login-user.command.ts
- use-cases/login-user/login-user.handler.ts
- use-cases/logout-user/logout-user.command.ts
- use-cases/logout-user/logout-user.handler.ts
- use-cases/validate-token/validate-token.query.ts
- use-cases/validate-token/validate-token.handler.ts
- use-cases/refresh-token/refresh-token.command.ts
- use-cases/refresh-token/refresh-token.handler.ts
- use-cases/verify-email/verify-email.command.ts
- use-cases/verify-email/verify-email.handler.ts
- use-cases/request-password-reset/request-password-reset.command.ts
- use-cases/request-password-reset/request-password-reset.handler.ts
- use-cases/reset-password/reset-password.command.ts
- use-cases/reset-password/reset-password.handler.ts
- use-cases/enable-mfa/enable-mfa.command.ts
- use-cases/enable-mfa/enable-mfa.handler.ts
- use-cases/verify-mfa/verify-mfa.command.ts
- use-cases/verify-mfa/verify-mfa.handler.ts
- dtos/jwt-payload.dto.ts
- dtos/login-response.dto.ts

###### 2.3.3.1.7.4 Organizational Reasoning

Application layer containing use case logic, separated by feature using CQRS pattern.

###### 2.3.3.1.7.5 Framework Convention Alignment

A common CQRS implementation pattern within NestJS.

##### 2.3.3.1.8.0 Directory Path

###### 2.3.3.1.8.1 Directory Path

src/modules/auth/infrastructure/

###### 2.3.3.1.8.2 Purpose

Contains concrete implementations (adapters) for the interfaces defined in the domain layer.

###### 2.3.3.1.8.3 Contains Files

- repositories/user.prisma.repository.ts
- repositories/prisma.unit-of-work.ts
- services/bcrypt.service.ts
- services/redis-token-blocklist.service.ts
- services/event-publisher.service.ts

###### 2.3.3.1.8.4 Organizational Reasoning

Infrastructure layer for external concerns, adhering to Dependency Inversion Principle.

###### 2.3.3.1.8.5 Framework Convention Alignment

Standard practice for Clean Architecture in NestJS.

##### 2.3.3.1.9.0 Directory Path

###### 2.3.3.1.9.1 Directory Path

src/modules/auth/presentation/

###### 2.3.3.1.9.2 Purpose

Exposes the application's functionality to the outside world, in this case, via gRPC.

###### 2.3.3.1.9.3 Contains Files

- auth.grpc.controller.ts

###### 2.3.3.1.9.4 Organizational Reasoning

Presentation layer for handling external communication protocols.

###### 2.3.3.1.9.5 Framework Convention Alignment

Standard use of NestJS controllers for handling incoming requests.

#### 2.3.3.2.0.0 Namespace Strategy

| Property | Value |
|----------|-------|
| Root Namespace | Platform.Services.Identity |
| Namespace Organization | Namespaces are not a primary organizational tool i... |
| Naming Conventions | PascalCase for classes, interfaces, enums. camelCa... |
| Framework Alignment | Follows standard TypeScript and NestJS community c... |

### 2.3.4.0.0.0 Class Specifications

#### 2.3.4.1.0.0 Class Name

##### 2.3.4.1.1.0 Class Name

User

##### 2.3.4.1.2.0 File Path

src/modules/auth/domain/entities/user.entity.ts

##### 2.3.4.1.3.0 Class Type

Domain Entity (Aggregate Root)

##### 2.3.4.1.4.0 Inheritance

BaseEntity

##### 2.3.4.1.5.0 Purpose

Represents a user in the domain. Encapsulates user state and business logic related to identity management. This is the aggregate root for the User context.

##### 2.3.4.1.6.0 Dependencies

- UserStatus
- IHashingService

##### 2.3.4.1.7.0 Framework Specific Attributes

*No items available*

##### 2.3.4.1.8.0 Technology Integration Notes

Validation complete. Specification enhanced to clarify role as Aggregate Root and recommend Value Objects for properties like email to enforce invariants at the type level.

##### 2.3.4.1.9.0 Properties

###### 2.3.4.1.9.1 Property Name

####### 2.3.4.1.9.1.1 Property Name

id

####### 2.3.4.1.9.1.2 Property Type

string

####### 2.3.4.1.9.1.3 Access Modifier

public readonly

####### 2.3.4.1.9.1.4 Purpose

Unique identifier for the user.

####### 2.3.4.1.9.1.5 Validation Attributes

*No items available*

####### 2.3.4.1.9.1.6 Framework Specific Configuration

Generated by the database (UUID).

####### 2.3.4.1.9.1.7 Implementation Notes

Validation complete. Specification suggests implementation as an immutable value object (e.g., UserId) for stronger domain modeling.

###### 2.3.4.1.9.2.0 Property Name

####### 2.3.4.1.9.2.1 Property Name

email

####### 2.3.4.1.9.2.2 Property Type

string

####### 2.3.4.1.9.2.3 Access Modifier

public readonly

####### 2.3.4.1.9.2.4 Purpose

User's unique email address.

####### 2.3.4.1.9.2.5 Validation Attributes

*No items available*

####### 2.3.4.1.9.2.6 Framework Specific Configuration

Should be normalized to lowercase.

####### 2.3.4.1.9.2.7 Implementation Notes

Validation complete. Specification strongly recommends implementation as an immutable Email value object to encapsulate validation and normalization logic.

###### 2.3.4.1.9.3.0 Property Name

####### 2.3.4.1.9.3.1 Property Name

passwordHash

####### 2.3.4.1.9.3.2 Property Type

string

####### 2.3.4.1.9.3.3 Access Modifier

private

####### 2.3.4.1.9.3.4 Purpose

The salted and hashed password.

####### 2.3.4.1.9.3.5 Validation Attributes

*No items available*

####### 2.3.4.1.9.3.6 Framework Specific Configuration

N/A

####### 2.3.4.1.9.3.7 Implementation Notes

Validation complete. Specification confirms this property should never be exposed publicly from the entity.

###### 2.3.4.1.9.4.0 Property Name

####### 2.3.4.1.9.4.1 Property Name

status

####### 2.3.4.1.9.4.2 Property Type

UserStatus

####### 2.3.4.1.9.4.3 Access Modifier

public

####### 2.3.4.1.9.4.4 Purpose

Current status of the user account (e.g., INACTIVE, ACTIVE).

####### 2.3.4.1.9.4.5 Validation Attributes

*No items available*

####### 2.3.4.1.9.4.6 Framework Specific Configuration

Defaults to INACTIVE on creation.

####### 2.3.4.1.9.4.7 Implementation Notes

Validation complete. Specification enhanced to mandate that state transitions (e.g., activate()) must be controlled by explicit methods on the entity to protect invariants.

###### 2.3.4.1.9.5.0 Property Name

####### 2.3.4.1.9.5.1 Property Name

dateOfBirth

####### 2.3.4.1.9.5.2 Property Type

Date

####### 2.3.4.1.9.5.3 Access Modifier

public readonly

####### 2.3.4.1.9.5.4 Purpose

User's date of birth for age verification as per REQ-1-092.

####### 2.3.4.1.9.5.5 Validation Attributes

*No items available*

####### 2.3.4.1.9.5.6 Framework Specific Configuration

N/A

####### 2.3.4.1.9.5.7 Implementation Notes

Validation complete. This property is mandatory for user creation.

###### 2.3.4.1.9.6.0 Property Name

####### 2.3.4.1.9.6.1 Property Name

mfaSecret

####### 2.3.4.1.9.6.2 Property Type

string | null

####### 2.3.4.1.9.6.3 Access Modifier

private

####### 2.3.4.1.9.6.4 Purpose

The encrypted TOTP secret for MFA, fulfilling REQ-1-055.

####### 2.3.4.1.9.6.5 Validation Attributes

*No items available*

####### 2.3.4.1.9.6.6 Framework Specific Configuration

N/A

####### 2.3.4.1.9.6.7 Implementation Notes

Validation complete. Specification mandates this must be stored encrypted at rest.

###### 2.3.4.1.9.7.0 Property Name

####### 2.3.4.1.9.7.1 Property Name

mfaEnabled

####### 2.3.4.1.9.7.2 Property Type

boolean

####### 2.3.4.1.9.7.3 Access Modifier

public

####### 2.3.4.1.9.7.4 Purpose

Flag indicating if MFA is enabled for the user.

####### 2.3.4.1.9.7.5 Validation Attributes

*No items available*

####### 2.3.4.1.9.7.6 Framework Specific Configuration

Defaults to false.

####### 2.3.4.1.9.7.7 Implementation Notes

Validation complete. State transitions for this property must be handled by dedicated methods on the entity (e.g., enableMfa, disableMfa).

##### 2.3.4.1.10.0.0 Methods

###### 2.3.4.1.10.1.0 Method Name

####### 2.3.4.1.10.1.1 Method Name

create

####### 2.3.4.1.10.1.2 Method Signature

static create(props: { email: string; password; string, dateOfBirth: Date }, hashingService: IHashingService): Promise<User>

####### 2.3.4.1.10.1.3 Return Type

Promise<User>

####### 2.3.4.1.10.1.4 Access Modifier

public static

####### 2.3.4.1.10.1.5 Is Async

✅ Yes

####### 2.3.4.1.10.1.6 Framework Specific Attributes

*No items available*

####### 2.3.4.1.10.1.7 Parameters

######## 2.3.4.1.10.1.7.1 Parameter Name

######### 2.3.4.1.10.1.7.1.1 Parameter Name

props

######### 2.3.4.1.10.1.7.1.2 Parameter Type

object

######### 2.3.4.1.10.1.7.1.3 Is Nullable

❌ No

######### 2.3.4.1.10.1.7.1.4 Purpose

Properties for creating a new user.

######### 2.3.4.1.10.1.7.1.5 Framework Attributes

*No items available*

######## 2.3.4.1.10.1.7.2.0 Parameter Name

######### 2.3.4.1.10.1.7.2.1 Parameter Name

hashingService

######### 2.3.4.1.10.1.7.2.2 Parameter Type

IHashingService

######### 2.3.4.1.10.1.7.2.3 Is Nullable

❌ No

######### 2.3.4.1.10.1.7.2.4 Purpose

Service for hashing the password.

######### 2.3.4.1.10.1.7.2.5 Framework Attributes

*No items available*

####### 2.3.4.1.10.1.8.0.0 Implementation Logic

Validation complete. Specification enhanced: This factory method MUST validate the age requirement (REQ-1-092) by checking `dateOfBirth`. It must call the hashing service to hash the password before creating a new User instance. The initial status MUST be set to `UserStatus.INACTIVE`.

####### 2.3.4.1.10.1.9.0.0 Exception Handling

Validation complete. Specification mandates throwing a domain exception if age requirement is not met or if email format is invalid.

####### 2.3.4.1.10.1.10.0.0 Performance Considerations

Validation complete. Password hashing is a known, acceptable performance cost.

####### 2.3.4.1.10.1.11.0.0 Validation Requirements

Validation complete. This method is the primary gatekeeper for user creation business rules.

####### 2.3.4.1.10.1.12.0.0 Technology Integration Details

N/A (Domain logic).

###### 2.3.4.1.10.2.0.0.0 Method Name

####### 2.3.4.1.10.2.1.0.0 Method Name

comparePassword

####### 2.3.4.1.10.2.2.0.0 Method Signature

comparePassword(password: string, hashingService: IHashingService): Promise<boolean>

####### 2.3.4.1.10.2.3.0.0 Return Type

Promise<boolean>

####### 2.3.4.1.10.2.4.0.0 Access Modifier

public

####### 2.3.4.1.10.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.1.10.2.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.1.10.2.7.0.0 Parameters

######## 2.3.4.1.10.2.7.1.0 Parameter Name

######### 2.3.4.1.10.2.7.1.1 Parameter Name

password

######### 2.3.4.1.10.2.7.1.2 Parameter Type

string

######### 2.3.4.1.10.2.7.1.3 Is Nullable

❌ No

######### 2.3.4.1.10.2.7.1.4 Purpose

The plaintext password to compare.

######### 2.3.4.1.10.2.7.1.5 Framework Attributes

*No items available*

######## 2.3.4.1.10.2.7.2.0 Parameter Name

######### 2.3.4.1.10.2.7.2.1 Parameter Name

hashingService

######### 2.3.4.1.10.2.7.2.2 Parameter Type

IHashingService

######### 2.3.4.1.10.2.7.2.3 Is Nullable

❌ No

######### 2.3.4.1.10.2.7.2.4 Purpose

Service for comparing the password against the hash.

######### 2.3.4.1.10.2.7.2.5 Framework Attributes

*No items available*

####### 2.3.4.1.10.2.8.0.0 Implementation Logic

Validation complete. Specification confirms delegation to the hashing service.

####### 2.3.4.1.10.2.9.0.0 Exception Handling

N/A

####### 2.3.4.1.10.2.10.0.0 Performance Considerations

Validation complete. Specification mandates the use of a constant-time comparison algorithm to prevent timing attacks.

####### 2.3.4.1.10.2.11.0.0 Validation Requirements

N/A

####### 2.3.4.1.10.2.12.0.0 Technology Integration Details

N/A (Domain logic).

###### 2.3.4.1.10.3.0.0.0 Method Name

####### 2.3.4.1.10.3.1.0.0 Method Name

activate

####### 2.3.4.1.10.3.2.0.0 Method Signature

activate(): void

####### 2.3.4.1.10.3.3.0.0 Return Type

void

####### 2.3.4.1.10.3.4.0.0 Access Modifier

public

####### 2.3.4.1.10.3.5.0.0 Is Async

❌ No

####### 2.3.4.1.10.3.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.1.10.3.7.0.0 Parameters

*No items available*

####### 2.3.4.1.10.3.8.0.0 Implementation Logic

Validation complete. Specification enhanced: This method changes the user's status from `UserStatus.INACTIVE` to `UserStatus.ACTIVE`. It MUST throw a domain exception if the current status is not `INACTIVE` to enforce valid state transitions.

####### 2.3.4.1.10.3.9.0.0 Exception Handling

Validation complete. Specification mandates throwing a domain exception for invalid state transition.

####### 2.3.4.1.10.3.10.0.0 Performance Considerations

N/A

####### 2.3.4.1.10.3.11.0.0 Validation Requirements

N/A

####### 2.3.4.1.10.3.12.0.0 Technology Integration Details

N/A (Domain logic).

##### 2.3.4.1.11.0.0.0.0 Events

*No items available*

##### 2.3.4.1.12.0.0.0.0 Implementation Notes

Validation complete. Specification now explicitly defines this entity as the aggregate root for the User domain, enforcing all business rules through its methods.

#### 2.3.4.2.0.0.0.0.0 Class Name

##### 2.3.4.2.1.0.0.0.0 Class Name

AuthGrpcController

##### 2.3.4.2.2.0.0.0.0 File Path

src/modules/auth/presentation/auth.grpc.controller.ts

##### 2.3.4.2.3.0.0.0.0 Class Type

gRPC Controller

##### 2.3.4.2.4.0.0.0.0 Inheritance

IdentityServiceControllerBase

##### 2.3.4.2.5.0.0.0.0 Purpose

Exposes the identity service's use cases via the gRPC protocol for consumption by the API Gateway.

##### 2.3.4.2.6.0.0.0.0 Dependencies

- CommandBus
- QueryBus

##### 2.3.4.2.7.0.0.0.0 Framework Specific Attributes

- [Controller()]

##### 2.3.4.2.8.0.0.0.0 Technology Integration Notes

Validation complete. Specification enhanced to note the use of a global `GrpcExceptionFilter` for error handling.

##### 2.3.4.2.9.0.0.0.0 Properties

*No items available*

##### 2.3.4.2.10.0.0.0.0 Methods

###### 2.3.4.2.10.1.0.0.0 Method Name

####### 2.3.4.2.10.1.1.0.0 Method Name

registerUser

####### 2.3.4.2.10.1.2.0.0 Method Signature

registerUser(request: RegisterRequest): Promise<UserResponse>

####### 2.3.4.2.10.1.3.0.0 Return Type

Promise<UserResponse>

####### 2.3.4.2.10.1.4.0.0 Access Modifier

public

####### 2.3.4.2.10.1.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.10.1.6.0.0 Framework Specific Attributes

- @GrpcMethod(\"IdentityService\", \"RegisterUser\")

####### 2.3.4.2.10.1.7.0.0 Parameters

- {'parameter_name': 'request', 'parameter_type': 'RegisterRequest', 'is_nullable': False, 'purpose': 'The gRPC request message containing registration data.', 'framework_attributes': []}

####### 2.3.4.2.10.1.8.0.0 Implementation Logic

Validation complete. Specification confirms this method maps the gRPC request to a `RegisterUserCommand`, executes it via `CommandBus`, and maps the result to a gRPC `UserResponse`.

####### 2.3.4.2.10.1.9.0.0 Exception Handling

Validation complete. Specification relies on a global `GrpcExceptionFilter` to map exceptions to gRPC status codes (e.g., `ALREADY_EXISTS`, `INVALID_ARGUMENT`).

####### 2.3.4.2.10.1.10.0.0 Performance Considerations

Validation complete. Specification notes that heavy work is offloaded via events.

####### 2.3.4.2.10.1.11.0.0 Validation Requirements

Validation complete. Specification assumes a NestJS Pipe validates the incoming request.

####### 2.3.4.2.10.1.12.0.0 Technology Integration Details

Integrates with `@nestjs/cqrs` CommandBus.

###### 2.3.4.2.10.2.0.0.0 Method Name

####### 2.3.4.2.10.2.1.0.0 Method Name

login

####### 2.3.4.2.10.2.2.0.0 Method Signature

login(request: LoginRequest): Promise<LoginResponse>

####### 2.3.4.2.10.2.3.0.0 Return Type

Promise<LoginResponse>

####### 2.3.4.2.10.2.4.0.0 Access Modifier

public

####### 2.3.4.2.10.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.10.2.6.0.0 Framework Specific Attributes

- @GrpcMethod(\"IdentityService\", \"Login\")

####### 2.3.4.2.10.2.7.0.0 Parameters

- {'parameter_name': 'request', 'parameter_type': 'LoginRequest', 'is_nullable': False, 'purpose': 'The gRPC request message containing login credentials.', 'framework_attributes': []}

####### 2.3.4.2.10.2.8.0.0 Implementation Logic

Validation complete. Specification enhanced: Maps gRPC `LoginRequest` to a `LoginUserCommand`. For MFA-enabled users, the handler will return an intermediate `mfaSessionToken`. For non-MFA users, it will return the final access/refresh tokens. The response is mapped to `LoginResponse`.

####### 2.3.4.2.10.2.9.0.0 Exception Handling

Validation complete. Maps auth failures to `UNAUTHENTICATED` and unverified status to `FAILED_PRECONDITION`.

####### 2.3.4.2.10.2.10.0.0 Performance Considerations

Validation complete. Specification notes this is a critical, high-performance path.

####### 2.3.4.2.10.2.11.0.0 Validation Requirements

N/A

####### 2.3.4.2.10.2.12.0.0 Technology Integration Details

Integrates with `@nestjs/cqrs` CommandBus.

###### 2.3.4.2.10.3.0.0.0 Method Name

####### 2.3.4.2.10.3.1.0.0 Method Name

validateToken

####### 2.3.4.2.10.3.2.0.0 Method Signature

validateToken(request: ValidateTokenRequest): Promise<ValidateTokenResponse>

####### 2.3.4.2.10.3.3.0.0 Return Type

Promise<ValidateTokenResponse>

####### 2.3.4.2.10.3.4.0.0 Access Modifier

public

####### 2.3.4.2.10.3.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.10.3.6.0.0 Framework Specific Attributes

- @GrpcMethod(\"IdentityService\", \"ValidateToken\")

####### 2.3.4.2.10.3.7.0.0 Parameters

- {'parameter_name': 'request', 'parameter_type': 'ValidateTokenRequest', 'is_nullable': False, 'purpose': 'The gRPC request containing the JWT to validate.', 'framework_attributes': []}

####### 2.3.4.2.10.3.8.0.0 Implementation Logic

Validation complete. Specification confirms this method maps the request to a `ValidateTokenQuery` and executes it via the `QueryBus`. The handler MUST validate signature, expiry, and check the Redis blocklist (REQ-1-005).

####### 2.3.4.2.10.3.9.0.0 Exception Handling

Validation complete. Maps all token validation failures to `UNAUTHENTICATED` gRPC status.

####### 2.3.4.2.10.3.10.0.0 Performance Considerations

Validation complete. Specification highlights this as a performance-critical path for the entire platform that must not involve database calls.

####### 2.3.4.2.10.3.11.0.0 Validation Requirements

N/A

####### 2.3.4.2.10.3.12.0.0 Technology Integration Details

Integrates with `@nestjs/cqrs` QueryBus.

###### 2.3.4.2.10.4.0.0.0 Method Name

####### 2.3.4.2.10.4.1.0.0 Method Name

verifyEmail

####### 2.3.4.2.10.4.2.0.0 Method Signature

verifyEmail(request: VerifyEmailRequest): Promise<void>

####### 2.3.4.2.10.4.3.0.0 Return Type

Promise<void>

####### 2.3.4.2.10.4.4.0.0 Access Modifier

public

####### 2.3.4.2.10.4.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.10.4.6.0.0 Framework Specific Attributes

- @GrpcMethod(\"IdentityService\", \"VerifyEmail\")

####### 2.3.4.2.10.4.7.0.0 Parameters

- {'parameter_name': 'request', 'parameter_type': 'VerifyEmailRequest', 'is_nullable': False, 'purpose': 'The gRPC request containing the verification token.', 'framework_attributes': []}

####### 2.3.4.2.10.4.8.0.0 Implementation Logic

Validation reveals missing specification. Enhanced specification requires this method to map the request to a `VerifyEmailCommand` and execute it via the `CommandBus`. This fulfills the verification step of REQ-1-001 as shown in SEQ-242.

####### 2.3.4.2.10.4.9.0.0 Exception Handling

Specification requires mapping invalid/expired token errors to `INVALID_ARGUMENT` or `NOT_FOUND` gRPC status codes.

####### 2.3.4.2.10.4.10.0.0 Performance Considerations

N/A

####### 2.3.4.2.10.4.11.0.0 Validation Requirements

N/A

####### 2.3.4.2.10.4.12.0.0 Technology Integration Details

Integrates with `@nestjs/cqrs` CommandBus.

###### 2.3.4.2.10.5.0.0.0 Method Name

####### 2.3.4.2.10.5.1.0.0 Method Name

requestPasswordReset

####### 2.3.4.2.10.5.2.0.0 Method Signature

requestPasswordReset(request: RequestPasswordResetRequest): Promise<void>

####### 2.3.4.2.10.5.3.0.0 Return Type

Promise<void>

####### 2.3.4.2.10.5.4.0.0 Access Modifier

public

####### 2.3.4.2.10.5.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.10.5.6.0.0 Framework Specific Attributes

- @GrpcMethod(\"IdentityService\", \"RequestPasswordReset\")

####### 2.3.4.2.10.5.7.0.0 Parameters

- {'parameter_name': 'request', 'parameter_type': 'RequestPasswordResetRequest', 'is_nullable': False, 'purpose': "The gRPC request containing the user's email.", 'framework_attributes': []}

####### 2.3.4.2.10.5.8.0.0 Implementation Logic

Validation reveals missing specification. Enhanced specification requires this method to map the request to a `RequestPasswordResetCommand` and execute it. This fulfills the first step of REQ-1-003 as shown in SEQ-260.

####### 2.3.4.2.10.5.9.0.0 Exception Handling

Specification requires the method to return success even if the email does not exist to prevent email enumeration attacks.

####### 2.3.4.2.10.5.10.0.0 Performance Considerations

N/A

####### 2.3.4.2.10.5.11.0.0 Validation Requirements

N/A

####### 2.3.4.2.10.5.12.0.0 Technology Integration Details

Integrates with `@nestjs/cqrs` CommandBus.

###### 2.3.4.2.10.6.0.0.0 Method Name

####### 2.3.4.2.10.6.1.0.0 Method Name

resetPassword

####### 2.3.4.2.10.6.2.0.0 Method Signature

resetPassword(request: ResetPasswordRequest): Promise<void>

####### 2.3.4.2.10.6.3.0.0 Return Type

Promise<void>

####### 2.3.4.2.10.6.4.0.0 Access Modifier

public

####### 2.3.4.2.10.6.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.10.6.6.0.0 Framework Specific Attributes

- @GrpcMethod(\"IdentityService\", \"ResetPassword\")

####### 2.3.4.2.10.6.7.0.0 Parameters

- {'parameter_name': 'request', 'parameter_type': 'ResetPasswordRequest', 'is_nullable': False, 'purpose': 'The gRPC request containing the reset token and new password.', 'framework_attributes': []}

####### 2.3.4.2.10.6.8.0.0 Implementation Logic

Validation reveals missing specification. Enhanced specification requires this method to map the request to a `ResetPasswordCommand` and execute it. This fulfills the second step of REQ-1-003 as shown in SEQ-260.

####### 2.3.4.2.10.6.9.0.0 Exception Handling

Specification requires mapping token validation errors to `INVALID_ARGUMENT` or `NOT_FOUND` gRPC status codes.

####### 2.3.4.2.10.6.10.0.0 Performance Considerations

N/A

####### 2.3.4.2.10.6.11.0.0 Validation Requirements

Password complexity must be re-validated.

####### 2.3.4.2.10.6.12.0.0 Technology Integration Details

Integrates with `@nestjs/cqrs` CommandBus.

###### 2.3.4.2.10.7.0.0.0 Method Name

####### 2.3.4.2.10.7.1.0.0 Method Name

refreshToken

####### 2.3.4.2.10.7.2.0.0 Method Signature

refreshToken(request: RefreshTokenRequest): Promise<LoginResponse>

####### 2.3.4.2.10.7.3.0.0 Return Type

Promise<LoginResponse>

####### 2.3.4.2.10.7.4.0.0 Access Modifier

public

####### 2.3.4.2.10.7.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.10.7.6.0.0 Framework Specific Attributes

- @GrpcMethod(\"IdentityService\", \"RefreshToken\")

####### 2.3.4.2.10.7.7.0.0 Parameters

- {'parameter_name': 'request', 'parameter_type': 'RefreshTokenRequest', 'is_nullable': False, 'purpose': 'The gRPC request containing the refresh token.', 'framework_attributes': []}

####### 2.3.4.2.10.7.8.0.0 Implementation Logic

Validation reveals missing specification. Enhanced specification requires this method to map the request to a `RefreshTokenCommand` and execute it, which will validate the refresh token and issue a new access token, fulfilling REQ-1-004 as shown in SEQ-244.

####### 2.3.4.2.10.7.9.0.0 Exception Handling

Specification requires mapping invalid refresh tokens to `UNAUTHENTICATED` gRPC status.

####### 2.3.4.2.10.7.10.0.0 Performance Considerations

High performance is required to ensure seamless user experience.

####### 2.3.4.2.10.7.11.0.0 Validation Requirements

N/A

####### 2.3.4.2.10.7.12.0.0 Technology Integration Details

Integrates with `@nestjs/cqrs` CommandBus.

###### 2.3.4.2.10.8.0.0.0 Method Name

####### 2.3.4.2.10.8.1.0.0 Method Name

verifyMfa

####### 2.3.4.2.10.8.2.0.0 Method Signature

verifyMfa(request: VerifyMfaRequest): Promise<LoginResponse>

####### 2.3.4.2.10.8.3.0.0 Return Type

Promise<LoginResponse>

####### 2.3.4.2.10.8.4.0.0 Access Modifier

public

####### 2.3.4.2.10.8.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.10.8.6.0.0 Framework Specific Attributes

- @GrpcMethod(\"IdentityService\", \"VerifyMfa\")

####### 2.3.4.2.10.8.7.0.0 Parameters

- {'parameter_name': 'request', 'parameter_type': 'VerifyMfaRequest', 'is_nullable': False, 'purpose': 'The gRPC request containing the temporary MFA session token and the TOTP code.', 'framework_attributes': []}

####### 2.3.4.2.10.8.8.0.0 Implementation Logic

Validation reveals missing specification. Enhanced specification requires this method to map the request to a `VerifyMfaCommand` and execute it. This is the second step of the MFA login flow (REQ-1-055, SEQ-261) and will issue the final session tokens.

####### 2.3.4.2.10.8.9.0.0 Exception Handling

Specification requires mapping invalid TOTP codes to `UNAUTHENTICATED` gRPC status.

####### 2.3.4.2.10.8.10.0.0 Performance Considerations

N/A

####### 2.3.4.2.10.8.11.0.0 Validation Requirements

N/A

####### 2.3.4.2.10.8.12.0.0 Technology Integration Details

Integrates with `@nestjs/cqrs` CommandBus.

##### 2.3.4.2.11.0.0.0.0 Events

*No items available*

##### 2.3.4.2.12.0.0.0.0 Implementation Notes

Validation complete. Specification enhanced to be the complete anti-corruption layer for all identity-related use cases, fulfilling all requirements and sequence diagrams.

#### 2.3.4.3.0.0.0.0.0 Class Name

##### 2.3.4.3.1.0.0.0.0 Class Name

RegisterUserHandler

##### 2.3.4.3.2.0.0.0.0 File Path

src/modules/auth/application/use-cases/register-user/register-user.handler.ts

##### 2.3.4.3.3.0.0.0.0 Class Type

Command Handler

##### 2.3.4.3.4.0.0.0.0 Inheritance

ICommandHandler<RegisterUserCommand>

##### 2.3.4.3.5.0.0.0.0 Purpose

Handles the business logic for the user registration use case.

##### 2.3.4.3.6.0.0.0.0 Dependencies

- IUserRepository
- IHashingService
- EventPublisher
- IUnitOfWork

##### 2.3.4.3.7.0.0.0.0 Framework Specific Attributes

- @CommandHandler(RegisterUserCommand)

##### 2.3.4.3.8.0.0.0.0 Technology Integration Notes

Validation complete. Specification enhanced to include `IUnitOfWork` dependency for transactional integrity.

##### 2.3.4.3.9.0.0.0.0 Properties

*No items available*

##### 2.3.4.3.10.0.0.0.0 Methods

- {'method_name': 'execute', 'method_signature': 'execute(command: RegisterUserCommand): Promise<User>', 'return_type': 'Promise<User>', 'access_modifier': 'public', 'is_async': True, 'framework_specific_attributes': [], 'parameters': [{'parameter_name': 'command', 'parameter_type': 'RegisterUserCommand', 'is_nullable': False, 'purpose': 'The command containing all data needed for registration.', 'framework_attributes': []}], 'implementation_logic': 'Validation complete. Specification enhanced: This method MUST be wrapped in a transaction using the Unit of Work pattern. It first checks for email existence. It then uses the `User.create` factory method to create the user instance (enforcing age and password rules). The new user is persisted via the repository. Finally, a `UserRegisteredEvent` is published to the event bus before the transaction is committed.', 'exception_handling': 'Validation complete. Specification confirms throwing specific application-level exceptions for business rule violations.', 'performance_considerations': 'Validation complete.', 'validation_requirements': 'Validation complete.', 'technology_integration_details': 'Validation complete. Specification now includes interaction with `IUnitOfWork`.'}

##### 2.3.4.3.11.0.0.0.0 Events

*No items available*

##### 2.3.4.3.12.0.0.0.0 Implementation Notes

Validation complete. Specification now mandates the use of the Unit of Work pattern to ensure creating a user and publishing the event are atomic.

#### 2.3.4.4.0.0.0.0.0 Class Name

##### 2.3.4.4.1.0.0.0.0 Class Name

UserPrismaRepository

##### 2.3.4.4.2.0.0.0.0 File Path

src/modules/auth/infrastructure/repositories/user.prisma.repository.ts

##### 2.3.4.4.3.0.0.0.0 Class Type

Repository Adapter

##### 2.3.4.4.4.0.0.0.0 Inheritance

IUserRepository

##### 2.3.4.4.5.0.0.0.0 Purpose

Implements the data access logic for the User aggregate using Prisma ORM.

##### 2.3.4.4.6.0.0.0.0 Dependencies

- PrismaService

##### 2.3.4.4.7.0.0.0.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.4.8.0.0.0.0 Technology Integration Notes

Validation complete. This class acts as the adapter between the domain's repository port and the Prisma ORM.

##### 2.3.4.4.9.0.0.0.0 Properties

*No items available*

##### 2.3.4.4.10.0.0.0.0 Methods

###### 2.3.4.4.10.1.0.0.0 Method Name

####### 2.3.4.4.10.1.1.0.0 Method Name

findByEmail

####### 2.3.4.4.10.1.2.0.0 Method Signature

findByEmail(email: string): Promise<User | null>

####### 2.3.4.4.10.1.3.0.0 Return Type

Promise<User | null>

####### 2.3.4.4.10.1.4.0.0 Access Modifier

public

####### 2.3.4.4.10.1.5.0.0 Is Async

✅ Yes

####### 2.3.4.4.10.1.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.4.10.1.7.0.0 Parameters

- {'parameter_name': 'email', 'parameter_type': 'string', 'is_nullable': False, 'purpose': 'The email to search for.', 'framework_attributes': []}

####### 2.3.4.4.10.1.8.0.0 Implementation Logic

Validation complete. Specification requires using `prisma.user.findUnique` and mapping the Prisma model to the domain `User` entity.

####### 2.3.4.4.10.1.9.0.0 Exception Handling

N/A

####### 2.3.4.4.10.1.10.0.0 Performance Considerations

Validation complete. Relies on the database index on the email column.

####### 2.3.4.4.10.1.11.0.0 Validation Requirements

N/A

####### 2.3.4.4.10.1.12.0.0 Technology Integration Details

Validation complete. Uses injected PrismaClient.

###### 2.3.4.4.10.2.0.0.0 Method Name

####### 2.3.4.4.10.2.1.0.0 Method Name

add

####### 2.3.4.4.10.2.2.0.0 Method Signature

add(user: User): Promise<void>

####### 2.3.4.4.10.2.3.0.0 Return Type

Promise<void>

####### 2.3.4.4.10.2.4.0.0 Access Modifier

public

####### 2.3.4.4.10.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.4.10.2.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.4.10.2.7.0.0 Parameters

- {'parameter_name': 'user', 'parameter_type': 'User', 'is_nullable': False, 'purpose': 'The domain entity to persist.', 'framework_attributes': []}

####### 2.3.4.4.10.2.8.0.0 Implementation Logic

Validation complete. Specification requires mapping the domain `User` entity to the Prisma data model and using `prisma.user.create`.

####### 2.3.4.4.10.2.9.0.0 Exception Handling

Validation complete. Must handle unique constraint violations.

####### 2.3.4.4.10.2.10.0.0 Performance Considerations

N/A

####### 2.3.4.4.10.2.11.0.0 Validation Requirements

N/A

####### 2.3.4.4.10.2.12.0.0 Technology Integration Details

Validation complete. Uses injected PrismaClient.

###### 2.3.4.4.10.3.0.0.0 Method Name

####### 2.3.4.4.10.3.1.0.0 Method Name

update

####### 2.3.4.4.10.3.2.0.0 Method Signature

update(user: User): Promise<void>

####### 2.3.4.4.10.3.3.0.0 Return Type

Promise<void>

####### 2.3.4.4.10.3.4.0.0 Access Modifier

public

####### 2.3.4.4.10.3.5.0.0 Is Async

✅ Yes

####### 2.3.4.4.10.3.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.4.10.3.7.0.0 Parameters

- {'parameter_name': 'user', 'parameter_type': 'User', 'is_nullable': False, 'purpose': 'The domain entity to update.', 'framework_attributes': []}

####### 2.3.4.4.10.3.8.0.0 Implementation Logic

Validation reveals missing specification. Enhanced specification requires this method to map the domain `User` entity to the Prisma data model and use `prisma.user.update` to persist changes.

####### 2.3.4.4.10.3.9.0.0 Exception Handling

Specification requires handling cases where the user to update is not found.

####### 2.3.4.4.10.3.10.0.0 Performance Considerations

N/A

####### 2.3.4.4.10.3.11.0.0 Validation Requirements

N/A

####### 2.3.4.4.10.3.12.0.0 Technology Integration Details

Uses injected PrismaClient.

##### 2.3.4.4.11.0.0.0.0 Events

*No items available*

##### 2.3.4.4.12.0.0.0.0 Implementation Notes

Validation complete. Specification enhanced with the critical `update` method, completing the repository contract.

#### 2.3.4.5.0.0.0.0.0 Class Name

##### 2.3.4.5.1.0.0.0.0 Class Name

RedisTokenBlocklistService

##### 2.3.4.5.2.0.0.0.0 File Path

src/modules/auth/infrastructure/services/redis-token-blocklist.service.ts

##### 2.3.4.5.3.0.0.0.0 Class Type

Infrastructure Service

##### 2.3.4.5.4.0.0.0.0 Inheritance

ITokenBlocklistService

##### 2.3.4.5.5.0.0.0.0 Purpose

Implements the token blocklist functionality using Redis for fast, distributed storage, fulfilling REQ-1-005.

##### 2.3.4.5.6.0.0.0.0 Dependencies

- RedisClient

##### 2.3.4.5.7.0.0.0.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.5.8.0.0.0.0 Technology Integration Notes

Validation complete. Specification confirms this is the adapter for the Redis data store.

##### 2.3.4.5.9.0.0.0.0 Properties

*No items available*

##### 2.3.4.5.10.0.0.0.0 Methods

###### 2.3.4.5.10.1.0.0.0 Method Name

####### 2.3.4.5.10.1.1.0.0 Method Name

addToBlocklist

####### 2.3.4.5.10.1.2.0.0 Method Signature

addToBlocklist(jti: string, expiry: number): Promise<void>

####### 2.3.4.5.10.1.3.0.0 Return Type

Promise<void>

####### 2.3.4.5.10.1.4.0.0 Access Modifier

public

####### 2.3.4.5.10.1.5.0.0 Is Async

✅ Yes

####### 2.3.4.5.10.1.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.5.10.1.7.0.0 Parameters

######## 2.3.4.5.10.1.7.1.0 Parameter Name

######### 2.3.4.5.10.1.7.1.1 Parameter Name

jti

######### 2.3.4.5.10.1.7.1.2 Parameter Type

string

######### 2.3.4.5.10.1.7.1.3 Is Nullable

❌ No

######### 2.3.4.5.10.1.7.1.4 Purpose

The unique identifier of the JWT to block.

######### 2.3.4.5.10.1.7.1.5 Framework Attributes

*No items available*

######## 2.3.4.5.10.1.7.2.0 Parameter Name

######### 2.3.4.5.10.1.7.2.1 Parameter Name

expiry

######### 2.3.4.5.10.1.7.2.2 Parameter Type

number

######### 2.3.4.5.10.1.7.2.3 Is Nullable

❌ No

######### 2.3.4.5.10.1.7.2.4 Purpose

The Unix timestamp when the token expires, used as the TTL for the Redis key.

######### 2.3.4.5.10.1.7.2.5 Framework Attributes

*No items available*

####### 2.3.4.5.10.1.8.0.0 Implementation Logic

Validation complete. Specification requires using the Redis client to set a key with a TTL calculated from the token's remaining lifetime. This ensures automatic cleanup of the blocklist.

####### 2.3.4.5.10.1.9.0.0 Exception Handling

Validation complete. Specification mandates graceful handling and logging of Redis connection errors.

####### 2.3.4.5.10.1.10.0.0 Performance Considerations

Validation complete. A single, fast Redis command.

####### 2.3.4.5.10.1.11.0.0 Validation Requirements

N/A

####### 2.3.4.5.10.1.12.0.0 Technology Integration Details

Validation complete. Uses a standard Redis client library.

###### 2.3.4.5.10.2.0.0.0 Method Name

####### 2.3.4.5.10.2.1.0.0 Method Name

isBlocklisted

####### 2.3.4.5.10.2.2.0.0 Method Signature

isBlocklisted(jti: string): Promise<boolean>

####### 2.3.4.5.10.2.3.0.0 Return Type

Promise<boolean>

####### 2.3.4.5.10.2.4.0.0 Access Modifier

public

####### 2.3.4.5.10.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.5.10.2.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.5.10.2.7.0.0 Parameters

- {'parameter_name': 'jti', 'parameter_type': 'string', 'is_nullable': False, 'purpose': 'The unique identifier of the JWT to check.', 'framework_attributes': []}

####### 2.3.4.5.10.2.8.0.0 Implementation Logic

Validation complete. Specification requires a Redis `EXISTS` command on the token's JTI key.

####### 2.3.4.5.10.2.9.0.0 Exception Handling

Validation complete. Specification enhanced to require a fail-secure approach: if Redis is unavailable, assume the token is blocklisted (return true) and log a critical error.

####### 2.3.4.5.10.2.10.0.0 Performance Considerations

Validation complete. This is a performance-critical operation for every authenticated API call.

####### 2.3.4.5.10.2.11.0.0 Validation Requirements

N/A

####### 2.3.4.5.10.2.12.0.0 Technology Integration Details

Validation complete.

##### 2.3.4.5.11.0.0.0.0 Events

*No items available*

##### 2.3.4.5.12.0.0.0.0 Implementation Notes

Validation complete. This service is a cornerstone of the platform's security for features like logout and password reset.

#### 2.3.4.6.0.0.0.0.0 Class Name

##### 2.3.4.6.1.0.0.0.0 Class Name

GrpcExceptionFilter

##### 2.3.4.6.2.0.0.0.0 File Path

src/shared/exceptions/grpc-exception.filter.ts

##### 2.3.4.6.3.0.0.0.0 Class Type

Exception Filter

##### 2.3.4.6.4.0.0.0.0 Inheritance

ExceptionFilter

##### 2.3.4.6.5.0.0.0.0 Purpose

A global filter to catch application exceptions and translate them into standard gRPC status codes for clients.

##### 2.3.4.6.6.0.0.0.0 Dependencies

- LoggerService

##### 2.3.4.6.7.0.0.0.0 Framework Specific Attributes

- @Catch()

##### 2.3.4.6.8.0.0.0.0 Technology Integration Notes

Validation reveals missing specification. Enhanced specification requires this filter to be applied globally in `main.ts` to ensure consistent error handling for all gRPC methods.

##### 2.3.4.6.9.0.0.0.0 Properties

*No items available*

##### 2.3.4.6.10.0.0.0.0 Methods

- {'method_name': 'catch', 'method_signature': 'catch(exception: any, host: ArgumentsHost): Observable<any>', 'return_type': 'Observable<any>', 'access_modifier': 'public', 'is_async': False, 'framework_specific_attributes': [], 'parameters': [{'parameter_name': 'exception', 'parameter_type': 'any', 'is_nullable': False, 'purpose': 'The thrown exception.', 'framework_attributes': []}, {'parameter_name': 'host', 'parameter_type': 'ArgumentsHost', 'is_nullable': False, 'purpose': 'The execution context.', 'framework_attributes': []}], 'implementation_logic': 'Specification requires a mapping from custom application exceptions to gRPC status codes. For example, `UserAlreadyExistsException` maps to `status.ALREADY_EXISTS`. `ValidationException` maps to `status.INVALID_ARGUMENT`. `AuthenticationException` maps to `status.UNAUTHENTICATED`. All unhandled exceptions should map to `status.INTERNAL` and be logged as critical errors.', 'exception_handling': 'This is the primary exception handler for the gRPC presentation layer.', 'performance_considerations': 'N/A', 'validation_requirements': 'N/A', 'technology_integration_details': 'Uses `@nestjs/microservices` RpcException to format the error response for gRPC clients.'}

##### 2.3.4.6.11.0.0.0.0 Events

*No items available*

##### 2.3.4.6.12.0.0.0.0 Implementation Notes

Specification added. This component is crucial for creating a clean and predictable API contract for service consumers.

### 2.3.5.0.0.0.0.0.0 Interface Specifications

#### 2.3.5.1.0.0.0.0.0 Interface Name

##### 2.3.5.1.1.0.0.0.0 Interface Name

IUserRepository

##### 2.3.5.1.2.0.0.0.0 File Path

src/modules/auth/domain/interfaces/user.repository.interface.ts

##### 2.3.5.1.3.0.0.0.0 Purpose

Defines the contract (port) for data persistence operations related to the User aggregate.

##### 2.3.5.1.4.0.0.0.0 Generic Constraints

None

##### 2.3.5.1.5.0.0.0.0 Framework Specific Inheritance

None

##### 2.3.5.1.6.0.0.0.0 Method Contracts

###### 2.3.5.1.6.1.0.0.0 Method Name

####### 2.3.5.1.6.1.1.0.0 Method Name

findById

####### 2.3.5.1.6.1.2.0.0 Method Signature

findById(id: string): Promise<User | null>

####### 2.3.5.1.6.1.3.0.0 Return Type

Promise<User | null>

####### 2.3.5.1.6.1.4.0.0 Framework Attributes

*No items available*

####### 2.3.5.1.6.1.5.0.0 Parameters

- {'parameter_name': 'id', 'parameter_type': 'string', 'purpose': 'The unique ID of the user.'}

####### 2.3.5.1.6.1.6.0.0 Contract Description

Finds a single user by their unique identifier.

####### 2.3.5.1.6.1.7.0.0 Exception Contracts

None.

###### 2.3.5.1.6.2.0.0.0 Method Name

####### 2.3.5.1.6.2.1.0.0 Method Name

findByEmail

####### 2.3.5.1.6.2.2.0.0 Method Signature

findByEmail(email: string): Promise<User | null>

####### 2.3.5.1.6.2.3.0.0 Return Type

Promise<User | null>

####### 2.3.5.1.6.2.4.0.0 Framework Attributes

*No items available*

####### 2.3.5.1.6.2.5.0.0 Parameters

- {'parameter_name': 'email', 'parameter_type': 'string', 'purpose': 'The unique email of the user.'}

####### 2.3.5.1.6.2.6.0.0 Contract Description

Finds a single user by their email address.

####### 2.3.5.1.6.2.7.0.0 Exception Contracts

None.

###### 2.3.5.1.6.3.0.0.0 Method Name

####### 2.3.5.1.6.3.1.0.0 Method Name

add

####### 2.3.5.1.6.3.2.0.0 Method Signature

add(user: User): Promise<void>

####### 2.3.5.1.6.3.3.0.0 Return Type

Promise<void>

####### 2.3.5.1.6.3.4.0.0 Framework Attributes

*No items available*

####### 2.3.5.1.6.3.5.0.0 Parameters

- {'parameter_name': 'user', 'parameter_type': 'User', 'purpose': 'The User domain entity to add to the repository.'}

####### 2.3.5.1.6.3.6.0.0 Contract Description

Adds a new user to the repository.

####### 2.3.5.1.6.3.7.0.0 Exception Contracts

Should throw an exception if a user with the same email already exists.

###### 2.3.5.1.6.4.0.0.0 Method Name

####### 2.3.5.1.6.4.1.0.0 Method Name

update

####### 2.3.5.1.6.4.2.0.0 Method Signature

update(user: User): Promise<void>

####### 2.3.5.1.6.4.3.0.0 Return Type

Promise<void>

####### 2.3.5.1.6.4.4.0.0 Framework Attributes

*No items available*

####### 2.3.5.1.6.4.5.0.0 Parameters

- {'parameter_name': 'user', 'parameter_type': 'User', 'purpose': 'The User domain entity with updated state to persist.'}

####### 2.3.5.1.6.4.6.0.0 Contract Description

Validation reveals missing method contract. Enhanced specification requires this method to update an existing user in the repository.

####### 2.3.5.1.6.4.7.0.0 Exception Contracts

Specification requires this to throw an exception if the user to be updated does not exist.

##### 2.3.5.1.7.0.0.0.0 Property Contracts

*No items available*

##### 2.3.5.1.8.0.0.0.0 Implementation Guidance

Validation complete. Specification enhanced to include the critical `update` method. Implementations should handle mapping between the domain User entity and the persistence model.

#### 2.3.5.2.0.0.0.0.0 Interface Name

##### 2.3.5.2.1.0.0.0.0 Interface Name

IEventPublisher

##### 2.3.5.2.2.0.0.0.0 File Path

src/shared/interfaces/event-publisher.interface.ts

##### 2.3.5.2.3.0.0.0.0 Purpose

Defines a generic contract for publishing domain events to an external message bus.

##### 2.3.5.2.4.0.0.0.0 Generic Constraints

None

##### 2.3.5.2.5.0.0.0.0 Framework Specific Inheritance

None

##### 2.3.5.2.6.0.0.0.0 Method Contracts

- {'method_name': 'publish', 'method_signature': 'publish(eventName: string, payload: any): Promise<void>', 'return_type': 'Promise<void>', 'framework_attributes': [], 'parameters': [{'parameter_name': 'eventName', 'parameter_type': 'string', 'purpose': 'The name of the event topic or type.'}, {'parameter_name': 'payload', 'parameter_type': 'any', 'purpose': 'The data associated with the event.'}], 'contract_description': 'Publishes a payload to a specific event channel on the message bus.', 'exception_contracts': 'Should throw an exception if the message bus is unavailable.'}

##### 2.3.5.2.7.0.0.0.0 Property Contracts

*No items available*

##### 2.3.5.2.8.0.0.0.0 Implementation Guidance

Validation complete. The implementation in the infrastructure layer will adapt this call to the specific message bus client (e.g., AWS SNS SDK).

#### 2.3.5.3.0.0.0.0.0 Interface Name

##### 2.3.5.3.1.0.0.0.0 Interface Name

IUnitOfWork

##### 2.3.5.3.2.0.0.0.0 File Path

src/modules/auth/domain/interfaces/unit-of-work.interface.ts

##### 2.3.5.3.3.0.0.0.0 Purpose

Defines the contract for the Unit of Work pattern, ensuring that a series of operations are executed in a single transaction.

##### 2.3.5.3.4.0.0.0.0 Generic Constraints

None

##### 2.3.5.3.5.0.0.0.0 Framework Specific Inheritance

None

##### 2.3.5.3.6.0.0.0.0 Method Contracts

###### 2.3.5.3.6.1.0.0.0 Method Name

####### 2.3.5.3.6.1.1.0.0 Method Name

startTransaction

####### 2.3.5.3.6.1.2.0.0 Method Signature

startTransaction(): Promise<void>

####### 2.3.5.3.6.1.3.0.0 Return Type

Promise<void>

####### 2.3.5.3.6.1.4.0.0 Framework Attributes

*No items available*

####### 2.3.5.3.6.1.5.0.0 Parameters

*No items available*

####### 2.3.5.3.6.1.6.0.0 Contract Description

Begins a new database transaction.

####### 2.3.5.3.6.1.7.0.0 Exception Contracts

Throws if a transaction is already in progress.

###### 2.3.5.3.6.2.0.0.0 Method Name

####### 2.3.5.3.6.2.1.0.0 Method Name

commitTransaction

####### 2.3.5.3.6.2.2.0.0 Method Signature

commitTransaction(): Promise<void>

####### 2.3.5.3.6.2.3.0.0 Return Type

Promise<void>

####### 2.3.5.3.6.2.4.0.0 Framework Attributes

*No items available*

####### 2.3.5.3.6.2.5.0.0 Parameters

*No items available*

####### 2.3.5.3.6.2.6.0.0 Contract Description

Commits the current transaction.

####### 2.3.5.3.6.2.7.0.0 Exception Contracts

Throws if no transaction is active.

###### 2.3.5.3.6.3.0.0.0 Method Name

####### 2.3.5.3.6.3.1.0.0 Method Name

rollbackTransaction

####### 2.3.5.3.6.3.2.0.0 Method Signature

rollbackTransaction(): Promise<void>

####### 2.3.5.3.6.3.3.0.0 Return Type

Promise<void>

####### 2.3.5.3.6.3.4.0.0 Framework Attributes

*No items available*

####### 2.3.5.3.6.3.5.0.0 Parameters

*No items available*

####### 2.3.5.3.6.3.6.0.0 Contract Description

Rolls back the current transaction.

####### 2.3.5.3.6.3.7.0.0 Exception Contracts

Throws if no transaction is active.

##### 2.3.5.3.7.0.0.0.0 Property Contracts

*No items available*

##### 2.3.5.3.8.0.0.0.0 Implementation Guidance

Validation reveals missing specification. Enhanced specification requires this interface to be implemented in the infrastructure layer. The Prisma implementation will leverage Prisma's Interactive Transactions API (`$transaction`). Application handlers will inject this interface to manage atomicity of operations.

### 2.3.6.0.0.0.0.0.0 Enum Specifications

#### 2.3.6.1.0.0.0.0.0 Enum Name

##### 2.3.6.1.1.0.0.0.0 Enum Name

UserStatus

##### 2.3.6.1.2.0.0.0.0 File Path

src/modules/auth/domain/enums/user-status.enum.ts

##### 2.3.6.1.3.0.0.0.0 Underlying Type

string

##### 2.3.6.1.4.0.0.0.0 Purpose

Defines the possible lifecycle states of a user account.

##### 2.3.6.1.5.0.0.0.0 Framework Attributes

*No items available*

##### 2.3.6.1.6.0.0.0.0 Values

###### 2.3.6.1.6.1.0.0.0 Value Name

####### 2.3.6.1.6.1.1.0.0 Value Name

INACTIVE

####### 2.3.6.1.6.1.2.0.0 Value

\"inactive\"

####### 2.3.6.1.6.1.3.0.0 Description

The user has registered but not yet verified their email. Login is disabled.

###### 2.3.6.1.6.2.0.0.0 Value Name

####### 2.3.6.1.6.2.1.0.0 Value Name

ACTIVE

####### 2.3.6.1.6.2.2.0.0 Value

\"active\"

####### 2.3.6.1.6.2.3.0.0 Description

The user is fully verified and can access the platform.

###### 2.3.6.1.6.3.0.0.0 Value Name

####### 2.3.6.1.6.3.1.0.0 Value Name

DEACTIVATED

####### 2.3.6.1.6.3.2.0.0 Value

\"deactivated\"

####### 2.3.6.1.6.3.3.0.0 Description

The user has voluntarily deactivated their account. Login is disabled but can be reactivated.

###### 2.3.6.1.6.4.0.0.0 Value Name

####### 2.3.6.1.6.4.1.0.0 Value Name

BANNED

####### 2.3.6.1.6.4.2.0.0 Value

\"banned\"

####### 2.3.6.1.6.4.3.0.0 Description

The user has been banned by an administrator. Login is permanently disabled.

#### 2.3.6.2.0.0.0.0.0 Enum Name

##### 2.3.6.2.1.0.0.0.0 Enum Name

TokenType

##### 2.3.6.2.2.0.0.0.0 File Path

src/modules/auth/domain/enums/token-type.enum.ts

##### 2.3.6.2.3.0.0.0.0 Underlying Type

string

##### 2.3.6.2.4.0.0.0.0 Purpose

Validation reveals missing specification. Enhanced specification requires this enum to define the types of single-use tokens stored in the database.

##### 2.3.6.2.5.0.0.0.0 Framework Attributes

*No items available*

##### 2.3.6.2.6.0.0.0.0 Values

###### 2.3.6.2.6.1.0.0.0 Value Name

####### 2.3.6.2.6.1.1.0.0 Value Name

EMAIL_VERIFICATION

####### 2.3.6.2.6.1.2.0.0 Value

\"email_verification\"

####### 2.3.6.2.6.1.3.0.0 Description

A token used to verify a user's email address upon registration.

###### 2.3.6.2.6.2.0.0.0 Value Name

####### 2.3.6.2.6.2.1.0.0 Value Name

PASSWORD_RESET

####### 2.3.6.2.6.2.2.0.0 Value

\"password_reset\"

####### 2.3.6.2.6.2.3.0.0 Description

A token used to authorize a password reset action.

### 2.3.7.0.0.0.0.0.0 Dto Specifications

- {'dto_name': 'RegisterUserCommand', 'file_path': 'src/modules/auth/application/use-cases/register-user/register-user.command.ts', 'purpose': 'Data Transfer Object for the Register User use case.', 'framework_base_class': 'N/A', 'properties': [{'property_name': 'email', 'property_type': 'string', 'validation_attributes': ['@IsEmail()', '@IsNotEmpty()'], 'serialization_attributes': [], 'framework_specific_attributes': []}, {'property_name': 'password', 'property_type': 'string', 'validation_attributes': ['@IsNotEmpty()', '@MinLength(12)', '@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d)(?=.*[^\\\\da-zA-Z]).{12,}$/, {message: \\"Password does not meet complexity requirements.\\"})'], 'serialization_attributes': [], 'framework_specific_attributes': []}, {'property_name': 'dateOfBirth', 'property_type': 'Date', 'validation_attributes': ['@IsDate()', '@IsNotEmpty()', 'Validation complete. Enhanced specification requires a custom `@IsOfAge(16)` validator to be implemented and applied here to fulfill REQ-1-092.'], 'serialization_attributes': ['@Type(() => Date)'], 'framework_specific_attributes': []}], 'validation_rules': 'Validation complete. Specification confirms properties are validated using class-validator decorators, enforced by a global ValidationPipe.', 'serialization_requirements': 'Validation complete.'}

### 2.3.8.0.0.0.0.0.0 Configuration Specifications

- {'configuration_name': 'JwtConfig', 'file_path': 'src/config/jwt.config.ts', 'purpose': 'Provides type-safe configuration for JWT generation and validation.', 'framework_base_class': 'N/A', 'configuration_sections': [{'section_name': 'jwt', 'properties': [{'property_name': 'accessSecret', 'property_type': 'string', 'default_value': 'null', 'required': True, 'description': 'The secret key for signing access tokens. Must be loaded from environment variables.'}, {'property_name': 'accessExpiresIn', 'property_type': 'string', 'default_value': '\\"15m\\"', 'required': True, 'description': 'The expiration time for access tokens (e.g., \\"15m\\", \\"1h\\"). Aligns with REQ-1-004.'}, {'property_name': 'refreshSecret', 'property_type': 'string', 'default_value': 'null', 'required': True, 'description': 'The secret key for signing refresh tokens.'}, {'property_name': 'refreshExpiresIn', 'property_type': 'string', 'default_value': '\\"7d\\"', 'required': True, 'description': 'The expiration time for refresh tokens (e.g., \\"7d\\"). Aligns with REQ-1-004.'}]}], 'validation_requirements': 'Validation complete. Specification confirms a validation schema (e.g., Joi) must be used with `@nestjs/config` to ensure all JWT environment variables are present at startup.'}

### 2.3.9.0.0.0.0.0.0 Dependency Injection Specifications

#### 2.3.9.1.0.0.0.0.0 Service Interface

##### 2.3.9.1.1.0.0.0.0 Service Interface

IUserRepository

##### 2.3.9.1.2.0.0.0.0 Service Implementation

UserPrismaRepository

##### 2.3.9.1.3.0.0.0.0 Lifetime

Scoped

##### 2.3.9.1.4.0.0.0.0 Registration Reasoning

Repositories are typically scoped to the request lifecycle to ensure data consistency within a single operation. This is handled by default in NestJS for providers.

##### 2.3.9.1.5.0.0.0.0 Framework Registration Pattern

Standard provider registration in the `auth.module.ts` file: `{ provide: \"IUserRepository\", useClass: UserPrismaRepository }`.

#### 2.3.9.2.0.0.0.0.0 Service Interface

##### 2.3.9.2.1.0.0.0.0 Service Interface

IHashingService

##### 2.3.9.2.2.0.0.0.0 Service Implementation

BcryptService

##### 2.3.9.2.3.0.0.0.0 Lifetime

Singleton

##### 2.3.9.2.4.0.0.0.0 Registration Reasoning

The hashing service is stateless and can be safely shared across the application as a singleton for performance.

##### 2.3.9.2.5.0.0.0.0 Framework Registration Pattern

Standard provider registration in the `auth.module.ts` file: `{ provide: \"IHashingService\", useClass: BcryptService }`.

#### 2.3.9.3.0.0.0.0.0 Service Interface

##### 2.3.9.3.1.0.0.0.0 Service Interface

ITokenBlocklistService

##### 2.3.9.3.2.0.0.0.0 Service Implementation

RedisTokenBlocklistService

##### 2.3.9.3.3.0.0.0.0 Lifetime

Singleton

##### 2.3.9.3.4.0.0.0.0 Registration Reasoning

The Redis client connection is managed as a singleton to be reused across the application.

##### 2.3.9.3.5.0.0.0.0 Framework Registration Pattern

Standard provider registration in the `auth.module.ts` file: `{ provide: \"ITokenBlocklistService\", useClass: RedisTokenBlocklistService }`.

#### 2.3.9.4.0.0.0.0.0 Service Interface

##### 2.3.9.4.1.0.0.0.0 Service Interface

IEventPublisher

##### 2.3.9.4.2.0.0.0.0 Service Implementation

EventPublisherService

##### 2.3.9.4.3.0.0.0.0 Lifetime

Singleton

##### 2.3.9.4.4.0.0.0.0 Registration Reasoning

The event publisher client is stateless and manages its own connections, making it suitable for a singleton lifetime.

##### 2.3.9.4.5.0.0.0.0 Framework Registration Pattern

Standard provider registration in a shared infrastructure module: `{ provide: \"IEventPublisher\", useClass: EventPublisherService }`.

### 2.3.10.0.0.0.0.0.0 External Integration Specifications

#### 2.3.10.1.0.0.0.0.0 Integration Target

##### 2.3.10.1.1.0.0.0.0 Integration Target

PostgreSQL Database

##### 2.3.10.1.2.0.0.0.0 Integration Type

Database (ORM)

##### 2.3.10.1.3.0.0.0.0 Required Client Classes

- PrismaClient

##### 2.3.10.1.4.0.0.0.0 Configuration Requirements

Database connection URL (DATABASE_URL) must be provided via environment variables.

##### 2.3.10.1.5.0.0.0.0 Error Handling Requirements

Repository implementations must handle Prisma-specific exceptions (e.g., unique constraint violations) and map them to domain exceptions.

##### 2.3.10.1.6.0.0.0.0 Authentication Requirements

Standard database username/password authentication.

##### 2.3.10.1.7.0.0.0.0 Framework Integration Patterns

A global `PrismaModule` will provide a singleton `PrismaService` that can be injected into repositories.

#### 2.3.10.2.0.0.0.0.0 Integration Target

##### 2.3.10.2.1.0.0.0.0 Integration Target

Redis

##### 2.3.10.2.2.0.0.0.0 Integration Type

Cache

##### 2.3.10.2.3.0.0.0.0 Required Client Classes

- RedisClient (from a library like ioredis)

##### 2.3.10.2.4.0.0.0.0 Configuration Requirements

Redis connection URL (REDIS_URL) must be provided via environment variables.

##### 2.3.10.2.5.0.0.0.0 Error Handling Requirements

The Redis adapter service must handle connection errors gracefully and implement a fail-safe strategy (e.g., fail-secure for the blocklist check).

##### 2.3.10.2.6.0.0.0.0 Authentication Requirements

Standard Redis password authentication.

##### 2.3.10.2.7.0.0.0.0 Framework Integration Patterns

A global `RedisModule` will provide the Redis client as an injectable provider.

#### 2.3.10.3.0.0.0.0.0 Integration Target

##### 2.3.10.3.1.0.0.0.0 Integration Target

AWS SNS/SQS (Event Bus)

##### 2.3.10.3.2.0.0.0.0 Integration Type

Message Queue

##### 2.3.10.3.3.0.0.0.0 Required Client Classes

- SnsClient (from @aws-sdk/client-sns)

##### 2.3.10.3.4.0.0.0.0 Configuration Requirements

AWS credentials, region, and topic ARN must be provided via environment variables.

##### 2.3.10.3.5.0.0.0.0 Error Handling Requirements

The `EventPublisherService` must implement retry logic with exponential backoff for publishing messages.

##### 2.3.10.3.6.0.0.0.0 Authentication Requirements

IAM role or access keys for AWS SDK.

##### 2.3.10.3.7.0.0.0.0 Framework Integration Patterns

An injectable service adapter that encapsulates the AWS SDK logic.

### 2.3.11.0.0.0.0.0.0 Prisma Schema Specification

#### 2.3.11.1.0.0.0.0.0 Purpose

Validation reveals missing specification. This section describes the required Prisma models for the Identity service, based on the DB design diagrams. This is a specification, not the literal file content.

#### 2.3.11.2.0.0.0.0.0 Models

##### 2.3.11.2.1.0.0.0.0 Model Name

###### 2.3.11.2.1.1.0.0.0 Model Name

User

###### 2.3.11.2.1.2.0.0.0 Fields

id (UUID, primary key), email (String, unique), passwordHash (String), status (UserStatus enum), dateOfBirth (DateTime), mfaSecret (String, optional), mfaEnabled (Boolean, default: false), createdAt (DateTime), updatedAt (DateTime).

###### 2.3.11.2.1.3.0.0.0 Relations

One-to-many with UserToken, UserRole, AccountDeletionRequest, UserSecurityAuditLog.

##### 2.3.11.2.2.0.0.0.0 Model Name

###### 2.3.11.2.2.1.0.0.0 Model Name

Role

###### 2.3.11.2.2.2.0.0.0 Fields

id (Int, primary key), name (String, unique).

###### 2.3.11.2.2.3.0.0.0 Relations

One-to-many with UserRole.

##### 2.3.11.2.3.0.0.0.0 Model Name

###### 2.3.11.2.3.1.0.0.0 Model Name

UserRole

###### 2.3.11.2.3.2.0.0.0 Fields

userId (UUID), roleId (Int). Composite primary key on (userId, roleId).

###### 2.3.11.2.3.3.0.0.0 Relations

Many-to-one with User, many-to-one with Role.

##### 2.3.11.2.4.0.0.0.0 Model Name

###### 2.3.11.2.4.1.0.0.0 Model Name

UserToken

###### 2.3.11.2.4.2.0.0.0 Fields

id (UUID, primary key), userId (UUID), type (TokenType enum), tokenHash (String, unique), expiresAt (DateTime).

###### 2.3.11.2.4.3.0.0.0 Relations

Many-to-one with User.

##### 2.3.11.2.5.0.0.0.0 Model Name

###### 2.3.11.2.5.1.0.0.0 Model Name

AccountDeletionRequest

###### 2.3.11.2.5.2.0.0.0 Fields

id (UUID, primary key), userId (UUID, unique), scheduledPurgeAt (DateTime), status (String).

###### 2.3.11.2.5.3.0.0.0 Relations

One-to-one with User.

##### 2.3.11.2.6.0.0.0.0 Model Name

###### 2.3.11.2.6.1.0.0.0 Model Name

UserSecurityAuditLog

###### 2.3.11.2.6.2.0.0.0 Fields

id (UUID, primary key), userId (UUID), action (String), ipAddress (String), userAgent (String), createdAt (DateTime).

###### 2.3.11.2.6.3.0.0.0 Relations

Many-to-one with User.

### 2.3.12.0.0.0.0.0.0 Proto Definitions

#### 2.3.12.1.0.0.0.0.0 Purpose

Validation reveals missing specification. This section describes the required gRPC service definition for the Identity service. This is a specification, not the literal file content.

#### 2.3.12.2.0.0.0.0.0 File Path

proto/identity/identity.proto

#### 2.3.12.3.0.0.0.0.0 Service Name

IdentityService

#### 2.3.12.4.0.0.0.0.0 Methods

##### 2.3.12.4.1.0.0.0.0 RegisterUser

###### 2.3.12.4.1.1.0.0.0 Name

RegisterUser

###### 2.3.12.4.1.2.0.0.0 Request

RegisterRequest { string email, string password, string dateOfBirth }

###### 2.3.12.4.1.3.0.0.0 Response

UserResponse { string id, string email }

##### 2.3.12.4.2.0.0.0.0 Login

###### 2.3.12.4.2.1.0.0.0 Name

Login

###### 2.3.12.4.2.2.0.0.0 Request

LoginRequest { string email, string password }

###### 2.3.12.4.2.3.0.0.0 Response

LoginResponse { string accessToken, string refreshToken, bool mfaRequired, string mfaSessionToken }

##### 2.3.12.4.3.0.0.0.0 Logout

###### 2.3.12.4.3.1.0.0.0 Name

Logout

###### 2.3.12.4.3.2.0.0.0 Request

LogoutRequest { string accessToken }

###### 2.3.12.4.3.3.0.0.0 Response

google.protobuf.Empty

##### 2.3.12.4.4.0.0.0.0 ValidateToken

###### 2.3.12.4.4.1.0.0.0 Name

ValidateToken

###### 2.3.12.4.4.2.0.0.0 Request

ValidateTokenRequest { string accessToken }

###### 2.3.12.4.4.3.0.0.0 Response

ValidateTokenResponse { string userId, repeated string roles, bool isValid }

##### 2.3.12.4.5.0.0.0.0 RefreshToken

###### 2.3.12.4.5.1.0.0.0 Name

RefreshToken

###### 2.3.12.4.5.2.0.0.0 Request

RefreshTokenRequest { string refreshToken }

###### 2.3.12.4.5.3.0.0.0 Response

LoginResponse { string accessToken, ... }

##### 2.3.12.4.6.0.0.0.0 VerifyEmail

###### 2.3.12.4.6.1.0.0.0 Name

VerifyEmail

###### 2.3.12.4.6.2.0.0.0 Request

VerifyEmailRequest { string token }

###### 2.3.12.4.6.3.0.0.0 Response

google.protobuf.Empty

##### 2.3.12.4.7.0.0.0.0 RequestPasswordReset

###### 2.3.12.4.7.1.0.0.0 Name

RequestPasswordReset

###### 2.3.12.4.7.2.0.0.0 Request

RequestPasswordResetRequest { string email }

###### 2.3.12.4.7.3.0.0.0 Response

google.protobuf.Empty

##### 2.3.12.4.8.0.0.0.0 ResetPassword

###### 2.3.12.4.8.1.0.0.0 Name

ResetPassword

###### 2.3.12.4.8.2.0.0.0 Request

ResetPasswordRequest { string token, string newPassword }

###### 2.3.12.4.8.3.0.0.0 Response

google.protobuf.Empty

##### 2.3.12.4.9.0.0.0.0 EnableMfa

###### 2.3.12.4.9.1.0.0.0 Name

EnableMfa

###### 2.3.12.4.9.2.0.0.0 Request

EnableMfaRequest { string userId }

###### 2.3.12.4.9.3.0.0.0 Response

EnableMfaResponse { string secret, string qrCodeUrl }

##### 2.3.12.4.10.0.0.0.0 VerifyMfa

###### 2.3.12.4.10.1.0.0.0 Name

VerifyMfa

###### 2.3.12.4.10.2.0.0.0 Request

VerifyMfaRequest { string mfaSessionToken, string code }

###### 2.3.12.4.10.3.0.0.0 Response

LoginResponse { string accessToken, ... }

# 3.0.0.0.0.0.0.0.0 File Structure

## 3.1.0.0.0.0.0.0.0 Directory Organization

### 3.1.1.0.0.0.0.0.0 Directory Path

#### 3.1.1.1.0.0.0.0.0 Directory Path

/

#### 3.1.1.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.1.3.0.0.0.0.0 Contains Files

- package.json
- tsconfig.json
- nest-cli.json
- .env.example
- .editorconfig
- Dockerfile
- docker-compose.yml
- .eslintrc.js
- .prettierrc
- jest.config.js
- .gitignore
- .dockerignore

#### 3.1.1.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.1.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.2.0.0.0.0.0.0 Directory Path

#### 3.1.2.1.0.0.0.0.0 Directory Path

.github/workflows

#### 3.1.2.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.2.3.0.0.0.0.0 Contains Files

- ci.yml

#### 3.1.2.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.2.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.3.0.0.0.0.0.0 Directory Path

#### 3.1.3.1.0.0.0.0.0 Directory Path

.vscode

#### 3.1.3.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.3.3.0.0.0.0.0 Contains Files

- settings.json
- launch.json

#### 3.1.3.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.3.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

