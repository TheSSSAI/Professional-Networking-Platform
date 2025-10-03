# 1 System Overview

## 1.1 Analysis Date

2025-06-13

## 1.2 Technology Stack

- Next.js
- React
- TypeScript
- Node.js
- NestJS
- GraphQL
- gRPC
- PostgreSQL
- Redis
- OpenSearch

## 1.3 Service Interfaces

- GraphQL API (Client-facing)
- gRPC (Internal service-to-service)
- Event Bus (SNS/SQS for async communication)

## 1.4 Data Models

- User
- UserProfile
- WorkExperience
- Education
- Skill
- Connection
- Post
- Comment
- Message
- Notification

# 2.0 Data Mapping Strategy

## 2.1 Essential Mappings

### 2.1.1 Mapping Id

#### 2.1.1.1 Mapping Id

MAP-001

#### 2.1.1.2 Source

PostgreSQL (UserProfile, WorkExperience, Education, Skill tables)

#### 2.1.1.3 Target

OpenSearch (UserSearchDocument)

#### 2.1.1.4 Transformation

aggregation

#### 2.1.1.5 Configuration

##### 2.1.1.5.1 Flatten Fields

✅ Yes

##### 2.1.1.5.2 Aggregate Arrays

- skills
- companyNames
- jobTitles

#### 2.1.1.6.0 Mapping Technique

Event-driven update on UserProfileUpdated event

#### 2.1.1.7.0 Justification

Required by REQ-1-031 to power advanced user search capabilities. A denormalized document is needed for efficient full-text search.

#### 2.1.1.8.0 Complexity

medium

### 2.1.2.0.0 Mapping Id

#### 2.1.2.1.0 Mapping Id

MAP-002

#### 2.1.2.2.0 Source

PostgreSQL Entities (e.g., Post, UserProfile)

#### 2.1.2.3.0 Target

GraphQL DTOs

#### 2.1.2.4.0 Transformation

direct

#### 2.1.2.5.0 Configuration

##### 2.1.2.5.1 Field Exclusion

- passwordHash
- mfaSecret

##### 2.1.2.5.2 Computed Fields

- isOwnProfile

#### 2.1.2.6.0 Mapping Technique

Object-to-object mapping within resolver functions

#### 2.1.2.7.0 Justification

Required by REQ-1-086 to serve data to the client application via a structured and secure API, hiding internal data structures.

#### 2.1.2.8.0 Complexity

medium

### 2.1.3.0.0 Mapping Id

#### 2.1.3.1.0 Mapping Id

MAP-003

#### 2.1.3.2.0 Source

Domain Models (e.g., Post)

#### 2.1.3.3.0 Target

Event Payloads (e.g., PostCreated event)

#### 2.1.3.4.0 Transformation

direct

#### 2.1.3.5.0 Configuration

##### 2.1.3.5.1 Schema Version

1.0

##### 2.1.3.5.2 Required Fields

- postId
- authorId
- createdAt

#### 2.1.3.6.0 Mapping Technique

DTO conversion before publishing to event bus

#### 2.1.3.7.0 Justification

Core to the event-driven architecture for decoupling services. Ensures a stable contract for asynchronous communication.

#### 2.1.3.8.0 Complexity

simple

### 2.1.4.0.0 Mapping Id

#### 2.1.4.1.0 Mapping Id

MAP-004

#### 2.1.4.2.0 Source

GraphQL Input Types (e.g., CreatePostInput)

#### 2.1.4.3.0 Target

PostgreSQL Entities (e.g., Post)

#### 2.1.4.4.0 Transformation

direct

#### 2.1.4.5.0 Configuration

##### 2.1.4.5.1 Validation

Server-side validation rules applied before mapping

#### 2.1.4.6.0 Mapping Technique

Input-to-entity mapping in service layer

#### 2.1.4.7.0 Justification

Required to persist data submitted by users through the API.

#### 2.1.4.8.0 Complexity

simple

## 2.2.0.0.0 Object To Object Mappings

