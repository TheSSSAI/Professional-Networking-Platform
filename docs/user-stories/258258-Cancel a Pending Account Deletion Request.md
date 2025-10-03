# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-016 |
| Elaboration Date | 2025-01-18 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Cancel a Pending Account Deletion Request |
| As A User Story | As a user who has requested to delete my account, ... |
| User Persona | A registered user whose account is in a 'pending d... |
| Business Value | Increases user retention by providing a simple, se... |
| Functional Area | User Account Management |
| Story Theme | Account Lifecycle and Security |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful cancellation of a pending account deletion

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a registered user who has previously requested account deletion and I am within the 14-day grace period

### 3.1.5 When

I log in to my account and click the 'Cancel Deletion Request' button

### 3.1.6 Then

The system must change my account status from 'pending_deletion' to 'active' in the database, the scheduled data purge job for my account must be cancelled, I must see an on-screen confirmation message like 'Your account deletion has been cancelled. Welcome back!', and the option to cancel the deletion must no longer be visible.

### 3.1.7 Validation Notes

Verify via UI that the confirmation appears and the cancellation banner is removed. Verify in the database that the user's status is 'active'. Verify in the job queue/scheduler that the deletion task for this user ID has been removed.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

UI displays a clear option to cancel deletion

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am a user with an account in the 'pending_deletion' state and I am within the grace period

### 3.2.5 When

I log in and navigate to the main dashboard or my account settings page

### 3.2.6 Then

I must see a prominent and persistent banner or notification that clearly states my account is scheduled for deletion on a specific date and provides a button to cancel the request.

### 3.2.7 Validation Notes

UI test to confirm the banner's visibility, content (including the calculated deletion date), and the presence of the cancellation button.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Attempt to access the platform after the grace period has expired

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

I am a user who requested account deletion and the 14-day grace period has passed

### 3.3.5 When

I attempt to log in with my credentials

### 3.3.6 Then

The system must prevent me from logging in and display a message indicating that the account has been permanently deleted.

### 3.3.7 Validation Notes

Set a user's deletion request timestamp to be more than 14 days in the past. Attempt to log in and verify the correct error message is shown and no session token is issued.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Backend error during cancellation process

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

I am a user with a pending deletion request and I am logged in

### 3.4.5 When

I click the 'Cancel Deletion Request' button and the backend service fails to process the request (e.g., database connection error)

### 3.4.6 Then

I must be shown a user-friendly error message (e.g., 'Failed to cancel deletion. Please try again.'), my account status must remain 'pending_deletion', and the cancellation banner must remain visible.

### 3.4.7 Validation Notes

Use fault injection or mock a service failure in an integration test to simulate the error. Verify the UI displays the error message and the user's state in the database is unchanged.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Cancellation action is logged for security auditing

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

I am a user with a pending deletion request

### 3.5.5 When

I successfully cancel the deletion request

### 3.5.6 Then

The system must record this action in my user activity audit trail, including the action type ('ACCOUNT_DELETION_CANCELLED'), my user ID, and a timestamp.

### 3.5.7 Validation Notes

After performing the cancellation, query the audit log table/system to ensure the event was recorded correctly.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A persistent, non-dismissible banner for users in the 'pending_deletion' state.
- A primary call-to-action button within the banner, labeled 'Cancel Deletion Request' or 'Keep My Account'.
- A success toast/notification to confirm successful cancellation.

## 4.2.0 User Interactions

- User logs in and is immediately presented with the banner.
- A single click on the cancellation button initiates and completes the action.
- The banner is removed from the UI immediately upon successful cancellation without requiring a page reload.

## 4.3.0 Display Requirements

- The banner must display the exact date when the permanent deletion will occur (e.g., 'Your account will be permanently deleted on January 31, 2025.').

## 4.4.0 Accessibility Needs

- The banner must have an appropriate ARIA role (e.g., 'alert' or 'status') to be announced by screen readers.
- The cancellation button must be keyboard-focusable and operable.
- All text and interactive elements must meet WCAG 2.1 AA color contrast ratios.

# 5.0.0 Business Rules

