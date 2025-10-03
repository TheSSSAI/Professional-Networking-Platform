# 1 Diagram Info

## 1.1 Diagram Name

Permanent User Account Deletion Flow

## 1.2 Diagram Type

sequenceDiagram

## 1.3 Purpose

To illustrate the multi-step, asynchronous process for permanent user account deletion, including the 14-day grace period, a 24-hour warning notification, and the event-driven SAGA pattern used to purge user data across all distributed microservices.

## 1.4 Target Audience

- developers
- architects
- QA engineers
- product managers

## 1.5 Complexity Level

high

## 1.6 Estimated Review Time

5-7 minutes

# 2.0 Mermaid Implementation

| Property | Value |
|----------|-------|
| Mermaid Code | sequenceDiagram
    actor "Client" as Client
    p... |
| Syntax Validation | Mermaid syntax verified and tested for rendering. |
| Rendering Notes | The use of 'par' indicates parallel processing. Th... |

# 3.0 Diagram Elements

## 3.1 Actors Systems

- Client
- API Gateway
- Identity Service
- Event Bus
- Profile Service
- Posts Service
- Connections Service
- Search Service

## 3.2 Key Processes

- Deletion Request Initiation
- Scheduled Pre-Purge Warning
- Scheduled Final Purge Trigger
- SAGA-based Data Purge
- Data Anonymization
- Final Audit Logging

## 3.3 Decision Points

- Scheduled job checking for requests expiring in 24 hours
- Scheduled job checking for requests with expired grace periods

## 3.4 Success Paths

- The full end-to-end flow from user request to complete data erasure across all services.

## 3.5 Error Scenarios

- Idempotency of event consumers is critical to handle duplicate message delivery.
- A failure in any service's purge step requires a compensating action or alerting for manual intervention.
- Failure to write the final audit log should trigger a critical alert.

## 3.6 Edge Cases Covered

- The 14-day grace period.
- The 24-hour warning notification.
- The distinction between purging data (posts) and anonymizing data (comments).

# 4.0 Accessibility Considerations

| Property | Value |
|----------|-------|
| Alt Text | A sequence diagram illustrating the permanent user... |
| Color Independence | Diagram logic is conveyed through arrows and text,... |
| Screen Reader Friendly | All participants and interactions have descriptive... |
| Print Compatibility | Diagram uses standard shapes and lines that are cl... |

# 5.0 Technical Specifications

| Property | Value |
|----------|-------|
| Mermaid Version | 10.0+ compatible |
| Responsive Behavior | Diagram scales horizontally. On smaller screens, h... |
| Theme Compatibility | Compatible with default, dark, and neutral themes. |
| Performance Notes | The diagram is of high complexity with many partic... |

# 6.0 Usage Guidelines

## 6.1 When To Reference

During development of the account deletion feature, architectural reviews of inter-service communication, and for creating QA test plans for this critical, compliance-related flow.

## 6.2 Stakeholder Value

| Property | Value |
|----------|-------|
| Developers | Provides a clear blueprint for the SAGA orchestrat... |
| Designers | Informs the user experience around the deletion pr... |
| Product Managers | Visualizes the entire user offboarding lifecycle, ... |
| Qa Engineers | Defines the end-to-end flow and all integration po... |

## 6.3 Maintenance Notes

This diagram must be updated if any new microservice that stores user data is added to the system, as it will need to be included in the SAGA pattern.

## 6.4 Integration Recommendations

Embed this diagram in the main architecture documentation for account lifecycle management and link to it from the relevant user stories and service READMEs.

# 7.0 Validation Checklist

- ✅ All critical user paths documented
- ✅ Error scenarios and recovery paths included
- ✅ Decision points clearly marked with conditions
- ✅ Mermaid syntax validated and renders correctly
- ✅ Diagram serves intended audience needs
- ✅ Visual hierarchy supports easy comprehension
- ✅ Styling enhances rather than distracts from content
- ✅ Accessible to users with different visual abilities

