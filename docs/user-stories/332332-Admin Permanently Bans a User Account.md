# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-090 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Permanently Bans a User Account |
| As A User Story | As an Administrator, I want to permanently ban a u... |
| User Persona | Administrator with content moderation privileges. |
| Business Value | Maintains platform integrity, user safety, and com... |
| Functional Area | Administration & Moderation |
| Story Theme | User Account Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin successfully bans a user account

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

An Administrator is logged into the Admin Dashboard and is viewing the management page for a non-admin user.

### 3.1.5 When

The Administrator clicks the 'Ban User' action and confirms the permanent ban in the confirmation modal.

### 3.1.6 Then

A success notification is displayed to the Administrator, the user's status in the database is updated to 'Banned', and their status is reflected in the Admin Dashboard UI.

### 3.1.7 Validation Notes

Verify the user's 'status' column in the 'users' table is set to 'BANNED'. Check for the success toast message in the UI.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Banned user's active sessions are terminated

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

A user is logged in with an active session, and an Administrator is viewing their account in the Admin Dashboard.

### 3.2.5 When

The Administrator permanently bans the user's account.

### 3.2.6 Then

The banned user's JWTs are immediately invalidated, and any subsequent API request from the user's active session fails with a 401 Unauthorized error.

### 3.2.7 Validation Notes

This can be tested by having an active session for a test user, banning them, and then attempting an API call (e.g., fetch feed) with their token. The token should be added to the Redis blocklist.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Banned user is prevented from logging in

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

A user's account has been permanently banned.

### 3.3.5 When

The banned user attempts to log in with their correct credentials.

### 3.3.6 Then

The login attempt is rejected, and a specific error message is displayed, such as 'Your account has been permanently suspended due to policy violations.'

### 3.3.7 Validation Notes

Test the login endpoint with the credentials of a banned user. The authentication service must check the user's status before issuing new tokens.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Banned user's primary content becomes invisible

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

A user with a profile and several posts has been banned.

### 3.4.5 When

Any other user attempts to view the banned user's profile or posts directly via URL or through the feed.

### 3.4.6 Then

The profile page returns a 'Not Found' or 'User Unavailable' error, and their posts no longer appear in any user's feed or search results.

### 3.4.7 Validation Notes

Verify that API endpoints for profiles and posts filter out content from users with a 'Banned' status.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Banned user's interactive content is anonymized

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

A user who has left comments on other users' posts is banned.

### 3.5.5 When

Another user views a post where the banned user had commented.

### 3.5.6 Then

The comment text remains, but the author's name is changed to 'Banned User', their profile picture is replaced with a generic avatar, and the link to their profile is disabled.

### 3.5.7 Validation Notes

Check a post with comments from a now-banned user. The API response for comments should return the anonymized author data.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Banned user is prevented from re-registering with the same email

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

A user's account associated with 'banned@email.com' has been permanently banned.

### 3.6.5 When

Anyone attempts to create a new account using 'banned@email.com'.

### 3.6.6 Then

The registration is blocked, and an error message is displayed indicating the email cannot be used.

### 3.6.7 Validation Notes

The registration logic must check against a blocklist of banned email addresses.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Ban action is recorded in the Admin Audit Log

### 3.7.3 Scenario Type

Happy_Path

### 3.7.4 Given

An Administrator is about to ban a user.

### 3.7.5 When

The Administrator confirms the ban action.

### 3.7.6 Then

A new entry is created in the immutable Admin Audit Log containing the acting administrator's ID, the banned user's ID, the action performed ('USER_BAN'), and a timestamp.

### 3.7.7 Validation Notes

Query the audit log database/table to confirm the record was created as specified in SRS-001-F8, 1.8.5.

## 3.8.0 Criteria Id

### 3.8.1 Criteria Id

AC-008

### 3.8.2 Scenario

Admin attempts to ban another administrator

### 3.8.3 Scenario Type

Error_Condition

### 3.8.4 Given

An Administrator is logged into the Admin Dashboard.

### 3.8.5 When

The Administrator attempts to perform the 'Ban User' action on another user who also has administrator privileges.

### 3.8.6 Then

The action is blocked, and an error message is displayed, such as 'Administrators cannot be banned.'

### 3.8.7 Validation Notes

The backend logic must check the target user's role before processing the ban request.

## 3.9.0 Criteria Id

### 3.9.1 Criteria Id

AC-009

### 3.9.2 Scenario

Admin cancels the ban action

### 3.9.3 Scenario Type

Alternative_Flow

### 3.9.4 Given

An Administrator has clicked the 'Ban User' action, and the confirmation modal is displayed.

### 3.9.5 When

The Administrator clicks the 'Cancel' button.

### 3.9.6 Then

The modal closes, and no changes are made to the user's account status. No audit log entry is created.

### 3.9.7 Validation Notes

Verify the user's status in the database remains unchanged after cancellation.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- 'Ban User' button or menu item on the user management page in the Admin Dashboard.
- Confirmation modal with a clear warning message about the irreversibility of the action.
- 'Confirm Ban' and 'Cancel' buttons within the modal.
- Success/error toast notifications to provide feedback on the action.