- {'rule_id': 'BR-016-01', 'rule_description': 'Account deletion can only be cancelled within the 14-day grace period following the initial deletion request.', 'enforcement_point': 'Backend API endpoint for cancelling deletion.', 'violation_handling': 'If the request is received after the grace period, the API must return an error (e.g., 410 Gone or 403 Forbidden) and the action must be rejected.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

- {'story_id': 'US-015', 'dependency_reason': "This story requires the existence of an account 'pending_deletion' state and a scheduled deletion mechanism, which are created by US-015 'Request Permanent Account Deletion'."}

## 6.2.0 Technical Dependencies

- Authentication Service: To manage user sessions and states.
- User Account Service: To update the user's status in the primary database.
- Job Scheduling/Queue System (e.g., BullMQ, RabbitMQ): Must expose an API to find and remove a scheduled job by a unique identifier (e.g., user ID).

## 6.3.0 Data Dependencies

- The user record in the database must have a status field (e.g., 'active', 'pending_deletion') and a timestamp for when the deletion was requested.

## 6.4.0 External Dependencies

*No items available*

# 7.0.0 Non Functional Requirements

## 7.1.0 Performance

- The API endpoint for cancelling the deletion must have a P95 latency of less than 200ms.

## 7.2.0 Security

- The cancellation action must be protected and only accessible by the authenticated user who owns the account.
- The action must be logged in the user's security audit trail as per SRS-001-NFR 2.3.6.

## 7.3.0 Usability

- The option to cancel must be highly visible and unambiguous to prevent users from overlooking it.

## 7.4.0 Accessibility

- All related UI components must comply with WCAG 2.1 Level AA standards.

## 7.5.0 Compatibility

- The feature must function correctly on all supported browsers (latest versions of Chrome, Firefox, Safari, Edge).

# 8.0.0 Implementation Considerations

## 8.1.0 Complexity Assessment

Medium

## 8.2.0 Complexity Factors

- Requires a reliable interface with the background job scheduler to cancel the specific data purge task.
- Frontend state management needs to correctly identify the user's status upon login to render the conditional UI (the banner).
- The process of updating the user's status and cancelling the job should be transactional or idempotent to avoid inconsistent states.

## 8.3.0 Technical Risks

- Risk of failure in cancelling the background job, which could lead to unintended data deletion. The cancellation logic must be robust and include error handling and logging.
- Potential for a race condition if the user tries to cancel at the exact moment the grace period expires and the purge job begins.

## 8.4.0 Integration Points

- User Service (Database)
- Authentication Service (Session/Token Management)
- Background Job Scheduler (API for job cancellation)

# 9.0.0 Testing Requirements

## 9.1.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0 Test Scenarios

- A user successfully cancels their deletion request with 10 days remaining.
- A user successfully cancels their deletion request with 1 minute remaining.
- A user attempts to log in 1 minute after their grace period expires.
- The backend API for cancellation returns an error, and the UI handles it gracefully.
- The cancellation banner is correctly displayed on login for a pending-deletion user and is not displayed for an active user.

## 9.3.0 Test Data Needs

- Test accounts in the 'pending_deletion' state.
- Ability to manipulate the 'deletion_requested_at' timestamp for test accounts to simulate different points within and outside the grace period.

## 9.4.0 Testing Tools

- Jest/Vitest for unit tests.
- Supertest for API integration tests.
- Cypress/Playwright for E2E tests.

# 10.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other engineer
- Unit and integration tests implemented with >80% code coverage for new logic
- E2E tests for the happy path and key error conditions are passing
- User interface reviewed and approved by UX/Product
- Performance of the cancellation API endpoint is verified under load
- Security audit trail logging is confirmed
- Accessibility (WCAG 2.1 AA) of new UI components is validated
- Story deployed and verified in the staging environment

# 11.0.0 Planning Information

## 11.1.0 Story Points

3

## 11.2.0 Priority

🔴 High

## 11.3.0 Sprint Considerations

- This story is blocked by US-015 and cannot be started until US-015 is complete and merged.
- Requires coordination between frontend and backend developers to agree on the API contract and how user status is communicated to the client.

## 11.4.0 Release Impact

This is a critical feature for user retention and experience, and should be included in the same release as the account deletion feature (US-015).

