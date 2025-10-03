# 1 System Overview

## 1.1 Analysis Date

2025-06-13

## 1.2 Architecture Type

Event-Driven Microservices

## 1.3 Technology Stack

- AWS SNS
- AWS SQS
- Node.js (NestJS)
- OpenTelemetry

## 1.4 Bounded Contexts

- Identity & Access
- User Profile
- Connections
- Posts & Engagement
- Feed Generation
- Search Indexing
- Notifications

# 2.0 Project Specific Events

## 2.1 Event Id

### 2.1.1 Event Id

EVT-USR-001

### 2.1.2 Event Name

UserRegistered

### 2.1.3 Event Type

domain

### 2.1.4 Category

🔹 Identity & Access

### 2.1.5 Description

Fired when a new user successfully completes the registration form. Used to trigger post-registration workflows like sending a verification email.

### 2.1.6 Trigger Condition

A new record is created in the User table with status 'inactive'.

### 2.1.7 Source Context

Identity & Access Service

### 2.1.8 Target Contexts

- Notifications Service

### 2.1.9 Payload

#### 2.1.9.1 Schema

| Property | Value |
|----------|-------|
| User Id | Guid |
| Email | string |
| Full Name | string |

#### 2.1.9.2 Required Fields

- userId
- email

#### 2.1.9.3 Optional Fields

- fullName

### 2.1.10.0 Frequency

medium

### 2.1.11.0 Business Criticality

critical

### 2.1.12.0 Data Source

| Property | Value |
|----------|-------|
| Database | PostgreSQL |
| Table | User |
| Operation | create |

### 2.1.13.0 Routing

| Property | Value |
|----------|-------|
| Routing Key | user.registered |
| Exchange | user-events-topic (SNS) |
| Queue | notifications-user-registered-queue (SQS) |

### 2.1.14.0 Consumers

- {'service': 'Notifications Service', 'handler': 'sendVerificationEmailHandler', 'processingType': 'async'}

### 2.1.15.0 Dependencies

*No items available*

### 2.1.16.0 Error Handling

| Property | Value |
|----------|-------|
| Retry Strategy | SQS Default (Exponential Backoff) |
| Dead Letter Queue | notifications-user-registered-dlq |
| Timeout Ms | 30000 |

## 2.2.0.0 Event Id

### 2.2.1.0 Event Id

EVT-PRF-001

### 2.2.2.0 Event Name

UserProfileUpdated

### 2.2.3.0 Event Type

domain

### 2.2.4.0 Category

🔹 User Profile

### 2.2.5.0 Description

Published when any searchable field in a user's profile is created or updated. This event triggers re-indexing in the search service.

### 2.2.6.0 Trigger Condition

A record is created or updated in the UserProfile, WorkExperience, Education, or UserProfileSkill tables.

### 2.2.7.0 Source Context

User Profile Service

### 2.2.8.0 Target Contexts

- Search Service

### 2.2.9.0 Payload

#### 2.2.9.1 Schema

##### 2.2.9.1.1 User Id

Guid

##### 2.2.9.1.2 Profile Data

object

#### 2.2.9.2.0 Required Fields

- userId
- profileData

#### 2.2.9.3.0 Optional Fields

*No items available*

### 2.2.10.0.0 Frequency

high

### 2.2.11.0.0 Business Criticality

important

### 2.2.12.0.0 Data Source

| Property | Value |
|----------|-------|
| Database | PostgreSQL |
| Table | UserProfile |
| Operation | update |

### 2.2.13.0.0 Routing

| Property | Value |
|----------|-------|
| Routing Key | profile.updated |
| Exchange | profile-events-topic (SNS) |
| Queue | search-profile-updated-queue (SQS) |

### 2.2.14.0.0 Consumers

- {'service': 'Search Service', 'handler': 'indexUserProfileHandler', 'processingType': 'async'}

### 2.2.15.0.0 Dependencies

*No items available*

### 2.2.16.0.0 Error Handling

| Property | Value |
|----------|-------|
| Retry Strategy | SQS Default (Exponential Backoff) |
| Dead Letter Queue | search-profile-updated-dlq |
| Timeout Ms | 60000 |

