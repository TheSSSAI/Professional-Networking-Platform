# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-089 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin: Temporarily Suspend a User Account with Dur... |
| As A User Story | As an Administrator, I want to temporarily suspend... |
| User Persona | Platform Administrator / Content Moderator with pr... |
| Business Value | Enables a tiered moderation strategy, protects com... |
| Functional Area | Administration & Moderation |
| Story Theme | User Account Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Admin successfully applies a temporary suspension

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

an Administrator is logged into the Admin Dashboard and is viewing a user's management page

### 3.1.5 When

the Administrator selects the 'Temporarily Ban User' action, chooses a duration of '7 days', enters 'Violation of AUP section 3.1' as the reason, and confirms the action

### 3.1.6 Then

the user's account status is immediately updated to 'Suspended' in the database, the suspension expiry date (7 days from now) is recorded, and the user's status is displayed as 'Suspended until [YYYY-MM-DD]' in the Admin Dashboard. An entry is created in the Admin Audit Log with all relevant details (admin ID, user ID, action, duration, reason, timestamp). All of the user's active sessions are immediately invalidated. A scheduled job is created to lift the suspension automatically on the expiry date. An email is sent to the user notifying them of the suspension, its duration, and the reason.

### 3.1.7 Validation Notes

Verify the user's status in the database and Admin UI. Check the Admin Audit Log for the new entry. Confirm the user is logged out and cannot use old tokens. Verify the scheduled job exists. Check email service logs for the notification email.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Suspended user attempts to log in

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

a user's account has been temporarily suspended

### 3.2.5 When

the user attempts to log in with their correct credentials

### 3.2.6 Then

the login attempt is rejected and the user is shown a specific error message: 'Your account is temporarily suspended until [YYYY-MM-DD HH:mm UTC]. Reason: [Reason for suspension].'

### 3.2.7 Validation Notes

This must not be a generic 'Invalid credentials' error. The message must be specific to the suspension.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Suspended user attempts to reset password

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

a user's account has been temporarily suspended

### 3.3.5 When

the user attempts to use the 'Forgot Password' feature

### 3.3.6 Then

the system prevents the password reset process from starting and displays a message indicating the account is suspended.

### 3.3.7 Validation Notes

Verify that no password reset email is sent and the appropriate message is displayed to the user.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

System automatically lifts the suspension upon expiry

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

a user's suspension period is about to expire

### 3.4.5 When

the system clock reaches the `suspension_expires_at` timestamp

### 3.4.6 Then

a scheduled job automatically updates the user's status from 'Suspended' to 'Active' and nullifies the `suspension_expires_at` timestamp. The user is now able to log in successfully.

### 3.4.7 Validation Notes

Requires a time-based test. Set a short suspension (e.g., 1 minute) in a test environment. Verify the status change in the database and that the user can log in after the time has passed.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Admin attempts to suspend an already suspended user

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

an Administrator is viewing the profile of a user who is already suspended

### 3.5.5 When

the Administrator attempts to apply another temporary suspension

### 3.5.6 Then

the UI presents a clear message indicating the user is already suspended and provides options to either 'Update Suspension' (change duration/reason) or 'Cancel'.

### 3.5.7 Validation Notes

The system should not allow stacking multiple suspensions. It should only allow modification of the existing one.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Admin attempts to suspend another administrator

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

an Administrator is viewing the profile of another user who also has administrator privileges

### 3.6.5 When

the Administrator attempts to apply a temporary suspension

### 3.6.6 Then

the action is blocked and an error message is displayed: 'Administrators cannot suspend other administrator accounts.'

### 3.6.7 Validation Notes

Verify that the API endpoint checks the target user's role before processing the request.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Temporarily Ban' button on the user management page in the Admin Dashboard.
- A confirmation modal triggered by the button.
- A dropdown or set of radio buttons for preset durations (e.g., '24 hours', '7 days', '30 days').
- A 'Custom' option that reveals a date/time picker for setting a specific expiry.
- A mandatory text area for the 'Reason for Suspension'.
- A 'Confirm Suspension' button within the modal.
- A 'Cancel' button to close the modal.
- A visual indicator (e.g., a badge) on the user management page showing 'Suspended' status and the expiry date.

## 4.2.0 User Interactions

- Admin clicks 'Temporarily Ban' to open the modal.
- Admin selects a duration and types a reason.
- Admin clicks 'Confirm Suspension' to execute the action and close the modal.
- A success notification/toast is displayed upon successful suspension.

## 4.3.0 Display Requirements

- The suspension modal must clearly display the target user's name/ID.
- The login page must display a specific, informative error message for suspended users.
- The Admin Dashboard must clearly differentiate suspended users from active users.

## 4.4.0 Accessibility Needs

- The suspension modal must be fully keyboard accessible (WCAG 2.1 AA).
- All form fields must have associated labels.
- Focus must be managed correctly when the modal opens and closes.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-MOD-01

