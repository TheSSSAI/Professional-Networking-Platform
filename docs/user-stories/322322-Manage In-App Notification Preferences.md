# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-080 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Manage In-App Notification Preferences |
| As A User Story | As a platform user, I want to access a settings pa... |
| User Persona | Any registered and active user of the platform who... |
| Business Value | Increases user satisfaction and retention by givin... |
| Functional Area | User Account Management |
| Story Theme | Notifications and User Settings |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

User can access the notification preferences page

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user

### 3.1.5 When

I navigate to my account settings and select 'Notification Preferences'

### 3.1.6 Then

I should be presented with a page listing all available in-app notification types.

### 3.1.7 Validation Notes

Verify the navigation path and that the page loads correctly.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

All notification types are listed with default 'On' state

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am on the 'Notification Preferences' page for the first time

### 3.2.5 When

the page loads

### 3.2.6 Then

I should see a list of all notification types defined in SRS-001-F7 (New connection request, Request accepted, Post reaction, Post comment) and each type should have a toggle switch set to 'On' by default.

### 3.2.7 Validation Notes

Check the UI for the presence of all required toggles and their default state.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

User successfully disables a notification type

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

I am on the 'Notification Preferences' page and the toggle for 'Someone liked/reacted to their post' is 'On'

### 3.3.5 When

I click the toggle to disable it

### 3.3.6 Then

the toggle should visually switch to the 'Off' state, a confirmation message like 'Preferences saved' should briefly appear, and the setting should be persisted in the backend.

### 3.3.7 Validation Notes

Use browser dev tools to confirm the API call is successful (e.g., 200 OK response). Manually refresh the page to verify the setting persists.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Disabled notification preference is respected by the system

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

I have disabled notifications for 'Someone liked/reacted to their post'

### 3.4.5 When

another user likes one of my posts

### 3.4.6 Then

I should NOT receive an in-app notification (the notification badge count should not increment, and no new item should appear in my notification center for this event).

### 3.4.7 Validation Notes

This requires an integration or E2E test with two users. User A disables the notification, User B likes User A's post, and the test asserts that no notification is delivered to User A.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

User successfully re-enables a notification type

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

I am on the 'Notification Preferences' page and the toggle for 'Someone liked/reacted to their post' is 'Off'

### 3.5.5 When

I click the toggle to enable it

### 3.5.6 Then

the toggle should visually switch to the 'On' state, the setting should be persisted, and I should start receiving these notifications again.

### 3.5.7 Validation Notes

Verify via UI and subsequent actions that trigger the notification.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

System handles failure to save preferences

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

I am on the 'Notification Preferences' page and the toggle for 'Someone commented on their post' is 'On'

### 3.6.5 When

I click the toggle to disable it and the backend API call fails

### 3.6.6 Then

an error message like 'Failed to save preferences, please try again' should be displayed, and the toggle should revert to its original 'On' state.

### 3.6.7 Validation Notes

Use a tool like Charles Proxy or browser dev tools to simulate a network/API failure (e.g., 500 server error) and verify the UI response.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Preferences page is accessible

### 3.7.3 Scenario Type

Alternative_Flow

### 3.7.4 Given

I am a user navigating the site with a keyboard and screen reader

### 3.7.5 When

I navigate to the 'Notification Preferences' page and interact with the toggles

### 3.7.6 Then

I should be able to focus on each toggle using the 'Tab' key, activate it using the 'Space' or 'Enter' key, and the screen reader should announce the label and current state (e.g., 'Notifications for new comments, on, switch').

### 3.7.7 Validation Notes

Test using keyboard-only navigation and a screen reader (e.g., NVDA, VoiceOver). Run automated accessibility checks (e.g., Axe).

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Notification Preferences' link within the main User Settings area.
- A list of notification types, each with a clear, descriptive label.
- A toggle switch (e.g., MUI Switch component) for each notification type.
- A toast/snackbar component for displaying success or error messages upon saving.

## 4.2.0 User Interactions

- Clicking a toggle switch changes its state and triggers an API call to save the preference.
- There is no master 'Save' button; changes are saved automatically on interaction.
- The page should be fully responsive and usable on mobile, tablet, and desktop devices.

## 4.3.0 Display Requirements

- The current state (On/Off) of each preference must be clearly visible.
- Labels must be unambiguous (e.g., 'When a sent connection request has been accepted').

## 4.4.0 Accessibility Needs