## 2.3.0.0.0 Event Id

### 2.3.1.0.0 Event Id

EVT-PST-001

### 2.3.2.0.0 Event Name

PostCreated

### 2.3.3.0.0 Event Type

domain

### 2.3.4.0.0 Category

🔹 Posts & Engagement

### 2.3.5.0.0 Description

Fired when a user successfully creates a new post. This is the primary trigger for the fan-out-on-write news feed generation.

### 2.3.6.0.0 Trigger Condition

A new record is created in the Post table.

### 2.3.7.0.0 Source Context

Posts Service

### 2.3.8.0.0 Target Contexts

- Feed Service
- Notifications Service

### 2.3.9.0.0 Payload

#### 2.3.9.1.0 Schema

| Property | Value |
|----------|-------|
| Post Id | Guid |
| Author Id | Guid |
| Text Content | string |
| Created At | DateTime |

#### 2.3.9.2.0 Required Fields

- postId
- authorId
- createdAt

#### 2.3.9.3.0 Optional Fields

- textContent

### 2.3.10.0.0 Frequency

high

### 2.3.11.0.0 Business Criticality

critical

### 2.3.12.0.0 Data Source

| Property | Value |
|----------|-------|
| Database | PostgreSQL |
| Table | Post |
| Operation | create |

### 2.3.13.0.0 Routing

| Property | Value |
|----------|-------|
| Routing Key | post.created |
| Exchange | post-events-topic (SNS) |
| Queue | feed-generation-queue (SQS) |

### 2.3.14.0.0 Consumers

- {'service': 'Feed Service', 'handler': 'fanOutPostToFeedsHandler', 'processingType': 'async'}

### 2.3.15.0.0 Dependencies

*No items available*

### 2.3.16.0.0 Error Handling

| Property | Value |
|----------|-------|
| Retry Strategy | SQS Default (Exponential Backoff) |
| Dead Letter Queue | feed-generation-dlq |
| Timeout Ms | 120000 |

## 2.4.0.0.0 Event Id

### 2.4.1.0.0 Event Id

EVT-CON-001

### 2.4.2.0.0 Event Name

ConnectionRequestAccepted

### 2.4.3.0.0 Event Type

domain

### 2.4.4.0.0 Category

🔹 Connections

### 2.4.5.0.0 Description

Triggered when a user accepts a pending connection request, establishing a mutual connection.

### 2.4.6.0.0 Trigger Condition

A record in the Connection table is updated from status 'pending' to 'accepted'.

### 2.4.7.0.0 Source Context

Connections Service

### 2.4.8.0.0 Target Contexts

- Notifications Service
- Feed Service

### 2.4.9.0.0 Payload

#### 2.4.9.1.0 Schema

| Property | Value |
|----------|-------|
| Requester Id | Guid |
| Addressee Id | Guid |
| Connected At | DateTime |

#### 2.4.9.2.0 Required Fields

- requesterId
- addresseeId
- connectedAt

#### 2.4.9.3.0 Optional Fields

*No items available*

### 2.4.10.0.0 Frequency

medium

### 2.4.11.0.0 Business Criticality

important

### 2.4.12.0.0 Data Source

| Property | Value |
|----------|-------|
| Database | PostgreSQL |
| Table | Connection |
| Operation | update |

### 2.4.13.0.0 Routing

| Property | Value |
|----------|-------|
| Routing Key | connection.accepted |
| Exchange | connection-events-topic (SNS) |
| Queue | notifications-connection-accepted-queue (SQS) |

### 2.4.14.0.0 Consumers

#### 2.4.14.1.0 Service

##### 2.4.14.1.1 Service

Notifications Service

##### 2.4.14.1.2 Handler

sendConnectionAcceptedNotification

##### 2.4.14.1.3 Processing Type

async

#### 2.4.14.2.0 Service

##### 2.4.14.2.1 Service

Feed Service

##### 2.4.14.2.2 Handler

backfillFeedsOnNewConnection

##### 2.4.14.2.3 Processing Type

async

### 2.4.15.0.0 Dependencies