### 5.1.2 Rule Description

A user's account status must be checked before any authentication attempt is processed. Suspended users cannot be authenticated.

### 5.1.3 Enforcement Point

Authentication Service (Login endpoint)

### 5.1.4 Violation Handling

Reject authentication attempt with a specific 'Account Suspended' error message.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-MOD-02

### 5.2.2 Rule Description

All temporary suspension actions must be logged in the immutable Admin Audit Log.

### 5.2.3 Enforcement Point

Admin API (Suspend User endpoint)

### 5.2.4 Violation Handling

The suspension action must fail if the audit log entry cannot be created.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-MOD-03

### 5.3.2 Rule Description

Administrators cannot suspend other administrator accounts.

### 5.3.3 Enforcement Point

Admin API (Suspend User endpoint)

### 5.3.4 Violation Handling

The API request is rejected with a 'Permission Denied' status and a descriptive error message.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-083

#### 6.1.1.2 Dependency Reason

Requires the existence of a secure Admin Dashboard to host the UI for this feature.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-091

#### 6.1.2.2 Dependency Reason

Requires the ability for an admin to search for and view user account details to initiate the suspension.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-093

#### 6.1.3.2 Dependency Reason

Requires the Admin Audit Log system to be functional to record this moderation action.

## 6.2.0.0 Technical Dependencies

- User Model: Must be extended to include 'status' (e.g., enum of 'active', 'suspended') and 'suspension_expires_at' (timestamp) fields.
- Authentication Service: Login logic must be updated to check for 'suspended' status.
- Session Management (Redis): Requires access to the JWT blocklist to invalidate active sessions.
- Job Scheduler: A reliable system (e.g., cron, AWS EventBridge) is needed to automate the lifting of suspensions.
- Transactional Email Service (AWS SES): Required to send suspension notifications to users.

## 6.3.0.0 Data Dependencies

- Requires access to the User database to update status.
- Requires write access to the Admin Audit Log table.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The suspension action API call should have a P95 latency of < 200ms.
- Session invalidation should propagate within seconds of the suspension being applied.

## 7.2.0.0 Security

- The API endpoint for suspending users must be protected and only accessible by authenticated users with the 'Administrator' role.
- The reason for suspension, which may contain sensitive details, must be stored securely and access-controlled.
- All actions must be logged in the immutable audit trail as per SRS-001-F8.5.

## 7.3.0.0 Usability

- The process of suspending a user should be intuitive and require minimal steps for an administrator.
- Error messages, both for the admin and the suspended user, must be clear and informative.

## 7.4.0.0 Accessibility

- The admin-facing UI for this feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The Admin Dashboard functionality must be compatible with the latest versions of major web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Coordination between multiple system components: Admin Service, User/Auth Service, Database, Job Scheduler, and Email Service.
- Modification of critical authentication path.
- Implementation of a reliable, stateful scheduled job system for un-banning.
- Requires both frontend (Admin UI) and backend (API, business logic) development.

## 8.3.0.0 Technical Risks

- The scheduled job mechanism failing to run, leaving users suspended indefinitely. Requires robust monitoring and error handling for the scheduler.
- Race conditions if an admin tries to modify a suspension at the exact moment it expires.

## 8.4.0.0 Integration Points

- User Service: To update user status.
- Authentication Service: To check status on login.
- Redis Cache: To invalidate JWTs.
- Admin Audit Log Service: To record the action.
- Notification Service / AWS SES: To email the user.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify an admin can suspend a user for a preset duration.
- Verify an admin can suspend a user for a custom duration.
- Verify a suspended user cannot log in and sees the correct message.
- Verify a suspension is automatically lifted after its duration expires (using a short test duration).
- Verify an admin cannot suspend another admin.
- Verify all suspension actions are correctly recorded in the audit log.
- Verify the user's session is killed immediately upon suspension.

## 9.3.0.0 Test Data Needs

- Test accounts with 'Administrator' role.
- Test accounts with 'User' role.
- Pre-configured email templates for suspension notifications.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Supertest for API integration tests.
- Cypress or Playwright for E2E tests.
- A time-mocking library to test the scheduled job without waiting.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% coverage for new code.
- E2E tests for the happy path and key error conditions are implemented and passing.
- The feature is compliant with security requirements and has been reviewed for vulnerabilities.
- UI/UX has been reviewed and approved by the product owner/designer.
- Relevant documentation (e.g., administrator guide) has been updated.
- The feature has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story has significant backend complexity, particularly around the job scheduler and auth service modifications. Ensure backend capacity is available.
- Prerequisite stories (US-083, US-091, US-093) must be completed before this story can be started.

## 11.4.0.0 Release Impact

This is a critical feature for platform moderation and is required for any public launch where user interaction is enabled.

