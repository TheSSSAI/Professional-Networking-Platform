# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | REPO-SVC-PRF |
| Extraction Timestamp | 2024-05-24T10:00:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 100% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-008

#### 1.2.1.2 Requirement Text

The system shall allow users to create and edit a 'Basic Information' section on their profile. This section must include fields for Name (text, max 100 chars), Professional Headline (text, max 220 chars), Current Location (text), and Contact Details (email, phone). The system must enforce the specified character limits and perform input validation on all fields. Users must be able to configure the visibility of their contact details.

#### 1.2.1.3 Validation Criteria

- Verify a user can input and save their Name, Headline, Location, and Contact Details.
- Verify that input exceeding the character limit for Name (100) and Headline (220) is rejected or truncated.
- Verify that the user can set visibility for their email and phone number (e.g., to connections only, or private).
- Verify server-side validation prevents invalid data submission.

#### 1.2.1.4 Implementation Implications

- The service must expose a method (e.g., updateProfile) to modify these fields.
- Server-side validation logic for character limits and data types must be implemented in the service layer or DTOs.
- The database schema for the UserProfile entity must include these fields with appropriate data types and constraints.

#### 1.2.1.5 Extraction Reasoning

This requirement directly defines the core responsibility of the Profile service to manage a user's basic identity information.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-009

#### 1.2.2.2 Requirement Text

The system shall allow users to add, edit, and delete entries in a 'Work Experience' section on their profile. Each entry must include fields for Company, Title, Start Date, End Date, and a Description of responsibilities. The system must enforce logical validation for dates, ensuring the end date is not before the start date.

#### 1.2.2.3 Validation Criteria

- Verify a user can add a new work experience entry with all required fields.
- Verify a user can edit an existing work experience entry.
- Verify a user can delete a work experience entry.
- Verify the system prevents a user from saving an entry where the end date is earlier than the start date.

#### 1.2.2.4 Implementation Implications

- The service needs to manage the full lifecycle (CRUD) of WorkExperience entities.
- The database schema requires a WorkExperience table with a foreign key relationship to the UserProfile table.
- Business logic must be implemented to validate date ranges upon creation and update.

#### 1.2.2.5 Extraction Reasoning

This requirement defines the management of the 'Work Experience' entity, which is a key responsibility of the Profile service.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-010

#### 1.2.3.2 Requirement Text

The system shall allow users to add, edit, and delete entries in an 'Education' section on their profile. Each entry must include fields for Institution, Degree, Field of Study, Start Date, and End Date. The system must enforce logical validation for dates.

#### 1.2.3.3 Validation Criteria

- Verify a user can add a new education entry with all required fields.
- Verify a user can edit an existing education entry.
- Verify a user can delete an education entry.
- Verify the system prevents a user from saving an entry where the end date is earlier than the start date.

#### 1.2.3.4 Implementation Implications

- The service needs to manage the full lifecycle (CRUD) of Education entities.
- The database schema requires an Education table with a foreign key relationship to the UserProfile table.
- Business logic must be implemented to validate date ranges upon creation and update.

#### 1.2.3.5 Extraction Reasoning

This requirement defines the management of the 'Education' entity, which is a core responsibility of the Profile service.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-011

#### 1.2.4.2 Requirement Text

The system shall provide a 'Skills' section on the user profile where users can list their professional skills. Users who are first-degree connections must be able to endorse these skills, and the profile shall display a count of endorsements for each skill.

#### 1.2.4.3 Validation Criteria

- Verify a user can add multiple skills to their profile.
- Verify a user can remove skills from their profile.
- Verify a first-degree connection can click to endorse a skill.
- Verify the endorsement count for a skill increments when endorsed.

#### 1.2.4.4 Implementation Implications

- This service must manage the user's list of skills (CRUD operations).
- The database schema must support a many-to-many relationship between profiles and skills.
- While the endorsement action is handled by the Engagement service, this service's schema must include a denormalized 'endorsementCount' field that can be updated.

#### 1.2.4.5 Extraction Reasoning

This requirement defines this service's responsibility for managing the 'Skill' entities associated with a profile.

### 1.2.5.0 Requirement Id

#### 1.2.5.1 Requirement Id

REQ-1-012

#### 1.2.5.2 Requirement Text

The system shall allow users to upload, change, and remove a profile picture and a background banner image. The system must validate that uploaded files are in JPEG or PNG format and that the file size does not exceed 5MB.

#### 1.2.5.3 Validation Criteria

