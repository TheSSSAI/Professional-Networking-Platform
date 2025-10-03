# 1 Id

REPO-LIB-CORE

# 2 Name

platform-core-libs

# 3 Description

This repository is a shared library containing common, reusable backend implementation logic and utilities for all NestJS-based microservices. Its purpose is to reduce code duplication and enforce consistent patterns for cross-cutting concerns. Extracted from the 'platform-shared' repository, this library contains concrete code, such as custom OpenTelemetry instrumentation wrappers, a standardized logging service, shared NestJS guards for authorization, common error handling classes, and other utility functions. It is published as a versioned private npm package and consumed by all backend services. This separation ensures that shared implementation details can be updated and tested in one place and rolled out consistently across the backend.

# 4 Type

🔹 Cross-Cutting Library

# 5 Namespace

Platform.Core

# 6 Output Path

libs/core

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

TypeScript, NestJS

# 10 Thirdparty Libraries

- @nestjs/common
- @opentelemetry/api

# 11 Layer Ids

- shared-library-layer

# 12 Dependencies

- REPO-LIB-CONTRACTS

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-063

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-083

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Shared Library

# 17.0.0 Architecture Map

*No items available*

# 18.0.0 Components Map

*No items available*

# 19.0.0 Requirements Map

*No items available*

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-05-SHARED

## 20.3.0 Decomposition Reasoning

While contracts define 'what' services communicate, this library defines 'how' they implement common behaviors. Separating this from contracts prevents consumers from inheriting unnecessary implementation dependencies. It provides a home for genuinely shared code, promoting DRY principles without creating a monolithic shared dependency.

## 20.4.0 Extracted Responsibilities

- Standardized logger configuration
- OpenTelemetry tracing and metrics boilerplate
- Shared authorization guards (e.g., 'AuthenticatedUserGuard')
- Common exception filters and custom error classes

## 20.5.0 Reusability Scope

- Consumed by all NestJS microservices to ensure consistent operational behavior.

## 20.6.0 Development Benefits

- Reduces boilerplate code in each microservice.
- Enforces consistency in logging, monitoring, and error handling.
- Makes it easy to roll out updates to cross-cutting concerns.

# 21.0.0 Dependency Contracts

*No data available*

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

### 22.1.1 Interface

#### 22.1.1.1 Interface

LoggerService

#### 22.1.1.2 Methods

- log(message, context)
- error(message, trace, context)

#### 22.1.1.3 Events

*No items available*

#### 22.1.1.4 Properties

*No items available*

#### 22.1.1.5 Consumers

- All REPO-SVC-*

### 22.1.2.0 Interface

#### 22.1.2.1 Interface

JwtAuthGuard

#### 22.1.2.2 Methods

- canActivate(context): boolean

#### 22.1.2.3 Events

*No items available*

#### 22.1.2.4 Properties

*No items available*

#### 22.1.2.5 Consumers

- All REPO-SVC-*

# 23.0.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Provides NestJS modules that can be imported into ... |
| Event Communication | N/A |
| Data Flow | N/A |
| Error Handling | Provides base exception classes and filters for co... |
| Async Patterns | N/A |

# 24.0.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | All shared components should be exposed as NestJS ... |
| Performance Considerations | Shared utilities should be lightweight and have mi... |
| Security Considerations | Shared security components like guards must be rig... |
| Testing Approach | This library must have very high unit test coverag... |

# 25.0.0.0 Scope Boundaries

## 25.1.0.0 Must Implement

- Common utilities that are applicable to at least two or more services.
- Boilerplate for observability and security.

## 25.2.0.0 Must Not Implement

- Any business-specific logic.
- Data contracts or interfaces (these belong in 'platform-contracts').

## 25.3.0.0 Extension Points

- Adding new shared utilities as needed.

## 25.4.0.0 Validation Rules

*No items available*