*No items available*

### 2.4.16.0.0 Error Handling

| Property | Value |
|----------|-------|
| Retry Strategy | SQS Default (Exponential Backoff) |
| Dead Letter Queue | notifications-connection-accepted-dlq |
| Timeout Ms | 30000 |

## 2.5.0.0.0 Event Id

### 2.5.1.0.0 Event Id

EVT-ENG-001

### 2.5.2.0.0 Event Name

InteractionEventOccurred

### 2.5.3.0.0 Event Type

domain

### 2.5.4.0.0 Category

🔹 Posts & Engagement

### 2.5.5.0.0 Description

A generic event for user interactions on a post, such as a like or a comment, used to trigger notifications.

### 2.5.6.0.0 Trigger Condition

A new record is created in PostReaction or Comment tables.

### 2.5.7.0.0 Source Context

Engagement Service

### 2.5.8.0.0 Target Contexts

- Notifications Service

### 2.5.9.0.0 Payload

#### 2.5.9.1.0 Schema

| Property | Value |
|----------|-------|
| Interaction Type | like\|comment |
| Post Id | Guid |
| Post Author Id | Guid |
| Actor Id | Guid |
| Comment Id | Guid |

#### 2.5.9.2.0 Required Fields

- interactionType
- postId
- postAuthorId
- actorId

#### 2.5.9.3.0 Optional Fields

- commentId

### 2.5.10.0.0 Frequency

high

### 2.5.11.0.0 Business Criticality

normal

### 2.5.12.0.0 Data Source

| Property | Value |
|----------|-------|
| Database | PostgreSQL |
| Table | PostReaction |
| Operation | create |

### 2.5.13.0.0 Routing

| Property | Value |
|----------|-------|
| Routing Key | interaction.occurred |
| Exchange | engagement-events-topic (SNS) |
| Queue | notifications-interaction-queue (SQS) |

### 2.5.14.0.0 Consumers

- {'service': 'Notifications Service', 'handler': 'sendInteractionNotificationHandler', 'processingType': 'async'}

### 2.5.15.0.0 Dependencies

*No items available*

### 2.5.16.0.0 Error Handling

| Property | Value |
|----------|-------|
| Retry Strategy | SQS Default (Exponential Backoff) |
| Dead Letter Queue | notifications-interaction-dlq |
| Timeout Ms | 30000 |

## 2.6.0.0.0 Event Id

### 2.6.1.0.0 Event Id

EVT-USR-002

### 2.6.2.0.0 Event Name

AccountDeletionInitiated

### 2.6.3.0.0 Event Type

system

### 2.6.4.0.0 Category

🔹 Identity & Access

### 2.6.5.0.0 Description

Fired when a user confirms they want to delete their account. This triggers the data purge process across multiple services after the grace period.

### 2.6.6.0.0 Trigger Condition

A record is updated in the AccountDeletionRequest table to status 'purged' after the grace period expires.

### 2.6.7.0.0 Source Context

Identity & Access Service

### 2.6.8.0.0 Target Contexts

- User Profile Service
- Posts Service
- Connections Service
- Search Service

### 2.6.9.0.0 Payload

#### 2.6.9.1.0 Schema

##### 2.6.9.1.1 User Id

Guid

##### 2.6.9.1.2 Purged At

DateTime

#### 2.6.9.2.0 Required Fields

- userId
- purgedAt

#### 2.6.9.3.0 Optional Fields

*No items available*

### 2.6.10.0.0 Frequency

low

### 2.6.11.0.0 Business Criticality

critical

### 2.6.12.0.0 Data Source

| Property | Value |
|----------|-------|
| Database | PostgreSQL |
| Table | AccountDeletionRequest |
| Operation | update |

### 2.6.13.0.0 Routing

| Property | Value |
|----------|-------|
| Routing Key | user.deleted |
| Exchange | user-events-topic (SNS) |
| Queue | user-profile-deletion-queue (SQS), posts-deletion-... |

### 2.6.14.0.0 Consumers

#### 2.6.14.1.0 Service

##### 2.6.14.1.1 Service

User Profile Service

