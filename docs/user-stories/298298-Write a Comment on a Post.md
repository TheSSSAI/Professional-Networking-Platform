# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-056 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Write a Comment on a Post |
| As A User Story | As a registered user viewing a post, I want to wri... |
| User Persona | Any registered and logged-in user of the platform ... |
| Business Value | Increases user engagement, content generation, and... |
| Functional Area | Content Sharing and Feed |
| Story Theme | Post Interaction and Engagement |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successfully post a valid comment on an accessible post

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user viewing a post that I have permission to comment on

### 3.1.5 When

I type a valid text comment (e.g., 'Great insight!') into the comment input field and click the 'Post' button

### 3.1.6 Then

The comment is submitted successfully, my new comment appears in the comment list for that post, displaying my name, profile picture, and the comment text, and the comment input field is cleared.

### 3.1.7 Validation Notes

Verify via UI that the comment appears. Verify in the database that a new record in the 'Comment' table is created, correctly associated with the user_id and post_id.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Attempt to post an empty comment

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

I am a logged-in user viewing a post

### 3.2.5 When

I click the 'Post' button without entering any text in the comment input field

### 3.2.6 Then

The comment is not submitted, no new comment appears, and a user-friendly error message (e.g., 'Comment cannot be empty') is displayed near the input field.

### 3.2.7 Validation Notes

The 'Post' button should ideally be disabled until at least one character is typed. If enabled, verify the client-side and server-side validation prevents submission.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Attempt to post a comment exceeding the character limit

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I am a logged-in user viewing a post

### 3.3.5 When

I enter text exceeding the 1500-character limit and attempt to post the comment

### 3.3.6 Then

The comment is not submitted, and a user-friendly error message is displayed indicating the character limit has been exceeded.

### 3.3.7 Validation Notes

The UI should provide a character counter. The backend must reject the request with a 400-level status code and an appropriate error message.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Comment submission fails due to a network error

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

I am a logged-in user and have typed a valid comment

### 3.4.5 When

I click 'Post' and the network request to the server fails

### 3.4.6 Then

A user-friendly error message (e.g., 'Failed to post comment. Please try again.') is displayed, and the text I typed remains in the input field.

### 3.4.7 Validation Notes

Simulate a network failure using browser developer tools or a testing framework to verify the UI handles the error gracefully.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Verify comment permissions for a public profile

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

I am a logged-in user viewing a post from another user with a public profile

### 3.5.5 When

I view the post, regardless of my connection status with the author

### 3.5.6 Then

I can see the comment input field and am able to post a comment.

### 3.5.7 Validation Notes

Test with a user who is not a first-degree connection to the author of a post on a public profile.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Verify comment permissions for a private profile (non-connection)

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

I am a logged-in user viewing a post from another user with a private profile, and we are not first-degree connections

### 3.6.5 When

I view the post

### 3.6.6 Then

The comment input field and the 'Post' button are not visible or are disabled.

### 3.6.7 Validation Notes

Verify both the UI state and that any direct API calls to post a comment are rejected by the server with a 403 Forbidden status.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A multi-line text input area (textarea) for the comment.
- A 'Post' or 'Submit' button to submit the comment.
- A character counter displayed near the input area (e.g., '120/1500').
- The current user's profile picture displayed adjacent to the comment input area.

## 4.2.0 User Interactions

- The 'Post' button should be disabled if the input area is empty.
- The input area should expand vertically as the user types more lines of text.
- After successful submission, the UI should update optimistically to show the new comment immediately, without a full page reload.
- Error messages should appear inline, close to the input field.

## 4.3.0 Display Requirements

- Posted comments must display the author's full name, profile picture, and the comment text.
- The timestamp of the comment (e.g., '5m ago', '1h ago') should be displayed.

## 4.4.0 Accessibility Needs

- The comment input area must have an associated `<label>` for screen readers.
- The 'Post' button must be focusable and activatable via keyboard (Enter key).
- Error messages must be programmatically associated with the input field using `aria-describedby`.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-COMMENT-001

### 5.1.2 Rule Description

A comment cannot be empty.

### 5.1.3 Enforcement Point

