# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-088 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Issues a Formal Warning to a User |
| As A User Story | As an Administrator, I want to issue a formal, doc... |
| User Persona | Administrator / Content Moderator with privileges ... |
| Business Value | Enforces platform's Acceptable Use Policy, educate... |
| Functional Area | Administrative Functions - Content Moderation |
| Story Theme | Platform Governance and Safety |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Admin issues a warning from the content moderation queue

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

an administrator is logged into the Admin Dashboard and is viewing a reported item in the content moderation queue

### 3.1.5 When

the administrator selects the 'Issue Warning' action for the user who created the content

### 3.1.6 Then

the user receives both an in-app notification and an email detailing the warning.

### 3.1.7 And

the administrator sees a success confirmation message in the UI.

### 3.1.8 Validation Notes

Verify the warning record in the database, the entry in the audit log, and the content of the received email/notification.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Alternative Flow: Admin issues a warning from the user management page

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

an administrator is viewing a specific user's profile within the Admin Dashboard's user management section

### 3.2.5 When

the administrator selects the 'Issue Warning' action

### 3.2.6 Then

the user receives the warning, and the action is logged in the audit trail without a content ID.

### 3.2.7 And

the administrator selects a reason, adds a mandatory custom message explaining the context (since there is no specific content item), and sends the warning.

### 3.2.8 Validation Notes

Check that the audit log entry correctly reflects a warning not tied to a specific piece of content.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Error Condition: Attempting to warn a non-existent or deactivated user

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

an administrator is attempting to issue a warning

### 3.3.5 When

the target user's account has been deleted or deactivated before the warning is sent

### 3.3.6 Then

the system displays an error message, such as 'Action failed: User account not found or is inactive.'

### 3.3.7 And

no warning is sent and no audit log entry is created for the failed attempt.

### 3.3.8 Validation Notes

Attempt to issue a warning to a user ID that has been soft-deleted or hard-deleted and verify the API response and UI feedback.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Validation: Attempting to send a warning without a reason

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

an administrator has opened the 'Issue Warning' modal

### 3.4.5 When

they attempt to send the warning without selecting a predefined reason

### 3.4.6 Then

the form displays a validation error message, and the warning is not sent.

### 3.4.7 Validation Notes

Click the 'Send Warning' button with the reason field left blank and assert that a validation message appears.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Audit Log and User Record Verification

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

an administrator has successfully issued a warning to a user

### 3.5.5 When

any administrator views the Admin Audit Log

### 3.5.6 Then

a detailed entry for the warning action is present and immutable.

### 3.5.7 And

when any administrator views the warned user's profile in the user management section, a history of all warnings issued to that user is clearly displayed.

### 3.5.8 Validation Notes

Query the audit log and user management API/UI to confirm the warning data is present, accurate, and correctly associated.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- 'Issue Warning' button/menu item in the content moderation queue and user management page.
- A modal dialog for composing and sending the warning.
- A dropdown menu for selecting predefined violation reasons.
- An optional <textarea> for a custom message with a character counter.
- A 'Send Warning' confirmation button and a 'Cancel' button.
- A section in the user management view to display a user's warning history.

## 4.2.0 User Interactions

- Clicking 'Issue Warning' opens the modal.
- Selecting a reason from the dropdown populates a template message.
- Typing in the textarea updates the character count.
- Clicking 'Send Warning' triggers the API call and closes the modal on success, showing a toast notification.

## 4.3.0 Display Requirements

- The warning modal must display the target user's name/ID.
- The user's warning history must show the date, reason, issuing admin, and any custom message for each warning.

## 4.4.0 Accessibility Needs

- The modal must be fully keyboard-navigable (WCAG 2.1).
- All form fields must have associated <label> tags.
- Focus must be managed correctly when the modal opens and closes.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-001

### 5.1.2 Rule Description

All warning actions performed by an administrator must be logged in the immutable admin audit trail.

### 5.1.3 Enforcement Point

Backend service layer upon successful execution of the warning action.

### 5.1.4 Violation Handling

If logging fails, the entire operation should fail and return an error to the administrator.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-002

### 5.2.2 Rule Description

A predefined reason for the violation must be selected for every warning.

### 5.2.3 Enforcement Point

API validation layer and frontend form validation.

### 5.2.4 Violation Handling

The request is rejected with a validation error.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-083

#### 6.1.1.2 Dependency Reason

The Admin Dashboard is the container for this entire feature.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-084

#### 6.1.2.2 Dependency Reason

The content moderation queue is a primary entry point for issuing warnings.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-091

#### 6.1.3.2 Dependency Reason

The user management page is an alternative entry point for issuing warnings.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

US-093

#### 6.1.4.2 Dependency Reason

The audit log system is required to record this action as per acceptance criteria.

## 6.2.0.0 Technical Dependencies

- A functioning Notification Service to handle in-app and email delivery.
- An established Admin Audit Log service/module.

## 6.3.0.0 Data Dependencies

- A predefined list of violation reasons must be available in the system configuration or a database table.

## 6.4.0.0 External Dependencies

- Integration with AWS SES (or equivalent) for sending email notifications (SRS-001-F1.1.1, 2.6.9).

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response for the 'Issue Warning' action must be < 500ms (P95).
- Email and notification delivery can be asynchronous but should be delivered to the user within 1 minute.

## 7.2.0.0 Security

- Access to this feature must be strictly limited to users with the 'Administrator' role.
- All input from the custom message field must be sanitized to prevent XSS and other injection attacks.
- The Admin Audit Log entry for this action must be immutable.

## 7.3.0.0 Usability

- The process of issuing a warning should be quick and intuitive, requiring minimal clicks from the moderation queue.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The Admin Dashboard interface must function correctly on all supported modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires frontend work for the modal UI and state management.
- Requires a new backend GraphQL mutation and service logic.
- Involves multiple system interactions: database writes (warning record), audit log service, and notification service.
- Requires a new database table or schema modification to store user warning history.

## 8.3.0.0 Technical Risks

- Ensuring the atomicity of the operation (e.g., if notification fails, should the whole action be rolled back?). A decision should be made to prioritize logging the action even if notification fails, with a retry mechanism for notifications.

## 8.4.0.0 Integration Points

- Admin Dashboard Frontend (Next.js)
- Backend API Gateway (GraphQL)
- User Service / Moderation Service (NestJS)
- Primary Database (PostgreSQL)
- Notification Service (WebSockets/Email)
- Audit Log Service

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify a warning can be sent successfully from the moderation queue.
- Verify a warning can be sent successfully from the user management page.
- Verify the content and delivery of the email and in-app notifications.
- Verify the accuracy of the data stored in the Admin Audit Log.
- Test form validation for missing reason and message length.
- Test role-based access control to ensure non-admins cannot access the feature.

## 9.3.0.0 Test Data Needs

- Test accounts with 'Administrator' role.
- Test accounts for regular users to receive warnings.
- Reported content items in the moderation queue.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Cypress or Playwright for E2E tests.
- GraphQL client for API-level integration tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are implemented with >80% code coverage for new logic.
- Automated E2E tests for the happy path scenario are passing.
- Security checks (input sanitization, authorization) have been implemented and verified.
- The feature is documented in the Administrator's guide (SRS-2.11.3).
- Product Owner has reviewed and approved the implementation.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is critical for the MVP of the moderation toolset.
- Confirm availability of the Notification and Audit Log services before starting development.
- The list of predefined violation reasons needs to be finalized by the Product Owner before UI development begins.

## 11.4.0.0 Release Impact

Enables core platform safety and moderation capabilities required for public launch.

