# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-058 |
| Elaboration Date | 2025-01-18 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Delete an Existing Comment |
| As A User Story | As a Content Contributor, I want to permanently de... |
| User Persona | Any authenticated user who has previously posted a... |
| Business Value | Enhances user trust and control by allowing users ... |
| Functional Area | Content Sharing and Feed |
| Story Theme | Post and Comment Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: User successfully deletes their own comment

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user viewing a post that contains a comment I have authored

### 3.1.5 When

I click the 'delete' option for my comment, and then click 'Confirm' in the confirmation dialog

### 3.1.6 Then

The comment is immediately removed from the user interface, the comment count on the parent post is decremented, and a success notification ('Comment deleted') is briefly displayed.

### 3.1.7 Validation Notes

Verify via UI that the comment disappears. Verify via database query that the corresponding record in the 'Comment' table is permanently deleted.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

User cancels the deletion process

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

I am a logged-in user and the deletion confirmation dialog for my comment is open

### 3.2.5 When

I click the 'Cancel' button or close the dialog

### 3.2.6 Then

The confirmation dialog closes, and my comment remains visible and unchanged in the comment list.

### 3.2.7 Validation Notes

Verify via UI that the comment is still present and no API call for deletion was made.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

User cannot delete another user's comment

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I am a logged-in user viewing a post

### 3.3.5 When

I view a comment authored by another user

### 3.3.6 Then

I must not see any 'delete' option or control for that comment.

### 3.3.7 Validation Notes

Verify via UI inspection that the delete control is not present in the DOM for comments not authored by the current user.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

API rejects unauthorized deletion attempt

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

I am a logged-in user with a valid session token

### 3.4.5 When

I attempt to send a direct API request to delete a comment that was authored by another user

### 3.4.6 Then

The API must reject the request with a '403 Forbidden' status code, and the comment must not be deleted from the database.

### 3.4.7 Validation Notes

Use an API client like Postman or Insomnia to craft and send the malicious request. Verify the response status code and check the database to ensure the record was not deleted.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

System handles network error during deletion

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

I am a logged-in user and have confirmed the deletion of my comment

### 3.5.5 When

The API call to delete the comment fails due to a network error

### 3.5.6 Then

An error message (e.g., 'Failed to delete comment. Please try again.') is displayed, and my comment remains visible in the UI.

### 3.5.7 Validation Notes

Simulate a network failure using browser developer tools and verify the UI response.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'delete' control (e.g., trash can icon or an option in a '...' kebab menu) associated with each comment.
- A confirmation modal/dialog with a clear warning message (e.g., 'Are you sure you want to permanently delete this comment? This action cannot be undone.'), a 'Confirm' button, and a 'Cancel' button.
- A transient toast notification for success or error feedback.

## 4.2.0 User Interactions

- The 'delete' control is only visible and interactive on comments authored by the currently logged-in user.
- Clicking the 'delete' control opens the confirmation modal.
- The UI should update optimistically (remove the comment immediately) upon confirmation, without requiring a full page reload.

## 4.3.0 Display Requirements

- The comment count on the parent post must be updated after a successful deletion.

## 4.4.0 Accessibility Needs

- The delete control must have an accessible name (e.g., `aria-label='Delete comment'`).
- The confirmation modal must be fully keyboard-navigable, trap focus, and be properly announced by screen readers.

# 5.0.0 Business Rules

- {'rule_id': 'BR-001', 'rule_description': 'A user can only delete their own comments.', 'enforcement_point': 'This rule is enforced at both the UI layer (by hiding the delete control) and the API layer (through an authorization check).', 'violation_handling': 'UI: The action is not possible. API: The request is rejected with a 403 Forbidden error.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-006

#### 6.1.1.2 Dependency Reason

User must be authenticated to perform any action on comments.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-056

#### 6.1.2.2 Dependency Reason

A comment must be created before it can be deleted. This story provides the entity to be deleted.

## 6.2.0.0 Technical Dependencies

- Backend API endpoint for deleting a comment (e.g., DELETE /comments/:id).
- Authentication service to identify the current user.
- Authorization logic to verify comment ownership.
- Frontend state management solution to handle UI updates.

## 6.3.0.0 Data Dependencies

- Requires the 'Comment' data entity to have a clear reference to its author (e.g., `authorId`).

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for deletion must have a P95 latency of less than 200ms, as per SRS-001-NFR 2.1.2.
- The UI update upon deletion must be perceived as instantaneous by the user.

## 7.2.0.0 Security

- The backend must perform a server-side authorization check to ensure the requesting user is the author of the comment before proceeding with deletion.
- All API requests must be authenticated.

## 7.3.0.0 Usability

- The deletion process must include a confirmation step to prevent accidental data loss.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported browsers and devices as defined in the project scope.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Standard CRUD (Delete) operation.
- Requires both frontend and backend changes.
- Authorization logic is straightforward (user ID match).

## 8.3.0.0 Technical Risks

- Potential for race conditions if another action (e.g., post deletion) occurs simultaneously. The backend should handle cases where the comment might already be gone.

## 8.4.0.0 Integration Points

- Integrates with the User Authentication service to get the current user's ID.
- Interacts with the PostgreSQL database to delete the comment record.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify successful deletion of own comment.
- Verify cancellation of deletion.
- Verify the delete option is not visible on others' comments.
- Verify API rejects unauthorized deletion attempts (manual API test).
- Verify UI feedback on success and failure.

## 9.3.0.0 Test Data Needs

- At least two test user accounts.
- A post with comments from both test users.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Jest/Supertest for backend API integration tests.
- Cypress or Playwright for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other developer
- Unit tests implemented for frontend and backend logic with >80% coverage
- Integration tests for the API endpoint are implemented and passing
- E2E test scenario for successful deletion is automated and passing
- UI/UX has been reviewed and approved by the design lead
- Security check (authorization) on the backend is confirmed
- Accessibility requirements (keyboard nav, ARIA labels) are met and verified
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

2

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is dependent on US-056 (Create Comment) and should be scheduled in the same or a subsequent sprint.

## 11.4.0.0 Release Impact

This is a core feature for user content management and is essential for the initial public launch.