##### 2.6.14.1.2 Handler

purgeUserProfileDataHandler

##### 2.6.14.1.3 Processing Type

async

#### 2.6.14.2.0 Service

##### 2.6.14.2.1 Service

Posts Service

##### 2.6.14.2.2 Handler

purgeUserPostsDataHandler

##### 2.6.14.2.3 Processing Type

async

### 2.6.15.0.0 Dependencies

*No items available*

### 2.6.16.0.0 Error Handling

| Property | Value |
|----------|-------|
| Retry Strategy | SQS Default (Exponential Backoff) |
| Dead Letter Queue | user-deletion-dlq |
| Timeout Ms | 300000 |

# 3.0.0.0.0 Event Types And Schema Design

## 3.1.0.0.0 Essential Event Types

### 3.1.1.0.0 Event Name

#### 3.1.1.1.0 Event Name

UserRegistered

#### 3.1.1.2.0 Category

🔹 domain

#### 3.1.1.3.0 Description

Initiates user onboarding workflows.

#### 3.1.1.4.0 Priority

🔴 high

### 3.1.2.0.0 Event Name

#### 3.1.2.1.0 Event Name

UserProfileUpdated

#### 3.1.2.2.0 Category

🔹 domain

#### 3.1.2.3.0 Description

Keeps search index and other read models synchronized.

#### 3.1.2.4.0 Priority

🔴 high

### 3.1.3.0.0 Event Name

#### 3.1.3.1.0 Event Name

PostCreated

#### 3.1.3.2.0 Category

🔹 domain

#### 3.1.3.3.0 Description

Core event for news feed generation.

#### 3.1.3.4.0 Priority

🔴 high

### 3.1.4.0.0 Event Name

#### 3.1.4.1.0 Event Name

ConnectionRequestAccepted

#### 3.1.4.2.0 Category

🔹 domain

#### 3.1.4.3.0 Description

Triggers notifications and potential feed updates.

#### 3.1.4.4.0 Priority

🟡 medium

### 3.1.5.0.0 Event Name

#### 3.1.5.1.0 Event Name

InteractionEventOccurred

#### 3.1.5.2.0 Category

🔹 domain

#### 3.1.5.3.0 Description

Drives real-time engagement notifications.

#### 3.1.5.4.0 Priority

🔴 high

### 3.1.6.0.0 Event Name

#### 3.1.6.1.0 Event Name

AccountDeletionInitiated

#### 3.1.6.2.0 Category

🔹 system

#### 3.1.6.3.0 Description

Ensures user data is purged across all services for compliance.

#### 3.1.6.4.0 Priority

🔴 high

## 3.2.0.0.0 Schema Design

| Property | Value |
|----------|-------|
| Format | JSON |
| Reasoning | Native support in the Node.js/TypeScript stack, hu... |
| Consistency Approach | A shared TypeScript library containing DTOs for al... |

## 3.3.0.0.0 Schema Evolution

| Property | Value |
|----------|-------|
| Backward Compatibility | ✅ |
| Forward Compatibility | ❌ |
| Strategy | Additive changes only. New optional fields can be ... |

## 3.4.0.0.0 Event Structure

### 3.4.1.0.0 Standard Fields

- eventId
- eventType
- eventVersion
- timestamp
- correlationId
- sourceService

### 3.4.2.0.0 Metadata Requirements

- correlationId for distributed tracing.
- sourceService for debugging and routing.
- eventVersion to manage schema evolution.

# 4.0.0.0.0 Event Routing And Processing

## 4.1.0.0.0 Routing Mechanisms

### 4.1.1.0.0 SNS Topics (Fan-out)

#### 4.1.1.1.0 Type

🔹 SNS Topics (Fan-out)

#### 4.1.1.2.0 Description

AWS Simple Notification Service (SNS) will be used as the primary event bus. Each bounded context (e.g., 'user-events', 'post-events') will have its own topic.

#### 4.1.1.3.0 Use Case

Distributing a single event to multiple, interested consumer services (e.g., 'PostCreated' sent to Feed Service and Notifications Service).

