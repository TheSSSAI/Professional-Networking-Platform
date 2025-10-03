# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-081 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Manage Email Notification Preferences |
| As A User Story | As a registered user, I want to access a settings ... |
| User Persona | Any registered user of the platform who wants to m... |
| Business Value | Improves user satisfaction and retention by giving... |
| Functional Area | User Account Management |
| Story Theme | Notifications and User Settings |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Accessing the Notification Preferences Page

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user

### 3.1.5 When

I navigate to my account settings and select 'Notification Preferences'

### 3.1.6 Then

I am presented with a page listing all configurable email notification types.

### 3.1.7 Validation Notes

Verify the page loads correctly and displays the list of notification toggles.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Default Notification Settings for New Users

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am a new user who has just completed registration

### 3.2.5 When

I view the 'Notification Preferences' page for the first time

### 3.2.6 Then

All configurable email notification options are enabled by default.

### 3.2.7 Validation Notes

Check the database or API response to confirm the default state for a new user's settings is 'enabled' for all types.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Disabling an Email Notification

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

I am on the 'Notification Preferences' page and the 'New connection request' notification is enabled

### 3.3.5 When

I click the toggle to disable the 'New connection request' notification

### 3.3.6 Then

The toggle's visual state changes to 'off', the preference is saved to the backend, and I see a success confirmation message (e.g., 'Settings saved').

### 3.3.7 Validation Notes

Trigger an event that would normally send this email (e.g., have another user send a connection request) and verify that no email is delivered.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Re-enabling an Email Notification

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

I am on the 'Notification Preferences' page and the 'Someone comments on my post' notification is disabled

### 3.4.5 When

I click the toggle to re-enable the 'Someone comments on my post' notification

### 3.4.6 Then

The toggle's visual state changes to 'on', the preference is saved, and I see a success confirmation message.

### 3.4.7 Validation Notes

Trigger an event that sends this email (e.g., have another user comment on my post) and verify that the email is successfully delivered.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Transactional Emails are Not Configurable

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

I am on the 'Notification Preferences' page

### 3.5.5 When

I review the list of available options

### 3.5.6 Then

I do not see options to disable critical transactional emails such as 'Password Reset' or 'Account Verification'.

### 3.5.7 Validation Notes

Inspect the UI to ensure these options are absent. Verify that requesting a password reset still sends an email regardless of notification settings.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Failed Attempt to Save Preferences

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

I am on the 'Notification Preferences' page

### 3.6.5 When

I change a setting, but the API call to save the preference fails due to a network or server error

### 3.6.6 Then

The toggle reverts to its original state, and I am shown a clear error message (e.g., 'Failed to save settings. Please try again.').

### 3.6.7 Validation Notes

Use browser developer tools to simulate a failed API response (e.g., 500 error) and verify the UI handles it gracefully.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated 'Notification Preferences' section within the main user settings area.
- A list of toggle switches (e.g., MUI Switch component), one for each configurable notification type.
- Clear, descriptive labels for each toggle (e.g., 'When someone sends you a connection request').
- A toast notification or similar non-intrusive feedback mechanism for success and error messages.

## 4.2.0 User Interactions

- Clicking a toggle immediately changes its state and triggers an auto-save action.
- While the save is in progress, the toggle may show a loading state or be temporarily disabled to prevent rapid changes.

## 4.3.0 Display Requirements

- The page must clearly display the current enabled/disabled state of each notification type upon loading.
- The list of configurable notifications must include: New connection request, Accepted connection request, Post reaction, Post comment.

## 4.4.0 Accessibility Needs

- All toggle switches must be keyboard accessible (focusable and operable via Spacebar/Enter).
- Each toggle must have a proper ARIA role (`role="switch"`) and state (`aria-checked`).
- Labels must be programmatically associated with their corresponding toggle switch using `for`/`id` attributes or `aria-labelledby`.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-NOTIF-01

### 5.1.2 Rule Description

All non-transactional email notifications must be configurable by the user.

### 5.1.3 Enforcement Point

Backend Notification Service

### 5.1.4 Violation Handling

N/A (Design constraint)

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-NOTIF-02

### 5.2.2 Rule Description