- {'sourceObject': 'UserProfile (and related entities)', 'targetObject': 'UserSearchDocument', 'fieldMappings': [{'sourceField': 'UserProfile.fullName', 'targetField': 'fullName', 'transformation': 'direct', 'dataTypeConversion': 'none'}, {'sourceField': 'UserProfile.headline', 'targetField': 'headline', 'transformation': 'direct', 'dataTypeConversion': 'none'}, {'sourceField': 'WorkExperience[].companyName', 'targetField': 'companies', 'transformation': 'aggregation (array)', 'dataTypeConversion': 'none'}, {'sourceField': 'Skill[].skillName', 'targetField': 'skills', 'transformation': 'aggregation (array)', 'dataTypeConversion': 'none'}, {'sourceField': 'UserProfile.visibility', 'targetField': 'visibility', 'transformation': 'direct', 'dataTypeConversion': 'none'}]}

## 2.3.0.0.0 Data Type Conversions

- {'from': 'PostgreSQL DateTime', 'to': 'ISO 8601 String', 'conversionMethod': 'Standard library date formatting', 'validationRequired': False}

## 2.4.0.0.0 Bidirectional Mappings

- {'entity': 'UserProfile', 'forwardMapping': 'DB Entity to GraphQL DTO', 'reverseMapping': 'GraphQL Input to DB Entity', 'consistencyStrategy': 'The User Profile Service is the single source of truth and manages all transformations, ensuring consistency.'}

# 3.0.0.0.0 Schema Validation Requirements

## 3.1.0.0.0 Field Level Validations

### 3.1.1.0.0 Field

#### 3.1.1.1.0 Field

User.password

#### 3.1.1.2.0 Rules

- minLength(12)
- requires_uppercase
- requires_lowercase
- requires_number
- requires_special_character

#### 3.1.1.3.0 Priority

🚨 critical

#### 3.1.1.4.0 Error Message

Password does not meet complexity requirements.

### 3.1.2.0.0 Field

#### 3.1.2.1.0 Field

UserProfile.fullName

#### 3.1.2.2.0 Rules

- maxLength(100)

#### 3.1.2.3.0 Priority

🔴 high

#### 3.1.2.4.0 Error Message

Full name cannot exceed 100 characters.

### 3.1.3.0.0 Field

#### 3.1.3.1.0 Field

Post.textContent

#### 3.1.3.2.0 Rules

- maxLength(3000)

#### 3.1.3.3.0 Priority

🔴 high

#### 3.1.3.4.0 Error Message

Post text cannot exceed 3000 characters.

### 3.1.4.0.0 Field

#### 3.1.4.1.0 Field

User.email

#### 3.1.4.2.0 Rules

- isEmail

#### 3.1.4.3.0 Priority

🚨 critical

#### 3.1.4.4.0 Error Message

Please provide a valid email address.

## 3.2.0.0.0 Cross Field Validations

- {'validationId': 'VAL-CF-001', 'fields': ['WorkExperience.startDate', 'WorkExperience.endDate'], 'rule': 'endDate must be greater than or equal to startDate if present.', 'condition': 'endDate IS NOT NULL', 'errorHandling': 'Reject API request with a 400 Bad Request error.'}

## 3.3.0.0.0 Business Rule Validations

### 3.3.1.0.0 Rule Id

#### 3.3.1.1.0 Rule Id

VAL-BIZ-001

#### 3.3.1.2.0 Description

User must be at least 16 years old to register.

#### 3.3.1.3.0 Fields

- User.dateOfBirth

#### 3.3.1.4.0 Logic

Calculate age from dateOfBirth and check if age >= 16.

#### 3.3.1.5.0 Priority

🚨 critical

### 3.3.2.0.0 Rule Id

#### 3.3.2.1.0 Rule Id

VAL-BIZ-002

#### 3.3.2.2.0 Description

Cannot send a connection request if one is already pending in either direction.

#### 3.3.2.3.0 Fields

- Connection.requesterId
- Connection.addresseeId

#### 3.3.2.4.0 Logic

Query Connection table for an existing pending request between the two users before inserting a new one.

#### 3.3.2.5.0 Priority

🔴 high

## 3.4.0.0.0 Conditional Validations

- {'condition': "UserProfile.visibility == 'private'", 'applicableFields': ['headline', 'location', 'workExperience', 'education'], 'validationRules': ['Validation for search indexing: These fields should not be indexed for search by non-connections.']}

## 3.5.0.0.0 Validation Groups

- {'groupName': 'UserRegistration', 'validations': ['Email format', 'Password complexity', 'Date of birth (Age >= 16)'], 'executionOrder': 1, 'stopOnFirstFailure': True}