### 4.1.2.0.0 SQS Queues (Point-to-Point)

#### 4.1.2.1.0 Type

🔹 SQS Queues (Point-to-Point)

#### 4.1.2.2.0 Description

Each consumer service will subscribe to SNS topics via its own dedicated AWS Simple Queue Service (SQS) queue.

#### 4.1.2.3.0 Use Case

Provides a durable, persistent buffer for each consumer, allowing them to process events at their own pace and ensuring resilience against consumer downtime.

## 4.2.0.0.0 Processing Patterns

- {'pattern': 'parallel', 'applicableScenarios': ["News feed fan-out where each connection's feed can be updated independently.", 'Search indexing where multiple profile updates can be processed concurrently.'], 'implementation': 'Multiple instances of consumer services will pull messages from the SQS queue, processing them in parallel.'}

## 4.3.0.0.0 Filtering And Subscription

### 4.3.1.0.0 Filtering Mechanism

SNS Subscription Filtering

### 4.3.2.0.0 Subscription Model

Pub-Sub

### 4.3.3.0.0 Routing Keys

- user.registered
- profile.updated
- post.created
- interaction.occurred

## 4.4.0.0.0 Handler Isolation

| Property | Value |
|----------|-------|
| Required | ✅ |
| Approach | Each microservice is an isolated process. Within a... |
| Reasoning | Follows the microservice architecture principle of... |

## 4.5.0.0.0 Delivery Guarantees

| Property | Value |
|----------|-------|
| Level | at-least-once |
| Justification | This is the default for SNS to SQS delivery and is... |
| Implementation | Idempotency will be handled at the application lay... |

# 5.0.0.0.0 Event Storage And Replay

## 5.1.0.0.0 Persistence Requirements

| Property | Value |
|----------|-------|
| Required | ✅ |
| Duration | Based on SQS queue retention period (e.g., 4 days)... |
| Reasoning | Events must be persisted temporarily in queues to ... |

## 5.2.0.0.0 Event Sourcing

### 5.2.1.0.0 Necessary

❌ No

### 5.2.2.0.0 Justification

The system uses a traditional database-per-service model where the database is the source of truth. The complexity of event sourcing is not required for the defined features and would increase project scope significantly.

### 5.2.3.0.0 Scope

*No items available*

## 5.3.0.0.0 Technology Options

- {'technology': 'AWS SQS', 'suitability': 'high', 'reasoning': 'Provides durable, scalable, and fully managed message queues that integrate seamlessly with SNS and the rest of the AWS stack.'}

## 5.4.0.0.0 Replay Capabilities

### 5.4.1.0.0 Required

✅ Yes

### 5.4.2.0.0 Scenarios

- Reprocessing failed messages from a Dead Letter Queue (DLQ) after a bug fix.
- Manual replay of specific messages for debugging purposes.

### 5.4.3.0.0 Implementation

Using the AWS SQS console or SDK to move messages from the DLQ back to the main processing queue.

## 5.5.0.0.0 Retention Policy

| Property | Value |
|----------|-------|
| Strategy | Queue-based |
| Duration | 4 days (configurable) |
| Archiving Approach | Messages not successfully processed within the ret... |

# 6.0.0.0.0 Dead Letter Queue And Error Handling

## 6.1.0.0.0 Dead Letter Strategy

| Property | Value |
|----------|-------|
| Approach | A dedicated Dead Letter Queue (DLQ) will be config... |
| Queue Configuration | Standard SQS queue with a longer message retention... |
| Processing Logic | Messages in the DLQ will trigger a CloudWatch Alar... |

## 6.2.0.0.0 Retry Policies

- {'errorType': 'Transient processing errors (e.g., network issues, temporary database unavailability)', 'maxRetries': 3, 'backoffStrategy': 'exponential', 'delayConfiguration': 'SQS default visibility timeout-based retry mechanism.'}

## 6.3.0.0.0 Poison Message Handling

| Property | Value |
|----------|-------|
| Detection Mechanism | A message that fails processing after the maximum ... |
| Handling Strategy | The message is automatically moved to the correspo... |
| Alerting Required | ✅ |

