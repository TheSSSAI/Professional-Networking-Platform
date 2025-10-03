# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-055 |
| Elaboration Date | 2025-01-18 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Remove a Reaction from a Post |
| As A User Story | As a platform user who has reacted to a post, I wa... |
| User Persona | Any authenticated user who has previously interact... |
| Business Value | Provides users with control over their expressed i... |
| Functional Area | Content Sharing and Feed |
| Story Theme | Post Interactions |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

User successfully removes their own reaction from a post

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user viewing a post in my feed that I have previously reacted to (e.g., 'Liked')

### 3.1.5 When

I click the same reaction button again (the one that is currently in a 'selected' state)

### 3.1.6 Then

My reaction is immediately removed from the post, the reaction button visually returns to its default 'un-selected' state, and the total reaction count for the post is decremented by one.

### 3.1.7 Validation Notes

Verify via UI observation. The backend API call should return a success status (e.g., HTTP 204 No Content). The corresponding record in the 'Reactions' database table should be deleted.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

UI state reverts if the backend fails to remove the reaction

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

I am a logged-in user viewing a post I have reacted to

### 3.2.5 When

I click the 'selected' reaction button, but the API call to the server fails due to a network error

### 3.2.6 Then

The reaction button should revert to its 'selected' state, and a non-intrusive error message (e.g., a toast notification) should inform me that the action could not be completed.

### 3.2.7 Validation Notes

Simulate a network failure for the DELETE request using browser developer tools or a testing framework. The UI state should not permanently change, and the database record must remain.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

User cannot remove another user's reaction

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I am a logged-in user

### 3.3.5 When

I attempt to remove another user's reaction via a crafted API request

### 3.3.6 Then

The system must reject the request with an authorization error (e.g., HTTP 403 Forbidden), and no data should be changed in the database.

### 3.3.7 Validation Notes

This must be tested at the integration/API level. Attempt to send a DELETE request for a reaction record where the authenticated user ID does not match the user ID on the record.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Removing a reaction from a deleted post fails gracefully

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

I am viewing a post I have reacted to, and the post is deleted by its author in another session

### 3.4.5 When

I click the 'selected' reaction button

### 3.4.6 Then

The system should handle the action gracefully, returning an appropriate error (e.g., HTTP 404 Not Found), and the UI should ideally update to indicate the post is no longer available.

### 3.4.7 Validation Notes

Requires a test scenario where a post is deleted after it has been loaded on the client. The client should handle the 404 response from the API without crashing.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Action requires an active session

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

I am viewing a post I have reacted to, but my session has expired

### 3.5.5 When

I click the 'selected' reaction button

### 3.5.6 Then

The system must reject the request with an authentication error (e.g., HTTP 401 Unauthorized) and prompt me to log in again.

### 3.5.7 Validation Notes

Simulate an expired JWT or session token and attempt the API call. The UI should redirect to the login page or show a login modal.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Reaction button (e.g., 'Like' button)
- Reaction count display

## 4.2.0 User Interactions

- Clicking a 'selected' reaction button toggles it to the 'un-selected' state.
- The interaction should provide immediate visual feedback (optimistic update).

## 4.3.0 Display Requirements

- The reaction button must have two distinct, visually clear states: 'selected' and 'un-selected'.
- The total reaction count must be displayed adjacent to the reaction button and update upon successful removal.

## 4.4.0 Accessibility Needs

- The reaction button must be focusable and operable via keyboard (Enter/Space keys).
- The button must use ARIA attributes to convey its state, such as `aria-pressed="true"` when selected and `aria-pressed="false"` when not.
- The color contrast for the 'selected' state must meet WCAG 2.1 AA standards.

# 5.0.0 Business Rules

- {'rule_id': 'BR-001', 'rule_description': 'A user can only remove their own reactions.', 'enforcement_point': 'Backend API (Service Layer)', 'violation_handling': 'The request is denied with an HTTP 403 Forbidden status code, and the action is logged for security monitoring.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-054

#### 6.1.1.2 Dependency Reason

This story implements the 'undo' functionality for reacting to a post. The ability to add a reaction must exist before the ability to remove it can be developed.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-053

#### 6.1.2.2 Dependency Reason

The user must be able to view posts in a feed to interact with them.

## 6.2.0.0 Technical Dependencies

- A functioning authentication service to validate user sessions.
- The Post data model and corresponding database table.
- The Reaction data model and corresponding database table.
- A client-side state management solution to handle optimistic UI updates.

## 6.3.0.0 Data Dependencies

- Requires existing post data and reaction data in the database for testing.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for removing a reaction must have a P95 latency of less than 200ms, as per SRS-001-NFR (2.1.2).

## 7.2.0.0 Security

- All API requests must be authenticated and authorized.
- The system must prevent a user from removing reactions of other users.
- The endpoint should be protected against CSRF attacks if using cookie-based sessions.

## 7.3.0.0 Usability

- The action of removing a reaction should be intuitive and require a single click on the already-active reaction icon.

## 7.4.0.0 Accessibility

- Must adhere to WCAG 2.1 Level AA standards, as specified in SRS-001-NFR (2.4.3).

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported browsers and devices (desktops, tablets, mobile phones).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- This is a standard DELETE operation on an existing feature.
- Frontend state management for optimistic updates is the main consideration but is a well-understood pattern.

## 8.3.0.0 Technical Risks

- Potential for race conditions if a user clicks rapidly, which can be mitigated with UI button disabling or request debouncing.
- Ensuring UI state remains consistent with backend state after network failures.

## 8.4.0.0 Integration Points

- Frontend Post Component: To handle the click event and update the UI.
- Backend API Gateway: To route the DELETE request.
- Reactions Service (Backend): To process the business logic and database transaction.
- PostgreSQL Database: To delete the record from the 'reactions' table.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify successful reaction removal and UI update.
- Verify reaction count decrements correctly.
- Test API failure and UI reversion.
- Test security by attempting to remove another user's reaction via API.
- Test E2E flow: log in, like a post, then unlike the post and verify the final state.

## 9.3.0.0 Test Data Needs

- A test user account.
- A post created by another user.
- A reaction on that post made by the test user.

## 9.4.0.0 Testing Tools

- Jest/Vitest for frontend/backend unit tests.
- Supertest for API integration tests.
- Cypress or Playwright for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other developer
- Unit and integration tests implemented with >80% coverage for new code
- E2E tests for the happy path scenario are passing
- User interface reviewed and approved by UX/Product Owner
- Performance requirements (P95 < 200ms) verified under load
- Security requirements validated (authorization checks)
- Accessibility (ARIA) attributes are implemented and verified
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

1

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is dependent on US-054 (Add Reaction) and should be scheduled in the same or a subsequent sprint.
- It's a small, self-contained change that is ideal for pairing with a larger story in a sprint.

## 11.4.0.0 Release Impact

This is a core feature for user interaction. Releasing without this functionality would be a noticeable gap in the user experience.