# 4.0.0.0.0 Transformation Pattern Evaluation

## 4.1.0.0.0 Selected Patterns

### 4.1.1.0.0 Pattern

#### 4.1.1.1.0 Pattern

adapter

#### 4.1.1.2.0 Use Case

The Search Service acts as an adapter between the User Profile domain and the OpenSearch indexing API.

#### 4.1.1.3.0 Implementation

A dedicated handler in the Search Service consumes UserProfileUpdated events and transforms the payload into a valid OpenSearch document.

#### 4.1.1.4.0 Justification

Decouples the core domain logic from the specific implementation details of the search engine.

### 4.1.2.0.0 Pattern

#### 4.1.2.1.0 Pattern

translator

#### 4.1.2.2.0 Use Case

Translating internal domain models into canonical event DTOs before publishing to the event bus.

#### 4.1.2.3.0 Implementation

A shared TypeScript library with DTO definitions is used across services. A dedicated mapper class in the producer service performs the translation.

#### 4.1.2.4.0 Justification

Ensures a stable, versioned contract for asynchronous communication, preventing producer changes from breaking consumers.

### 4.1.3.0.0 Pattern

#### 4.1.3.1.0 Pattern

pipeline

#### 4.1.3.2.0 Use Case

News feed fan-out on write.

#### 4.1.3.3.0 Implementation

PostCreated event -> SQS Queue -> Feed Service consumer -> Fetch connections -> Push post ID to multiple Redis lists (one per connection).

#### 4.1.3.4.0 Justification

Required by REQ-1-020 for a scalable and performant news feed. A pipeline orchestrates the multi-step asynchronous workflow.

## 4.2.0.0.0 Pipeline Processing

### 4.2.1.0.0 Required

✅ Yes

### 4.2.2.0.0 Stages

#### 4.2.2.1.0 Stage

##### 4.2.2.1.1 Stage

Ingestion

##### 4.2.2.1.2 Transformation

Consume PostCreated event from SQS.

##### 4.2.2.1.3 Dependencies

*No items available*

#### 4.2.2.2.0 Stage

##### 4.2.2.2.1 Stage

Enrichment

##### 4.2.2.2.2 Transformation

Fetch list of connection IDs for the post author.

##### 4.2.2.2.3 Dependencies

- Ingestion

#### 4.2.2.3.0 Stage

##### 4.2.2.3.1 Stage

Distribution

##### 4.2.2.3.2 Transformation

Iterate and push post ID to each connection's feed list in Redis.

##### 4.2.2.3.3 Dependencies

- Enrichment

### 4.2.3.0.0 Parallelization

✅ Yes

## 4.3.0.0.0 Processing Mode

### 4.3.1.0.0 Real Time

#### 4.3.1.1.0 Required

✅ Yes

#### 4.3.1.2.0 Scenarios

- Indexing user profile updates in OpenSearch.
- Generating notifications from user interactions.

#### 4.3.1.3.0 Latency Requirements

P95 < 5 seconds from event creation to processing completion.

### 4.3.2.0.0 Batch

| Property | Value |
|----------|-------|
| Required | ✅ |
| Batch Size | 1000 |
| Frequency | Daily |

### 4.3.3.0.0 Streaming

| Property | Value |
|----------|-------|
| Required | ❌ |
| Streaming Framework | N/A |
| Windowing Strategy | N/A |

## 4.4.0.0.0 Canonical Data Model

### 4.4.1.0.0 Applicable

✅ Yes

### 4.4.2.0.0 Scope

- Event Payloads

### 4.4.3.0.0 Benefits

- Decouples services
- Provides a stable contract for communication
- Simplifies integration between services

# 5.0.0.0.0 Version Handling Strategy

## 5.1.0.0.0 Schema Evolution

### 5.1.1.0.0 Strategy

Additive changes only.

### 5.1.2.0.0 Versioning Scheme

Semantic versioning (e.g., v1.0, v1.1) in event metadata.

### 5.1.3.0.0 Compatibility

| Property | Value |
|----------|-------|
| Backward | ✅ |
| Forward | ❌ |
| Reasoning | Consumers must be tolerant of new, optional fields... |

## 5.2.0.0.0 Transformation Versioning

| Property | Value |
|----------|-------|
| Mechanism | Code versioning in Git. Transformation logic is ve... |
| Version Identification | Git commit hash and semantic version tag of the se... |
| Migration Strategy | Deploy new consumer code capable of handling both ... |