- Verify a user can upload a valid JPEG or PNG file under 5MB as a profile picture.
- Verify the system rejects files that are not JPEG or PNG format.
- Verify the system rejects files that exceed the 5MB size limit.

#### 1.2.5.4 Implementation Implications

- The service must expose methods for generating pre-signed S3 URLs for client-side uploads.
- The service must expose a method to confirm an upload and update the user's profile with the new media URL.
- Server-side validation for file type and size is critical upon confirmation.
- The UserProfile schema must store URLs for the profile picture and banner image.

#### 1.2.5.5 Extraction Reasoning

This requirement specifies the management of profile media, a core responsibility of the Profile service that involves integration with AWS S3.

### 1.2.6.0 Requirement Id

#### 1.2.6.1 Requirement Id

REQ-1-013

#### 1.2.6.2 Requirement Text

The system shall allow users to define a custom public profile URL slug. The system must enforce that this URL is globally unique across all users. The format of the slug must be validated to allow only alphanumeric characters and dashes.

#### 1.2.6.3 Validation Criteria

- Verify a user can set a custom profile URL that meets the format requirements.
- Verify the system prevents a user from setting a URL that is already in use.
- Verify the system rejects URLs containing invalid characters.

#### 1.2.6.4 Implementation Implications

- The UserProfile schema must include a field for customUrlSlug with a unique constraint.
- The service must implement validation logic for both format and uniqueness, handling potential race conditions during updates.

#### 1.2.6.5 Extraction Reasoning

This requirement defines the management of a user's unique profile identifier, a key piece of their identity managed by this service.

### 1.2.7.0 Requirement Id

#### 1.2.7.1 Requirement Id

REQ-1-014

#### 1.2.7.2 Requirement Text

The system shall provide users with a setting to control their profile's visibility, with options for 'Public' and 'Private'. If set to 'Public', the user's full profile is visible to all users on the platform. If set to 'Private', only first-degree connections can view the full profile, while non-connections can only see the user's Name, Profile Picture, and Headline.

#### 1.2.7.3 Validation Criteria

- Verify a user can switch their profile visibility between 'Public' and 'Private'.
- Verify that for a 'Private' profile, a non-connection user can only see the Name, Profile Picture, and Headline.
- Verify that for a 'Private' profile, a first-degree connection can see the full profile details.

#### 1.2.7.4 Implementation Implications

- The UserProfile schema needs a visibility field (e.g., an ENUM of 'PUBLIC', 'PRIVATE').
- The gRPC method getProfileByUserId must accept the requester's ID to check connection status and return either a full or a partial profile DTO based on this logic.
- Changing visibility must trigger a UserProfileUpdated event to notify the Search service to update its index.

#### 1.2.7.5 Extraction Reasoning

This requirement defines the core access control logic for profile data, which must be enforced by the Profile service as the data owner.

## 1.3.0.0 Relevant Components

- {'component_name': 'User Profile Service', 'component_specification': 'This service is the system of record for all user profile data, including basic information, work experience, education, skills, media, and privacy settings. It provides a gRPC interface for other services to query and modify profile data, and publishes events upon data changes.', 'implementation_requirements': ['Implement all CRUD operations for Profile, WorkExperience, Education, and Skill entities using Prisma ORM.', 'Enforce strict authorization: a user can only modify their own profile.', 'Implement business logic for validating profile data (character limits, date ranges).', 'Implement profile visibility logic within the getProfile method.', 'Integrate with Redis for write-through caching of frequently accessed profiles.', 'Publish UserProfileUpdated events to an SNS topic after any data modification.', 'Implement an event consumer for UserRegistered events from an SQS queue to create profile stubs.'], 'architectural_context': "A business logic microservice within the 'Application Services Layer'. It owns a specific bounded context (professional identity) and communicates with other services via gRPC and an event bus.", 'extraction_reasoning': 'The repository platform-service-profile is the direct and complete implementation of this logical component as defined in the system architecture.'}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Application Services Layer (Backend Microservices)', 'layer_responsibilities': 'Implements the core business logic of the application within distinct service boundaries. Services in this layer manage their own data and communicate with other services via gRPC (synchronous) and an event bus (asynchronous).', 'layer_constraints': ['Services must be stateless to allow for horizontal scaling.', 'Services must be packaged as Docker containers and orchestrated by Kubernetes.', 'Inter-service communication must use gRPC.'], 'implementation_patterns': ['Domain-Driven Design (DDD)', 'Event-Driven Architecture', 'API Gateway'], 'extraction_reasoning': "The repository is explicitly mapped to this layer. Its technology stack (NestJS, gRPC), purpose (business logic for a specific domain), and communication patterns (gRPC, event publishing) align perfectly with the layer's definition."}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

