# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-014 |
| Elaboration Date | 2025-01-18 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Reactivate Account by Logging In |
| As A User Story | As a returning user with a previously deactivated ... |
| User Persona | A returning user whose account is in a 'deactivate... |
| Business Value | Increases user retention and re-engagement by prov... |
| Functional Area | User Authentication and Account Management |
| Story Theme | Account Lifecycle Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful reactivation on login

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A user exists with an account status of 'deactivated' and their profile and posts are invisible

### 3.1.5 When

The user enters their correct email and password on the login page and submits the form

### 3.1.6 Then

The user's account status is updated to 'active' in the database, they are successfully logged in, and redirected to their home feed. A confirmation message 'Welcome back! Your account has been reactivated.' is displayed. Their profile and posts are restored to their previous visibility settings.

### 3.1.7 Validation Notes

Verify via E2E test: 1. Deactivate a test user. 2. Log in with that user. 3. Assert redirection to the home feed. 4. Assert the presence of the success toast. 5. As another user, verify the test user's profile is now visible.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Login attempt with incorrect password for a deactivated account

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

A user exists with an account status of 'deactivated'

### 3.2.5 When

The user enters their correct email but an incorrect password

### 3.2.6 Then

The standard 'Invalid credentials' error message is displayed, the user is not logged in, and their account status remains 'deactivated'.

### 3.2.7 Validation Notes

Automated test should attempt login with wrong password and assert that the API returns a 401/403 error and the user status in the DB is unchanged.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Content re-association after reactivation

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

A user had content (comments, messages) that was anonymized to 'Deactivated User' while their account was deactivated

### 3.3.5 When

The user successfully reactivates their account by logging in

### 3.3.6 Then

All previously anonymized content is now correctly attributed with the user's name and a link to their profile.

### 3.3.7 Validation Notes

Manual or E2E test: 1. User A comments on a post. 2. User A deactivates. 3. Verify comment is anonymized. 4. User A logs in to reactivate. 5. Verify the comment now shows User A's name again.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Login attempt for a banned account

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

A user exists with an account status of 'banned'

### 3.4.5 When

The user attempts to log in with correct credentials

### 3.4.6 Then

The login fails, a message indicating the account is suspended is displayed, and the account status remains 'banned'.

### 3.4.7 Validation Notes

Integration test should check that the login endpoint rejects authentication for users with a 'banned' status.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Login during account deletion grace period cancels deletion

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

A user has requested permanent account deletion and is within the 14-day grace period (status is 'pending_deletion')

### 3.5.5 When

The user successfully logs in with their correct credentials

### 3.5.6 Then

The pending deletion request is cancelled, the account status is updated to 'active', the user is logged in, and a confirmation message is displayed, such as 'Welcome back! Your account has been reactivated and the scheduled deletion has been cancelled.'

### 3.5.7 Validation Notes

E2E test: 1. Request deletion for a test user. 2. Within the grace period, log in. 3. Assert the specific confirmation message. 4. Check the database to confirm the user status is 'active' and any deletion timestamp is cleared.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Standard Login Form (no changes)
- Toast/Notification component for displaying the reactivation message

## 4.2.0 User Interactions

- User enters credentials and clicks 'Log In'.
- User sees a temporary, non-blocking notification confirming reactivation upon successful login.

## 4.3.0 Display Requirements

- On successful login, a message must confirm both reactivation and, if applicable, cancellation of a pending deletion.
- The user must be seamlessly transitioned to their home feed after login.

## 4.4.0 Accessibility Needs

- The confirmation notification must be accessible to screen readers (e.g., using an `aria-live` region).

# 5.0.0 Business Rules

- {'rule_id': 'BR-001', 'rule_description': "A successful login attempt for an account with 'deactivated' or 'pending_deletion' status must change the status to 'active'.", 'enforcement_point': 'Within the Authentication Service, after credential validation but before session token generation.', 'violation_handling': 'If the status update fails, the login transaction must be rolled back, and a generic server error should be returned to the user.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-006

#### 6.1.1.2 Dependency Reason

A functional login system must exist before its logic can be modified for reactivation.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-013

#### 6.1.2.2 Dependency Reason

The ability to deactivate an account is required to create the initial state for this story.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-015

#### 6.1.3.2 Dependency Reason

The account deletion flow is required to test the edge case of reactivating during the grace period (AC-005).

## 6.2.0.0 Technical Dependencies

- Authentication Service
- User Management Service
- PostgreSQL Database with a 'status' field on the User entity

## 6.3.0.0 Data Dependencies

- Requires user records with 'deactivated' and 'pending_deletion' statuses for testing.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The reactivation logic (database updates) must not add more than 50ms to the P95 latency of the login API endpoint.

## 7.2.0.0 Security

- The process must not introduce any vulnerabilities into the authentication flow. The status check must occur after successful credential validation.
- The database transaction for updating user status must be atomic to prevent inconsistent states.

## 7.3.0.0 Usability

- The reactivation process should be completely transparent and seamless to the user, feeling like a normal login.

## 7.4.0.0 Accessibility

- WCAG 2.1 Level AA standards must be maintained for the login form and any notifications.

## 7.5.0.0 Compatibility

- The login and reactivation flow must function correctly on all supported browsers.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Modification of the critical authentication path requires careful implementation and thorough testing.
- Ensuring the atomicity of the state change transaction.
- Logic must handle multiple initial states ('deactivated', 'pending_deletion') and differentiate from non-reactivatable states ('banned').
- Potential need for an asynchronous job to handle the re-association of content if the dataset is large, to keep login response times low.

## 8.3.0.0 Technical Risks

- Risk of creating a race condition or inconsistent user state if the status update fails after authentication succeeds.
- Potential for performance degradation of the login endpoint if the reactivation logic is too heavy.

## 8.4.0.0 Integration Points

- Authentication Service: Core logic will reside here.
- User Service: Will be called by the Auth Service to update the user's status.
- Database: The `users` table is the source of truth for account status.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify successful reactivation from 'deactivated' state.
- Verify successful reactivation and deletion cancellation from 'pending_deletion' state.
- Verify login failure for 'banned' accounts.
- Verify login failure with incorrect credentials for a 'deactivated' account.
- Verify that content visibility and attribution are correctly restored post-reactivation.

## 9.3.0.0 Test Data Needs

- Test user accounts pre-set to 'active', 'deactivated', 'pending_deletion', and 'banned' statuses.

## 9.4.0.0 Testing Tools

- Jest for unit tests
- Supertest for integration/API tests
- Cypress or Playwright for E2E tests

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least two peers
- Unit and integration tests implemented with >80% coverage for new logic
- E2E tests for the happy path and key alternative flows are implemented and passing
- User interface reviewed and approved by UX/Product
- Performance impact on the login API is measured and within the defined NFR
- Security review of changes to the authentication flow is completed
- Documentation for the authentication flow is updated to include the reactivation logic
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story modifies a critical user flow (login) and should be allocated sufficient time for rigorous testing.
- Depends on US-006, US-013, and US-015, so it cannot be scheduled in a sprint until they are completed.

## 11.4.0.0 Release Impact

This is a key user retention feature. Its inclusion in a release significantly improves the user experience for returning members.