Client-side validation and Server-side API.

### 5.1.4 Violation Handling

Display an error message to the user; the server rejects the request.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-COMMENT-002

### 5.2.2 Rule Description

A comment cannot exceed 1500 characters (as per SRS-001-F4).

### 5.2.3 Enforcement Point

Client-side validation (UI counter/limit) and Server-side API.

### 5.2.4 Violation Handling

Prevent further input or display an error; the server rejects the request.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-COMMENT-003

### 5.3.2 Rule Description

A user can only comment on a post from a non-connection if that user's profile is public (as per SRS-001-F4 and 5.1.5).

### 5.3.3 Enforcement Point

Server-side API authorization logic.

### 5.3.4 Violation Handling

The server rejects the request with a 403 Forbidden error. The UI should not present the option to comment in this case.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-006

#### 6.1.1.2 Dependency Reason

User must be logged in to post a comment.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-048

#### 6.1.2.2 Dependency Reason

A post must exist and be viewable in order to be commented on.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-053

#### 6.1.3.2 Dependency Reason

Users will primarily discover posts to comment on via their news feed.

## 6.2.0.0 Technical Dependencies

- Authentication service to validate user session.
- PostgreSQL database with 'Posts' and 'Comments' tables defined.
- GraphQL API Gateway with a mutation defined for adding comments.
- User Profile service to fetch commenter's details (name, profile picture).

## 6.3.0.0 Data Dependencies

- Requires existing user accounts and posts in the database for testing.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for posting a comment must have a P95 latency of less than 200ms (as per SRS-001-NFR 2.1.2).
- The UI update after posting a comment should feel instantaneous (<100ms).

## 7.2.0.0 Security

- All comment text must be sanitized on the server-side to prevent Cross-Site Scripting (XSS) attacks.
- The API endpoint must be authenticated and authorized, enforcing the business rules for comment permissions.

## 7.3.0.0 Usability

- The comment input field should be easy to find and use.
- Feedback for both successful and failed actions must be clear and immediate.

## 7.4.0.0 Accessibility

- Must adhere to WCAG 2.1 Level AA standards (as per SRS-001-NFR 2.4.3).

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Implementing robust, server-side permission checks based on connection status and profile visibility.
- Frontend state management for optimistic UI updates and graceful error handling.
- Requires coordination between the client, the API gateway, and multiple backend services (Posts, Users).
- Potential real-time updates for other viewers of the post would increase complexity significantly.

## 8.3.0.0 Technical Risks

- Race conditions if a post is deleted while a user is submitting a comment.
- Inadequate sanitization of user input could lead to security vulnerabilities.

## 8.4.0.0 Integration Points

- Backend Post Service: To persist the comment.
- Backend User Service: To retrieve author details.
- Backend Notification Service: To trigger a notification event for the post's author (related to US-076).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- Post a valid comment and verify it appears.
- Attempt to post an empty comment.
- Attempt to post a comment over the character limit.
- Test commenting on a post from a 1st-degree connection.
- Test commenting on a post from a non-connection with a public profile.
- Verify the inability to comment on a post from a non-connection with a private profile.
- Test XSS prevention by submitting a comment with HTML/script tags.

## 9.3.0.0 Test Data Needs

- User accounts with various connection statuses (connected, not connected).
- User accounts with public and private profiles.
- Existing posts created by these users.

## 9.4.0.0 Testing Tools

- Jest/Vitest for unit tests.
- Supertest for API integration tests.
- Cypress or Playwright for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% code coverage for new logic.
- E2E tests for the happy path and key error conditions are implemented and passing.
- Security review confirms proper input sanitization and authorization checks are in place.
- UI/UX has been reviewed and approved for responsiveness and accessibility.
- API performance meets the defined latency requirements under load.
- Relevant documentation (e.g., API schema) has been updated.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a core engagement feature and a prerequisite for other interaction stories like replying to comments or tagging users.
- The backend API should be developed first or in parallel with the frontend component.

## 11.4.0.0 Release Impact

- Significantly enhances the social and interactive nature of the platform.
- Enables a key feedback loop for content creators.