Critical transactional emails (account verification, password reset, account deletion warnings) are mandatory and cannot be disabled by the user.

### 5.2.3 Enforcement Point

Backend Authentication/Account Management Service

### 5.2.4 Violation Handling

N/A (Design constraint)

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-NOTIF-03

### 5.3.2 Rule Description

For new users, all configurable email notifications must be enabled by default to encourage initial engagement.

### 5.3.3 Enforcement Point

User Registration Process

### 5.3.4 Violation Handling

N/A (Default state)

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-006

#### 6.1.1.2 Dependency Reason

Requires a logged-in user session to access account settings.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-073

#### 6.1.2.2 Dependency Reason

The system logic for generating 'new connection request' notifications must exist to be controlled.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-074

#### 6.1.3.2 Dependency Reason

The system logic for generating 'accepted connection request' notifications must exist to be controlled.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

US-075

#### 6.1.4.2 Dependency Reason

The system logic for generating 'post reaction' notifications must exist to be controlled.

### 6.1.5.0 Story Id

#### 6.1.5.1 Story Id

US-076

#### 6.1.5.2 Dependency Reason

The system logic for generating 'post comment' notifications must exist to be controlled.

## 6.2.0.0 Technical Dependencies

- User Authentication Service: To secure the settings endpoint.
- Primary Database (PostgreSQL): Requires a schema modification to store user notification preferences (e.g., a JSONB column on the User table or a new UserSettings table).
- Transactional Email Service (AWS SES): The notification-sending logic must integrate with the new settings before calling the SES API.

## 6.3.0.0 Data Dependencies

- Requires access to the authenticated user's ID to fetch and update their specific settings.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for updating a preference should have a P95 latency of less than 200ms.
- The settings page itself should achieve a Largest Contentful Paint (LCP) of under 2.5 seconds.

## 7.2.0.0 Security

- The API endpoint for managing preferences must be protected and ensure a user can only modify their own settings (Authorization).
- All data must be transmitted over HTTPS/TLS 1.3.

## 7.3.0.0 Usability

- The interface should be intuitive, with changes saved automatically to reduce user effort.
- Feedback on save success or failure must be immediate and clear.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The settings page must be fully functional and responsive on all supported browsers and devices (desktops, tablets, mobile phones).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires a database schema change.
- Requires a new API endpoint for managing settings.
- The most complex part is ensuring that all existing and future services that send emails are modified to check the user's preferences first. This cross-cutting concern may require creating a centralized notification utility or library to be used by all other services.

## 8.3.0.0 Technical Risks

- Risk of a service forgetting to check the user's preference before sending an email. A centralized notification service is the primary mitigation for this risk.
- Potential for race conditions if a user rapidly toggles settings. The backend should handle requests idempotently.

## 8.4.0.0 Integration Points

- Frontend Settings UI -> Backend User Settings API
- All Backend Services (Connections, Content, etc.) -> User Settings Service/Database -> AWS SES

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify a user can load, view, and change their settings.
- Verify that disabling a notification type prevents the corresponding email from being sent.
- Verify that re-enabling a notification type allows the corresponding email to be sent.
- Verify that API errors are handled gracefully on the frontend.
- Verify that unauthenticated users cannot access the settings page or API.
- Verify that a user cannot modify another user's settings.

## 9.3.0.0 Test Data Needs

- At least two test user accounts to simulate interactions (e.g., one user changes settings, the other performs an action to trigger a notification).

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Jest/Supertest for backend API integration tests.
- Cypress or Playwright for E2E tests.
- Axe for automated accessibility checks.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by team
- Unit tests implemented and passing with >80% coverage
- Integration testing completed successfully, confirming emails are correctly suppressed/sent based on settings
- User interface reviewed and approved by UX/Product
- Performance requirements verified via API load testing
- Security requirements validated (endpoint authorization)
- Accessibility audit (WCAG 2.1 AA) passed
- Story deployed and verified in staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- The backend work, including the database schema change and the creation of a centralized preference-checking mechanism, should be prioritized as it may impact multiple services.
- Frontend development can begin in parallel using a mocked API.

## 11.4.0.0 Release Impact

This is a key user-facing feature for account management and is expected to be part of the initial public launch.

