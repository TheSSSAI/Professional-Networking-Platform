# 1 Diagram Info

## 1.1 Diagram Name

Permanent User Account Deletion Process

## 1.2 Diagram Type

sequenceDiagram

## 1.3 Purpose

To visually document the multi-step, asynchronous business process for permanently deleting a user account. It details the 14-day grace period, scheduled jobs, and the event-driven fan-out to multiple microservices using a SAGA pattern, as required by SRS-001-F1.

## 1.4 Target Audience

- developers
- architects
- QA engineers
- product managers

## 1.5 Complexity Level

high

## 1.6 Estimated Review Time

5 minutes

# 2.0 Mermaid Implementation

| Property | Value |
|----------|-------|
| Mermaid Code | sequenceDiagram
    actor Client
    participant A... |
| Syntax Validation | Mermaid syntax verified and tested for rendering |
| Rendering Notes | Optimized for clarity with boxed phases and parall... |

# 3.0 Diagram Elements

## 3.1 Actors Systems

- Client Application
- API Gateway
- Identity Service
- Event Bus
- Profile Service
- Posts Service
- Connections Service
- Search Service

## 3.2 Key Processes

- Deletion Scheduling
- Grace Period Management
- Scheduled Job Execution
- Event-Driven Fan-Out (SAGA)
- Data Purging
- Finalization

## 3.3 Decision Points

- Scheduled job trigger: 24 hours before expiration
- Scheduled job trigger: grace period expired

## 3.4 Success Paths

- User requests deletion, grace period expires, and all data is purged and anonymized across all services.

## 3.5 Error Scenarios

- Event consumer failure (mitigated by idempotency and dead-letter queues).
- Scheduled job failure (requires monitoring and alerts).

## 3.6 Edge Cases Covered

- User cancels deletion during grace period (implicitly handled by removing the scheduled job).
- Handling of potential duplicate event delivery via idempotent consumers.

# 4.0 Accessibility Considerations

| Property | Value |
|----------|-------|
| Alt Text | A sequence diagram illustrating the permanent user... |
| Color Independence | Information is conveyed through sequence and text ... |
| Screen Reader Friendly | All participants and interactions have clear, desc... |
| Print Compatibility | Diagram uses standard shapes and lines, rendering ... |

# 5.0 Technical Specifications

| Property | Value |
|----------|-------|
| Mermaid Version | 10.0+ compatible |
| Responsive Behavior | Scales appropriately for both wide and narrow view... |
| Theme Compatibility | Works with default, dark, and neutral themes. |
| Performance Notes | Diagram complexity is managed for fast rendering i... |

# 6.0 Usage Guidelines

## 6.1 When To Reference

During design, implementation, and testing of the user account deletion feature. Useful for onboarding new engineers to this critical workflow.

## 6.2 Stakeholder Value

| Property | Value |
|----------|-------|
| Developers | Provides a clear sequence of operations and inter-... |
| Designers | Illustrates the user-facing and backend timings fo... |
| Product Managers | Visualizes the entire user off-boarding journey, i... |
| Qa Engineers | Defines the full scope of services and data stores... |

## 6.3 Maintenance Notes

Update this diagram if new microservices are added that store user data, or if the grace period or SAGA logic changes.

## 6.4 Integration Recommendations

Embed in the technical design document for the Account Deletion feature and link from relevant user stories (US-015, US-017).

# 7.0 Validation Checklist

- ✅ User request and grace period initiation are documented
- ✅ Asynchronous, scheduled jobs are clearly indicated
- ✅ Event-driven fan-out to multiple services is shown
- ✅ Parallel data purging actions are illustrated
- ✅ Finalization step (core record deletion) is included
- ✅ Critical notes like idempotency are present
- ✅ Mermaid syntax is validated and renders correctly
- ✅ Serves the needs of developers, QA, and architects