UserRegistered Event

#### 1.5.1.2 Source Repository

REPO-SVC-IDT

#### 1.5.1.3 Method Contracts

- {'method_name': 'N/A (Event Consumption)', 'method_signature': 'EventPayload: { userId: string, email: string, name: string }', 'method_purpose': 'To notify the Profile service that a new user has been created, so a default profile stub can be provisioned.', 'integration_context': 'This service will consume this event asynchronously from an SQS queue which is subscribed to an SNS topic published by the Identity service. Upon receipt, it creates a new UserProfile record.'}

#### 1.5.1.4 Integration Pattern

Event-Driven (Pub/Sub)

#### 1.5.1.5 Communication Protocol

AWS SNS/SQS

#### 1.5.1.6 Extraction Reasoning

The repository's dependency contracts explicitly state that this service consumes the 'UserRegistered' event from the Identity service to bootstrap new profiles, ensuring eventual consistency.

### 1.5.2.0 Interface Name

#### 1.5.2.1 Interface Name

IConnectionsService

#### 1.5.2.2 Source Repository

REPO-SVC-CONN

#### 1.5.2.3 Method Contracts

- {'method_name': 'areUsersConnected', 'method_signature': 'areUsersConnected(request: { userAId: string, userBId: string }): Promise<{ areConnected: boolean }>', 'method_purpose': 'To check if a first-degree connection exists between two users.', 'integration_context': "Called synchronously by this service's `getProfileByUserId` method to enforce the visibility rule for private profiles, as required by REQ-1-014."}

#### 1.5.2.4 Integration Pattern

Synchronous Request/Response

#### 1.5.2.5 Communication Protocol

gRPC

#### 1.5.2.6 Extraction Reasoning

This dependency is essential for implementing the privacy and access control logic of REQ-1-014. The Profile Service must query the authoritative source for connection data to make visibility decisions.

### 1.5.3.0 Interface Name

#### 1.5.3.1 Interface Name

IPlatformContracts

#### 1.5.3.2 Source Repository

REPO-LIB-CONTRACTS

#### 1.5.3.3 Method Contracts

*No items available*

#### 1.5.3.4 Integration Pattern

Build-Time Dependency (NPM Package)

#### 1.5.3.5 Communication Protocol

TypeScript/Protobuf/GraphQL Imports

#### 1.5.3.6 Extraction Reasoning

As a NestJS microservice that exposes a gRPC API and consumes both events and other gRPC APIs, this service has a build-time dependency on the central contracts library for all its communication schemas and type definitions.

### 1.5.4.0 Interface Name

#### 1.5.4.1 Interface Name

IPlatformCoreLibs

#### 1.5.4.2 Source Repository

REPO-LIB-CORE

#### 1.5.4.3 Method Contracts

*No items available*

#### 1.5.4.4 Integration Pattern

Build-Time Dependency (NPM Package)

#### 1.5.4.5 Communication Protocol

TypeScript/NestJS Imports

#### 1.5.4.6 Extraction Reasoning

This service is a standard NestJS microservice and will depend on the core library for cross-cutting concerns like observability (logging, tracing, metrics), standardized error handling, and security primitives.

## 1.6.0.0 Exposed Interfaces

### 1.6.1.0 Interface Name

#### 1.6.1.1 Interface Name

IProfileService

#### 1.6.1.2 Consumer Repositories

- REPO-GW-API
- REPO-SVC-POSTS
- REPO-SVC-SEARCH
- REPO-SVC-CONN
- REPO-SVC-MSG
- REPO-SVC-NOTIFY

#### 1.6.1.3 Method Contracts

##### 1.6.1.3.1 Method Name

###### 1.6.1.3.1.1 Method Name

getProfileByUserId

###### 1.6.1.3.1.2 Method Signature

getProfileByUserId(request: { targetUserId: string, requestingUserId: string }) : ProfileResponse

###### 1.6.1.3.1.3 Method Purpose

Retrieves a user's profile. Enforces visibility rules based on the connection status between the requesting user and the target user.

###### 1.6.1.3.1.4 Implementation Requirements

Must check the target user's visibility setting. If 'Private', it must query the Connection service to determine the relationship with requestingUserId before returning either a full or partial ProfileResponse. This call should be heavily cached in Redis.

##### 1.6.1.3.2.0 Method Name

###### 1.6.1.3.2.1 Method Name

updateBasicInfo