## 6.4.0.0.0 Error Notification

### 6.4.1.0.0 Channels

- PagerDuty
- Email

### 6.4.2.0.0 Severity

critical

### 6.4.3.0.0 Recipients

- On-Call Engineering Team

## 6.5.0.0.0 Recovery Procedures

- {'scenario': 'A bug in a consumer service causes all messages to fail and move to the DLQ.', 'procedure': '1. Pause consumption from the main queue. 2. Deploy a fix for the bug. 3. Use the SQS Redrive feature to move messages from the DLQ back to the main queue for reprocessing. 4. Resume consumption.', 'automationLevel': 'semi-automated'}

# 7.0.0.0.0 Event Versioning Strategy

## 7.1.0.0.0 Schema Evolution Approach

| Property | Value |
|----------|-------|
| Strategy | Additive changes with semantic versioning. |
| Versioning Scheme | v1, v2, etc. |
| Migration Strategy | Consumers must be ableto handle older versions of ... |

## 7.2.0.0.0 Compatibility Requirements

| Property | Value |
|----------|-------|
| Backward Compatible | ✅ |
| Forward Compatible | ❌ |
| Reasoning | Ensures that deploying a new producer does not bre... |

## 7.3.0.0.0 Version Identification

| Property | Value |
|----------|-------|
| Mechanism | Event Metadata |
| Location | header |
| Format | eventVersion: '1.0' |

## 7.4.0.0.0 Consumer Upgrade Strategy

| Property | Value |
|----------|-------|
| Approach | Tolerant Reader pattern. Consumers should ignore a... |
| Rollout Strategy | Deploy new consumer code before producers start em... |
| Rollback Procedure | Roll back consumer code to the previous version th... |

## 7.5.0.0.0 Schema Registry

| Property | Value |
|----------|-------|
| Required | ❌ |
| Technology | N/A |
| Governance | A shared TypeScript library and rigorous code revi... |

# 8.0.0.0.0 Event Monitoring And Observability

## 8.1.0.0.0 Monitoring Capabilities

### 8.1.1.0.0 Capability

#### 8.1.1.1.0 Capability

Queue Health Monitoring

#### 8.1.1.2.0 Justification

To ensure events are flowing and not getting stuck.

#### 8.1.1.3.0 Implementation

AWS CloudWatch metrics on SQS queues (e.g., ApproximateNumberOfMessagesVisible, ApproximateAgeOfOldestMessage).

### 8.1.2.0.0 Capability

#### 8.1.2.1.0 Capability

Handler Performance

#### 8.1.2.2.0 Justification

To detect slow or failing event processors.

#### 8.1.2.3.0 Implementation

OpenTelemetry instrumentation within each event handler to measure execution time and error rates, exported to Prometheus.

## 8.2.0.0.0 Tracing And Correlation

| Property | Value |
|----------|-------|
| Tracing Required | ✅ |
| Correlation Strategy | A unique correlationId will be generated at the st... |
| Trace Id Propagation | W3C Trace Context propagated via event headers/met... |

## 8.3.0.0.0 Performance Metrics

### 8.3.1.0.0 Metric

#### 8.3.1.1.0 Metric

End-to-End Event Latency (Producer to Consumer)

#### 8.3.1.2.0 Threshold

P95 < 5 seconds

#### 8.3.1.3.0 Alerting

✅ Yes

### 8.3.2.0.0 Metric

#### 8.3.2.1.0 Metric

DLQ Message Count

#### 8.3.2.2.0 Threshold

> 0

#### 8.3.2.3.0 Alerting

✅ Yes

## 8.4.0.0.0 Event Flow Visualization

| Property | Value |
|----------|-------|
| Required | ✅ |
| Tooling | Jaeger |
| Scope | Provides distributed traces showing the flow of a ... |

## 8.5.0.0.0 Alerting Requirements

### 8.5.1.0.0 Condition

#### 8.5.1.1.0 Condition

Number of messages in DLQ > 0 for more than 15 minutes

#### 8.5.1.2.0 Severity

critical

#### 8.5.1.3.0 Response Time

15 minutes