## 5.3.0.0.0 Data Model Changes

| Property | Value |
|----------|-------|
| Migration Path | Automated database migration scripts (e.g., using ... |
| Rollback Strategy | Execute 'down' migration scripts to revert schema ... |
| Validation Strategy | Run integration tests against the migrated schema ... |

## 5.4.0.0.0 Schema Registry

| Property | Value |
|----------|-------|
| Required | ❌ |
| Technology | N/A |
| Governance | A shared TypeScript library for event DTOs, manage... |

# 6.0.0.0.0 Performance Optimization

## 6.1.0.0.0 Critical Requirements

### 6.1.1.0.0 Operation

#### 6.1.1.1.0 Operation

Feed Generation (Fan-out)

#### 6.1.1.2.0 Max Latency

P95 < 2 seconds for a post to appear in connections' feeds.

#### 6.1.1.3.0 Throughput Target

Support 1000 posts per minute.

#### 6.1.1.4.0 Justification

User experience for the news feed is a core product feature (REQ-1-020).

### 6.1.2.0.0 Operation

#### 6.1.2.1.0 Operation

Search Indexing

#### 6.1.2.2.0 Max Latency

P95 < 5 seconds for a profile update to be reflected in search results.

#### 6.1.2.3.0 Throughput Target

Support 50 profile updates per second.

#### 6.1.2.4.0 Justification

Ensures data consistency between the user profile and search results (REQ-1-031).

## 6.2.0.0.0 Parallelization Opportunities

- {'transformation': 'Feed fan-out', 'parallelizationStrategy': 'Increase the number of concurrent consumers (pods) for the Feed Service SQS queue.', 'expectedGain': 'Near-linear increase in post processing throughput.'}

## 6.3.0.0.0 Caching Strategies

- {'cacheType': 'In-Memory (Redis)', 'cacheScope': 'User Profile Objects, User Connection Lists', 'evictionPolicy': 'LRU (Least Recently Used) with a TTL.', 'applicableTransformations': ['DB_Models_to_GraphQL_API', 'Post_to_Feed_Entry (to fetch connection lists quickly)']}

## 6.4.0.0.0 Memory Optimization

### 6.4.1.0.0 Techniques

- Use of lean DTOs in event payloads, avoiding unnecessary data.

### 6.4.2.0.0 Thresholds

Monitor container memory usage via Prometheus; set alerts at 80% of allocated limit.

### 6.4.3.0.0 Monitoring Required

✅ Yes

## 6.5.0.0.0 Lazy Evaluation

### 6.5.1.0.0 Applicable

❌ No

### 6.5.2.0.0 Scenarios

*No items available*

### 6.5.3.0.0 Implementation

N/A

## 6.6.0.0.0 Bulk Processing

### 6.6.1.0.0 Required

✅ Yes

### 6.6.2.0.0 Batch Sizes

#### 6.6.2.1.0 Optimal

1,000

#### 6.6.2.2.0 Maximum

5,000

### 6.6.3.0.0 Parallelism

4

# 7.0.0.0.0 Error Handling And Recovery

## 7.1.0.0.0 Error Handling Strategies

### 7.1.1.0.0 Error Type

#### 7.1.1.1.0 Error Type

Event processing failure (transient)

#### 7.1.1.2.0 Strategy

Retry with exponential backoff

#### 7.1.1.3.0 Fallback Action

Move to Dead Letter Queue (DLQ) after max retries.

#### 7.1.1.4.0 Escalation Path

- Automated alert to on-call engineer

### 7.1.2.0.0 Error Type

#### 7.1.2.1.0 Error Type

Data validation failure

#### 7.1.2.2.0 Strategy

Reject request

#### 7.1.2.3.0 Fallback Action

Return a 400 Bad Request response with a descriptive error message.

#### 7.1.2.4.0 Escalation Path

*No items available*

## 7.2.0.0.0 Logging Requirements

### 7.2.1.0.0 Log Level

error

### 7.2.2.0.0 Included Data

- correlationId
- serviceName
- errorMessage
- stackTrace
- eventPayload (on failure)

### 7.2.3.0.0 Retention Period

30 days in Loki

### 7.2.4.0.0 Alerting

✅ Yes

## 7.3.0.0.0 Partial Success Handling

### 7.3.1.0.0 Strategy

For fan-out operations (e.g., news feed), process all valid targets and log errors for failed targets individually. Do not roll back the entire operation.

### 7.3.2.0.0 Reporting Mechanism

Log errors to Loki with specific target IDs that failed.

### 7.3.3.0.0 Recovery Actions

- Manual or automated retry for failed targets if necessary.

## 7.4.0.0.0 Circuit Breaking

- {'dependency': 'Internal gRPC services', 'threshold': '50% failure rate over a 1-minute window', 'timeout': '2000ms', 'fallbackStrategy': 'Return a cached response if available, otherwise return an error to the caller.'}

## 7.5.0.0.0 Retry Strategies

- {'operation': 'Event Consumption from SQS', 'maxRetries': 3, 'backoffStrategy': 'exponential', 'retryConditions': ['Transient database connection error', 'Downstream service unavailable (5xx error)']}

## 7.6.0.0.0 Error Notifications

- {'condition': 'Messages in DLQ > 0', 'recipients': ['On-Call Engineering Team'], 'severity': 'critical', 'channel': 'PagerDuty'}

# 8.0.0.0.0 Project Specific Transformations

## 8.1.0.0.0 Profile_to_Search_Index

### 8.1.1.0.0 Transformation Id

PST-001

### 8.1.2.0.0 Name

Profile_to_Search_Index

### 8.1.3.0.0 Description

Aggregates and flattens user profile data from multiple PostgreSQL tables into a single denormalized document for indexing in OpenSearch.

### 8.1.4.0.0 Source

#### 8.1.4.1.0 Service

User Profile Service

#### 8.1.4.2.0 Model

UserProfile, WorkExperience, Education, Skill

#### 8.1.4.3.0 Fields

- fullName
- headline
- location
- companyName
- title
- skillName

### 8.1.5.0.0 Target

#### 8.1.5.1.0 Service

Search Service

#### 8.1.5.2.0 Model

UserSearchDocument

#### 8.1.5.3.0 Fields

- userId
- fullName
- headline
- location
- companies
- skills

### 8.1.6.0.0 Transformation

#### 8.1.6.1.0 Type

🔹 aggregation

#### 8.1.6.2.0 Logic

Triggered by a UserProfileUpdated event. The Search Service consumes the event, fetches the full profile data via gRPC call if needed, transforms it into the search document schema, and indexes it.

#### 8.1.6.3.0 Configuration

*No data available*

### 8.1.7.0.0 Frequency

real-time

### 8.1.8.0.0 Criticality

high

### 8.1.9.0.0 Dependencies

- EVT-PRF-001 (UserProfileUpdated)

### 8.1.10.0.0 Validation

#### 8.1.10.1.0 Pre Transformation

*No items available*

#### 8.1.10.2.0 Post Transformation

- Ensure all required fields for the search document are present.

### 8.1.11.0.0 Performance

| Property | Value |
|----------|-------|
| Expected Volume | Up to 50 updates/sec |
| Latency Requirement | P95 < 5s |
| Optimization Strategy | Batch indexing in the Search Service if multiple u... |

## 8.2.0.0.0 Post_to_Feed_Entry

### 8.2.1.0.0 Transformation Id

PST-002

### 8.2.2.0.0 Name

Post_to_Feed_Entry

### 8.2.3.0.0 Description

Handles the fan-out-on-write process for news feeds upon post creation.

### 8.2.4.0.0 Source

#### 8.2.4.1.0 Service

Posts Service

#### 8.2.4.2.0 Model

Post

#### 8.2.4.3.0 Fields

- postId
- authorId
- createdAt

### 8.2.5.0.0 Target

#### 8.2.5.1.0 Service

Feed Service

#### 8.2.5.2.0 Model

Redis List (User Feed)

#### 8.2.5.3.0 Fields

- postId

### 8.2.6.0.0 Transformation

#### 8.2.6.1.0 Type

🔹 custom

#### 8.2.6.2.0 Logic

Consumes PostCreated event. Fetches the connection list for the authorId from the Connections Service (with caching). Iterates through the list and pushes the postId to each connection's feed list in Redis.

#### 8.2.6.3.0 Configuration

*No data available*

### 8.2.7.0.0 Frequency

real-time

### 8.2.8.0.0 Criticality

critical

### 8.2.9.0.0 Dependencies

- EVT-PST-001 (PostCreated)

### 8.2.10.0.0 Validation

#### 8.2.10.1.0 Pre Transformation

- Verify event payload contains authorId and postId.

#### 8.2.10.2.0 Post Transformation

*No items available*

### 8.2.11.0.0 Performance

| Property | Value |
|----------|-------|
| Expected Volume | Up to 1000 posts/min |
| Latency Requirement | P95 < 2s |
| Optimization Strategy | Parallel processing by multiple Feed Service insta... |

# 9.0.0.0.0 Implementation Priority

## 9.1.0.0.0 Component

### 9.1.1.0.0 Component

GraphQL DTO Transformations (Read/Write)

### 9.1.2.0.0 Priority

🔴 high

### 9.1.3.0.0 Dependencies

*No items available*

### 9.1.4.0.0 Estimated Effort

Medium

### 9.1.5.0.0 Risk Level

low

## 9.2.0.0.0 Component

### 9.2.1.0.0 Component

PST-002: Post_to_Feed_Entry

### 9.2.2.0.0 Priority

🔴 high

### 9.2.3.0.0 Dependencies

- Event Bus Infrastructure

### 9.2.4.0.0 Estimated Effort

Medium

### 9.2.5.0.0 Risk Level

medium

## 9.3.0.0.0 Component

### 9.3.1.0.0 Component

PST-001: Profile_to_Search_Index

### 9.3.2.0.0 Priority

🔴 high

### 9.3.3.0.0 Dependencies

- Event Bus Infrastructure

### 9.3.4.0.0 Estimated Effort

Medium

### 9.3.5.0.0 Risk Level

medium

## 9.4.0.0.0 Component

### 9.4.1.0.0 Component

Server-side Validation Logic

### 9.4.2.0.0 Priority

🔴 high

### 9.4.3.0.0 Dependencies

*No items available*

### 9.4.4.0.0 Estimated Effort

Medium

### 9.4.5.0.0 Risk Level

low

# 10.0.0.0.0 Risk Assessment

## 10.1.0.0.0 Risk

### 10.1.1.0.0 Risk

Data inconsistency between PostgreSQL source of truth and OpenSearch/Redis read models.

### 10.1.2.0.0 Impact

high

### 10.1.3.0.0 Probability

medium

### 10.1.4.0.0 Mitigation

Ensure robust event delivery with DLQs. Implement periodic reconciliation jobs to compare and sync data stores.

### 10.1.5.0.0 Contingency Plan

Manual trigger for a full re-indexing or cache warming process.

## 10.2.0.0.0 Risk

### 10.2.1.0.0 Risk

Validation logic drift between client-side (for UX) and server-side (for security).

### 10.2.2.0.0 Impact

medium

### 10.2.3.0.0 Probability

medium

### 10.2.4.0.0 Mitigation

Use a shared validation schema or library (e.g., Zod, Yup) that can be used by both the Next.js frontend and NestJS backend to define validation rules in one place.

### 10.2.5.0.0 Contingency Plan

Rely on authoritative server-side validation and enhance client-side logic post-launch if discrepancies are found.

# 11.0.0.0.0 Recommendations

## 11.1.0.0.0 Category

### 11.1.1.0.0 Category

🔹 Consistency

### 11.1.2.0.0 Recommendation

Implement a shared TypeScript library for all DTOs, including GraphQL types, event payloads, and validation schemas.

### 11.1.3.0.0 Justification

This ensures type safety and consistency across the entire stack (frontend, backend services, events), reducing integration errors and validation logic drift.

### 11.1.4.0.0 Priority

🔴 high

### 11.1.5.0.0 Implementation Notes

This library should be a separate, versioned package imported by all relevant services.

## 11.2.0.0.0 Category

### 11.2.1.0.0 Category

🔹 Resilience

### 11.2.2.0.0 Recommendation

Develop lightweight reconciliation jobs that can run periodically (e.g., nightly) to ensure data consistency between the primary database and read models like OpenSearch.

### 11.2.3.0.0 Justification

In an event-driven system, messages can be missed or fail processing. Reconciliation provides a safety net to correct any resulting data drift over time.

### 11.2.4.0.0 Priority

🟡 medium

### 11.2.5.0.0 Implementation Notes

These jobs should be designed to be idempotent and operate with low impact on the production database.