## 4.2.0 User Interactions

- Admin clicks 'Ban User' to open the confirmation modal.
- Admin must explicitly click 'Confirm Ban' to execute the action.
- The UI on the user list should update to reflect the new 'Banned' status of the user.

## 4.3.0 Display Requirements

- The confirmation modal must display the name and/or email of the user being banned.
- The login page must display a specific, non-generic error message for banned users.

## 4.4.0 Accessibility Needs

- All UI elements (buttons, modals) must be keyboard accessible and screen-reader friendly, adhering to WCAG 2.1 AA standards.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-BAN-001

### 5.1.2 Rule Description

A permanent ban is an irreversible action. A banned user cannot be unbanned through the application UI.

### 5.1.3 Enforcement Point

Backend Admin Service

### 5.1.4 Violation Handling

The system will not provide any functionality to reverse a 'Banned' status.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-BAN-002

### 5.2.2 Rule Description

An administrator cannot ban another administrator.

### 5.2.3 Enforcement Point

Backend Admin Service

### 5.2.4 Violation Handling

The API request will be rejected with a 'Forbidden' error status and a descriptive message.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-BAN-003

### 5.3.2 Rule Description

All permanent ban actions must be logged in the Admin Audit Log for accountability.

### 5.3.3 Enforcement Point

Backend Admin Service, upon successful ban.

### 5.3.4 Violation Handling

If the audit log write fails, the transaction should ideally be rolled back or flagged for immediate administrative review.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-083

#### 6.1.1.2 Dependency Reason

Requires the existence of a secure Admin Dashboard to host the UI for this action.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-091

#### 6.1.2.2 Dependency Reason

Requires the ability for an admin to search for and view user accounts to select a user to ban.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-093

#### 6.1.3.2 Dependency Reason

Requires the Admin Audit Log system to be in place to record the ban action.

## 6.2.0.0 Technical Dependencies

- User Service: Must support a 'Banned' status for user accounts.
- Authentication Service: Must be able to check user status on login and have a mechanism for immediate session invalidation (e.g., Redis token blocklist).
- Database: The 'users' table schema must include a status field/enum.
- Admin Backend: An API endpoint to handle the ban request and orchestrate calls to other services.

## 6.3.0.0 Data Dependencies

- Requires access to the user database to update user status.
- Requires access to the session/cache store (Redis) to invalidate tokens.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The ban action API call should have a P95 latency of < 500ms.
- The process of anonymizing a user's past content (comments, messages) can be asynchronous if it impacts performance, but the ban itself (login block, profile invisibility) must be synchronous and immediate.

## 7.2.0.0 Security

- The API endpoint for banning a user must be protected and only accessible by users with an 'Administrator' role.
- The system must prevent self-banning.
- All actions must be logged in an immutable audit trail as per SRS-001-F8, 1.8.5.

## 7.3.0.0 Usability

- The action must have a confirmation step to prevent accidental bans.
- The warning message must be clear and explicit about the permanent nature of the action.

## 7.4.0.0 Accessibility

- All related UI components in the Admin Dashboard must meet WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The Admin Dashboard functionality must be compatible with the latest versions of major web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordination across multiple microservices (Admin, User, Auth, Content).
- Implementing immediate session invalidation requires a robust token blocklist mechanism.
- The asynchronous process for anonymizing large volumes of historical user content needs careful design to be reliable and performant.

## 8.3.0.0 Technical Risks

- Potential for race conditions if a user is performing actions at the exact moment they are banned.
- Failure in the asynchronous content anonymization job could leave some user content improperly handled.

## 8.4.0.0 Integration Points

- Admin Service -> User Service (to update user status).
- Admin Service -> Auth Service/Redis (to invalidate sessions).
- Admin Service -> Logging Service (to write to the audit log).
- Content services (Posts, Comments) must query the User Service to check author status before rendering content.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify the full end-to-end flow: Admin logs in, bans a user, banned user tries to log in and fails.
- Verify that a banned user's profile is inaccessible (404).
- Verify that a banned user's comments are correctly anonymized.
- Verify that an admin cannot ban another admin.
- Verify that the audit log contains the correct information after a ban.

## 9.3.0.0 Test Data Needs

- Test accounts with different roles (Regular User, Administrator).
- A test user account with generated content (posts, comments) to verify content handling post-ban.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Supertest for API integration tests.
- Cypress or Playwright for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other engineer
- Unit and integration tests implemented with >80% coverage for new code
- E2E test scenario for the ban workflow is implemented and passing
- Security review confirms the endpoint is properly secured and audited
- User interface reviewed for usability and accessibility compliance
- Documentation for the admin moderation feature is updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical platform safety feature. It should be prioritized as soon as its dependencies (admin dashboard, user management) are complete.
- Requires backend and frontend effort. Backend work on cross-service communication is the most complex part.

## 11.4.0.0 Release Impact

- Enables active moderation, which is a prerequisite for a public launch to ensure community safety.