#### 8.5.1.4.0 Escalation Path

- On-Call Engineer via PagerDuty

### 8.5.2.0.0 Condition

#### 8.5.2.1.0 Condition

P95 event processing latency > 10 seconds

#### 8.5.2.2.0 Severity

warning

#### 8.5.2.3.0 Response Time

1 hour

#### 8.5.2.4.0 Escalation Path

- Engineering Team Slack Channel

# 9.0.0.0.0 Implementation Priority

## 9.1.0.0.0 Component

### 9.1.1.0.0 Component

UserRegistered Event Pipeline

### 9.1.2.0.0 Priority

🔴 high

### 9.1.3.0.0 Dependencies

*No items available*

### 9.1.4.0.0 Estimated Effort

Small

## 9.2.0.0.0 Component

### 9.2.1.0.0 Component

PostCreated & Feed Fan-Out Pipeline

### 9.2.2.0.0 Priority

🔴 high

### 9.2.3.0.0 Dependencies

*No items available*

### 9.2.4.0.0 Estimated Effort

Medium

## 9.3.0.0.0 Component

### 9.3.1.0.0 Component

UserProfileUpdated & Search Indexing Pipeline

### 9.3.2.0.0 Priority

🔴 high

### 9.3.3.0.0 Dependencies

*No items available*

### 9.3.4.0.0 Estimated Effort

Medium

## 9.4.0.0.0 Component

### 9.4.1.0.0 Component

DLQ Configuration and Alerting

### 9.4.2.0.0 Priority

🔴 high

### 9.4.3.0.0 Dependencies

*No items available*

### 9.4.4.0.0 Estimated Effort

Small

## 9.5.0.0.0 Component

### 9.5.1.0.0 Component

Correlation ID Propagation

### 9.5.2.0.0 Priority

🟡 medium

### 9.5.3.0.0 Dependencies

*No items available*

### 9.5.4.0.0 Estimated Effort

Medium

# 10.0.0.0.0 Risk Assessment

## 10.1.0.0.0 Risk

### 10.1.1.0.0 Risk

Idempotency not correctly implemented in consumers

### 10.1.2.0.0 Impact

high

### 10.1.3.0.0 Probability

medium

### 10.1.4.0.0 Mitigation

Implement strict data consistency checks before writes. Use unique constraints in the database. Conduct thorough testing of duplicate message scenarios.

## 10.2.0.0.0 Risk

### 10.2.1.0.0 Risk

Circular dependencies between services via events

### 10.2.2.0.0 Impact

high

### 10.2.3.0.0 Probability

low

### 10.2.4.0.0 Mitigation

Enforce unidirectional data flow in event-driven workflows during architectural reviews. Avoid having a service subscribe to its own events indirectly.

## 10.3.0.0.0 Risk

### 10.3.1.0.0 Risk

Incorrect DLQ configuration

### 10.3.2.0.0 Impact

medium

### 10.3.3.0.0 Probability

low

### 10.3.4.0.0 Mitigation

Use Infrastructure as Code (Terraform) to define all queues and their DLQ configurations consistently. Automate testing of the DLQ mechanism.

# 11.0.0.0.0 Recommendations

## 11.1.0.0.0 Category

### 11.1.1.0.0 Category

🔹 Technology

### 11.1.2.0.0 Recommendation

Adopt AWS SNS FIFO topics and SQS FIFO queues if strict ordering of events within a specific context (e.g., updates to a single user profile) becomes a requirement.

### 11.1.3.0.0 Justification

Standard topics/queues do not guarantee order. FIFO provides ordering at the cost of lower throughput, which may be a necessary trade-off for certain features.

### 11.1.4.0.0 Priority

🟡 medium

## 11.2.0.0.0 Category

### 11.2.1.0.0 Category

🔹 Process

### 11.2.2.0.0 Recommendation

Establish a formal event governance process and consider a schema registry as the number of event types and services grows.

### 11.2.3.0.0 Justification

A shared library for schemas does not scale well beyond a small number of teams. A schema registry enforces compatibility and acts as a central source of truth.

### 11.2.4.0.0 Priority

🟡 medium