- All interactive elements (toggles) must be keyboard accessible and have proper focus indicators.
- Each toggle must be programmatically associated with its label.
- ARIA attributes (e.g., `role='switch'`, `aria-checked`) must be used correctly.
- The page must comply with WCAG 2.1 Level AA standards.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-001

### 5.1.2 Rule Description

By default, all in-app notification types are enabled for new users.

### 5.1.3 Enforcement Point

During user account creation/initialization.

### 5.1.4 Violation Handling

N/A - System default.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-002

### 5.2.2 Rule Description

A user's notification preferences only apply to their own account.

### 5.2.3 Enforcement Point

API endpoint for updating preferences.

### 5.2.4 Violation Handling

The API must ensure the authenticated user can only modify their own settings, returning a 403 Forbidden or 404 Not Found error on any attempt to modify another user's preferences.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-006

#### 6.1.1.2 Dependency Reason

User must be able to log in to access account settings.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-073

#### 6.1.2.2 Dependency Reason

The system for generating 'new connection request' notifications must exist to be controlled.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-074

#### 6.1.3.2 Dependency Reason

The system for generating 'request accepted' notifications must exist to be controlled.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

US-075

#### 6.1.4.2 Dependency Reason

The system for generating 'post reaction' notifications must exist to be controlled.

### 6.1.5.0 Story Id

#### 6.1.5.1 Story Id

US-076

#### 6.1.5.2 Dependency Reason

The system for generating 'post comment' notifications must exist to be controlled.

## 6.2.0.0 Technical Dependencies

- A backend service for managing user accounts and settings.
- A relational database (PostgreSQL) to store the preference settings.
- The real-time notification service (WebSockets) must be able to query these preferences before sending a notification.

## 6.3.0.0 Data Dependencies

- Requires a data model to store user preferences, likely a `user_notification_preferences` table linked to the `users` table.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for updating a preference must respond with a P95 latency of less than 200ms (as per SRS-001-NFR 2.1.2).
- The check for a user's preference should add negligible latency to the overall notification generation process.

## 7.2.0.0 Security

- The API endpoint for managing preferences must be protected and require user authentication.
- Authorization logic must prevent a user from viewing or modifying another user's preferences.

## 7.3.0.0 Usability

- The interface must be intuitive, with clear labels for each notification type.
- Immediate feedback on state changes and save status is required.

## 7.4.0.0 Accessibility

- Must adhere to WCAG 2.1 Level AA standards (as per SRS-001-NFR 2.4.3).

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Frontend UI and API integration is low complexity.
- Backend CRUD for preferences is low complexity.
- The primary complexity is modifying the existing notification generation logic across potentially multiple microservices to perform a preference check before creating and fanning out a notification. This requires careful integration to avoid performance degradation or bugs.

## 8.3.0.0 Technical Risks

- Risk of introducing latency into the notification pipeline if the preference check is not optimized.
- Risk of incomplete implementation, where some notification types bypass the preference check.

## 8.4.0.0 Integration Points

- Frontend settings UI integrates with a new backend API endpoint.
- The core Notification Service must integrate with the new User Preferences data store/service.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify each notification type can be toggled on and off.
- Verify preferences persist after logging out and back in.
- Verify that a disabled notification is NOT generated or delivered.
- Verify that an enabled notification IS generated and delivered.
- Verify the UI's response to an API failure.
- Verify keyboard navigation and screen reader compatibility.

## 9.3.0.0 Test Data Needs

- At least two test user accounts to test the notification flow (one to perform an action, one to receive/not receive the notification).
- User accounts with default preferences and accounts with modified preferences.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- A backend testing framework (e.g., Jest for NestJS).
- Cypress or Playwright for E2E testing.
- Axe for automated accessibility testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other developer
- Unit tests implemented for all new components and logic, with >80% coverage
- Integration tests completed successfully, specifically verifying that preferences block notification generation
- E2E tests for the user flow are passing
- User interface reviewed and approved by UX/Product Owner
- Accessibility audit passed (automated and manual checks)
- Documentation for the new API endpoint is created/updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🟡 Medium

## 11.3.0.0 Sprint Considerations

- This story should be scheduled in a sprint after the core notification features (US-073 to US-076) are completed and stable.
- Requires coordination between frontend and backend developers, especially around the API contract and the integration with the notification service.

## 11.4.0.0 Release Impact

- This is a significant user experience improvement. It can be highlighted in release notes as giving users more control over their account.