###### 1.6.1.3.2.2 Method Signature

updateBasicInfo(request: UpdateProfileRequest) : ProfileResponse

###### 1.6.1.3.2.3 Method Purpose

Updates fields on a user's profile, such as name and headline.

###### 1.6.1.3.2.4 Implementation Requirements

Must perform an authorization check to ensure the authenticated user (from gRPC metadata) matches the owner of the profile being updated. Must publish a UserProfileUpdated event upon successful database commit.

##### 1.6.1.3.3.0 Method Name

###### 1.6.1.3.3.1 Method Name

addWorkExperience

###### 1.6.1.3.3.2 Method Signature

addWorkExperience(request: AddWorkExperienceRequest) : WorkExperienceResponse

###### 1.6.1.3.3.3 Method Purpose

Adds a new work experience entry to a user's profile.

###### 1.6.1.3.3.4 Implementation Requirements

Must perform authorization check and publish a UserProfileUpdated event.

##### 1.6.1.3.4.0 Method Name

###### 1.6.1.3.4.1 Method Name

generateUploadUrl

###### 1.6.1.3.4.2 Method Signature

generateUploadUrl(request: GenerateUploadUrlRequest): GenerateUploadUrlResponse

###### 1.6.1.3.4.3 Method Purpose

Generates a pre-signed S3 URL for secure, direct client-side file uploads.

###### 1.6.1.3.4.4 Implementation Requirements

Must perform authorization check and validate file metadata (type, size) as per REQ-1-012.

#### 1.6.1.4.0.0 Service Level Requirements

- P95 latency for getProfileByUserId must be < 200ms.
- Service availability must be >= 99.9%.

#### 1.6.1.5.0.0 Implementation Constraints

- Communication must be via gRPC, adhering to the contract in REPO-LIB-CONTRACTS.
- Error handling must use standard gRPC status codes (e.g., NOT_FOUND, PERMISSION_DENIED).

#### 1.6.1.6.0.0 Extraction Reasoning

The repository definition explicitly exposes this gRPC service for consumption by other backend services to provide authoritative profile data.

### 1.6.2.0.0.0 Interface Name

#### 1.6.2.1.0.0 Interface Name

UserProfileUpdated Event

#### 1.6.2.2.0.0 Consumer Repositories

- REPO-SVC-SEARCH

#### 1.6.2.3.0.0 Method Contracts

- {'method_name': 'N/A (Event Publication)', 'method_signature': 'EventPayload: { userId: string, updatedFields: string[], timestamp: string }', 'method_purpose': "To notify downstream services that a user's profile data has changed, allowing them to update their own caches or indexes.", 'implementation_requirements': "This event must be published to a dedicated SNS topic after any successful database transaction that modifies a user's profile data. The event payload is lightweight to trigger a subsequent fetch by the consumer."}

#### 1.6.2.4.0.0 Service Level Requirements

- Event must be published within 100ms of the database commit.

#### 1.6.2.5.0.0 Implementation Constraints

- The event payload must be versioned to allow for future schema changes.

#### 1.6.2.6.0.0 Extraction Reasoning

The repository's responsibilities and dependency contracts explicitly state that it must publish this event to trigger re-indexing in the Search service, which is a core part of the system's CQRS pattern.

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The service must be built using NestJS with TypeScript. It will use Prisma as the ORM to interact with the PostgreSQL database. gRPC will be used for inter-service communication.

### 1.7.2.0.0.0 Integration Technologies

- Prisma (ORM for PostgreSQL)
- gRPC (@nestjs/microservices)
- Redis (via @nestjs/cache-manager or similar for caching)
- AWS SDK (for publishing SNS events and handling S3 uploads)

### 1.7.3.0.0.0 Performance Constraints

Profile reads are a high-frequency operation. A read-through/write-through caching strategy using Redis (UserProfileCache) must be implemented for the getProfileByUserId method to minimize database load and meet the <200ms P95 latency requirement. Outbound gRPC calls for authorization checks should also be cached with a short TTL.

### 1.7.4.0.0.0 Security Requirements

The service must implement strict authorization checks on all write operations (update, delete) to ensure a user can only modify their own profile. The gRPC interceptors should be used to extract the authenticated user ID from call metadata for these checks. All visibility rules for read operations must be enforced server-side.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | The repository's defined scope, requirements, and ... |
| Cross Reference Validation | All cross-references have been validated. The requ... |
| Implementation Readiness Assessment | The repository is highly implementation-ready. The... |
| Quality Assurance Confirmation | The context extraction is confirmed to be of high ... |

