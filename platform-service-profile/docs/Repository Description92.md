# 1 Id

REPO-SVC-PRF

# 2 Name

platform-service-profile

# 3 Description

This microservice manages all data related to a user's professional profile, serving as the system of record for their professional identity as specified in SRS section 1.2. Its responsibilities include the creation, retrieval, updating, and deletion of profile sections like basic information (name, headline), work experience, education, and skills. It also handles profile media (pictures, banners) and profile visibility settings. Extracted from the 'platform-api' monorepo, this service owns the UserProfile and related satellite tables (WorkExperience, Education, etc.). It publishes events when a profile is updated so that downstream consumers, like the Search service, can update their own data stores. It provides a gRPC interface for other services to fetch profile information.

# 4 Type

🔹 Business Logic

# 5 Namespace

Platform.Services.Profile

# 6 Output Path

services/profile

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

REQ-1-008

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-009

## 13.3.0 Requirement Id

### 13.3.1 Requirement Id

REQ-1-010

## 13.4.0 Requirement Id

### 13.4.1 Requirement Id

REQ-1-011

## 13.5.0 Requirement Id

### 13.5.1 Requirement Id

REQ-1-012

## 13.6.0 Requirement Id

### 13.6.1 Requirement Id

REQ-1-013

## 13.7.0 Requirement Id

### 13.7.1 Requirement Id

REQ-1-014

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservice

# 17.0.0 Architecture Map

- user-profile-service-003

# 18.0.0 Components Map

- user-profile-service-002

# 19.0.0 Requirements Map

- REQ-1-008

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-02-API

## 20.3.0 Decomposition Reasoning

User profile data represents a clear and cohesive business domain. Separating it into its own service allows it to be scaled independently based on read/write patterns for profiles, and enables a dedicated team to own the evolution of the professional identity model without impacting other parts of the platform.

## 20.4.0 Extracted Responsibilities

- CRUD operations for all profile sections
- Management of profile pictures and banners
- Enforcement of profile visibility rules
- Publishing 'UserProfileUpdated' events

## 20.5.0 Reusability Scope

- Provides a canonical source of user profile data that can be consumed by any current or future service in the ecosystem.

## 20.6.0 Development Benefits

- Clear ownership of the user's professional data model.
- Ability to optimize storage and caching strategies specifically for profile data (e.g., Redis for hot profiles).

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Svc-Idt

### 21.1.1 Required Interfaces

*No items available*

### 21.1.2 Integration Pattern

Consumes 'UserRegistered' event to create a default profile stub.

### 21.1.3 Communication Protocol

Event Bus (SNS/SQS)

## 21.2.0 Repo-Svc-Search

### 21.2.1 Required Interfaces

*No items available*

### 21.2.2 Integration Pattern

Publishes 'UserProfileUpdated' event to trigger re-indexing.

### 21.2.3 Communication Protocol

Event Bus (SNS/SQS)

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'ProfileService (gRPC)', 'methods': ['getProfileByUserId(UserIdRequest) : ProfileResponse', 'updateProfile(UpdateProfileRequest) : ProfileResponse'], 'events': ['UserProfileUpdated(userId, updatedFields)'], 'properties': [], 'consumers': ['REPO-GW-API', 'REPO-SVC-POSTS']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Publishes events on profile changes. Consumes even... |
| Data Flow | Single source of truth for UserProfile, WorkExperi... |
| Error Handling | Uses gRPC codes like NOT_FOUND if a profile doesn'... |
| Async Patterns | Asynchronous event publishing and media uploads to... |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Use Prisma as the ORM for type-safe database acces... |
| Performance Considerations | Profile reads are frequent. Implement a robust wri... |
| Security Considerations | Implement strict authorization checks to ensure a ... |
| Testing Approach | Integration tests to cover all CRUD operations and... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- All profile fields as per SRS 1.2.1.
- Profile visibility logic (public/private).
- Input validation for all fields (e.g., character limits).

## 25.2.0 Must Not Implement

- User authentication or credential management.
- Social graph logic (connections).
- Content like posts or comments.

## 25.3.0 Extension Points

- Adding new sections to the profile (e.g., Certifications, Publications).
- Integration with third-party services to import profile data.

## 25.4.0 Validation Rules

- Character limits on text fields (name, headline).
- Logical validation of dates (start date <= end date).
- Validation of media uploads (file type, size).

