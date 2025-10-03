# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-059 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Report a Post as Inappropriate |
| As A User Story | As a platform user, I want to report a post that I... |
| User Persona | Any authenticated platform user viewing content. |
| Business Value | Empowers the community to self-moderate, enhances ... |
| Functional Area | Content Moderation |
| Story Theme | Trust and Safety |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successfully report a post for the first time

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user viewing a post in my feed that I have not previously reported

### 3.1.5 When

I click the options menu on the post and select 'Report Post', select a reason from the provided list, and click 'Submit'

### 3.1.6 Then

A confirmation message is displayed, such as 'Report submitted. Thank you for helping keep our community safe.'

### 3.1.7 And

A new record is created in the admin content moderation queue, linking my user ID, the post ID, the selected reason, and a 'pending' status.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Cancel the reporting process

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

I am a logged-in user and have opened the 'Report Post' modal

### 3.2.5 When

I click the 'Cancel' button or close the modal without submitting

### 3.2.6 Then

The modal closes, and no report is submitted.

### 3.2.7 And

The post remains visible in my feed.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Attempt to report a post that has already been reported by the same user

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

I am a logged-in user viewing a post that I have previously reported

### 3.3.5 When

I click the options menu on that post

### 3.3.6 Then

The 'Report Post' option is either disabled or replaced with text indicating it has already been reported (e.g., 'Post Reported').

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Attempt to report one's own post

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

I am a logged-in user viewing a post that I authored

### 3.4.5 When

I click the options menu on my post

### 3.4.6 Then

The 'Report Post' option is not available in the menu.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Network error during report submission

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

I am a logged-in user and have filled out the report form in the modal

### 3.5.5 When

I click 'Submit' and the API call fails due to a network error

### 3.5.6 Then

An error message is displayed within the modal, such as 'Could not submit report. Please check your connection and try again.'

### 3.5.7 And

The modal remains open, with my selections preserved, allowing me to retry the submission.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Post is deleted while user is reporting it

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

I am a logged-in user with the 'Report Post' modal open for a specific post

### 3.6.5 When

The author of the post deletes it before I can submit my report

### 3.6.6 Then

The system detects the post is no longer available, closes the modal, and displays a transient notification, such as 'This content is no longer available.'

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Report' option within a standard '...' (kebab) menu on each post card.
- A modal dialog for the reporting workflow.
- A list of predefined reporting reasons (e.g., 'Spam', 'Harassment', 'Hate Speech', 'Misinformation') presented as radio buttons or a dropdown.
- 'Submit' and 'Cancel' buttons within the modal.
- A success confirmation toast/notification.
- An error message display area within the modal.

## 4.2.0 User Interactions

- Clicking 'Report' opens the modal.
- The user must select one reason before the 'Submit' button is enabled.
- Submitting the report triggers an asynchronous API call.
- After a successful report, the post is visually removed from the user's current view without a full page reload.

## 4.3.0 Display Requirements

- The list of reporting reasons must be sourced from a configurable list in the backend to allow for future changes without a frontend deployment.
- Confirmation and error messages must be clear and user-friendly.

## 4.4.0 Accessibility Needs

- The reporting modal must be fully keyboard-navigable.
- All interactive elements (buttons, radio inputs) must have accessible labels.
- The modal must trap focus and be properly announced by screen readers (e.g., using `aria-modal='true'`).

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-001

### 5.1.2 Rule Description

A user can only report a specific piece of content once.

### 5.1.3 Enforcement Point

Backend API validation before creating a report record.

### 5.1.4 Violation Handling

The API will return an error response (e.g., 409 Conflict) if a duplicate report is attempted. The UI will handle this by displaying the 'Post Reported' state.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-002

### 5.2.2 Rule Description

A user cannot report their own content.

### 5.2.3 Enforcement Point

The UI should not present the option. The backend API must also validate the reporter is not the author as a security measure.

### 5.2.4 Violation Handling

API returns an error (e.g., 403 Forbidden). UI should prevent this from ever happening.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-048

#### 6.1.1.2 Dependency Reason

A post entity and creation mechanism must exist to have content to report.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-053

#### 6.1.2.2 Dependency Reason

A news feed is the primary interface where users will discover posts to report.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-084

#### 6.1.3.2 Dependency Reason

This story generates the reports that US-084 consumes. The backend table/queue for reports must be designed to serve both stories.

## 6.2.0.0 Technical Dependencies

- User Authentication Service (for identifying the reporter)
- Post Service (for validating the post exists)
- A new database table (e.g., `content_reports`) to store report details.

## 6.3.0.0 Data Dependencies

- A predefined, configurable list of report categories/reasons.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- Submitting a report should have a P95 latency of < 300ms.
- The UI action of hiding the post after reporting must feel instantaneous to the user.

## 7.2.0.0 Security

- All report submission requests must be authenticated and authorized.
- The backend must validate that the `post_id` and `user_id` are legitimate.
- Input for report reasons must be validated against the predefined list to prevent injection or invalid data.

## 7.3.0.0 Usability

- The reporting process should require a minimal number of clicks (ideally: open menu, click report, select reason, submit).
- The language used for reasons and confirmations should be simple and non-judgmental.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported browsers (latest versions of Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordinated work across frontend (modal UI, state management), backend (new API endpoint, validation logic), and database (new table schema).
- Frontend state management to hide the post from various views (feed, profile page) can be complex.
- Designing the `content_reports` table to be generic enough for future reportable items (e.g., comments, profiles) is a key architectural decision.

## 8.3.0.0 Technical Risks

- Potential for race conditions if a post is deleted or edited while being reported.
- Ensuring the 'hide' functionality is persistent for the user across sessions might require additional backend logic or local storage usage.

## 8.4.0.0 Integration Points

- Frontend client to the new Backend API endpoint for submitting reports.
- Backend API to the PostgreSQL database to write to the `content_reports` table.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify a report can be successfully submitted and appears in the database.
- Verify a user cannot report the same post twice.
- Verify a user cannot report their own post.
- Verify the UI correctly hides the post after a successful report.
- Verify all error states (network failure, deleted post) are handled gracefully.
- E2E test: User A posts, User B logs in, reports the post, and verifies it is hidden. Admin logs in and verifies the report is in the queue (requires US-084).

## 9.3.0.0 Test Data Needs

- At least two test user accounts.
- A set of posts created by one user to be reported by the other.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- NestJS testing utilities for backend unit/integration tests.
- Cypress or Playwright for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit tests are written for new components and services, achieving >80% coverage.
- Integration tests for the new API endpoint are implemented and passing.
- E2E tests covering the happy path and key error conditions are passing.
- The feature meets all specified accessibility (WCAG 2.1 AA) and security requirements.
- API documentation for the new endpoint is created/updated.
- The new database schema changes are documented and scripted via migrations.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a foundational element for the platform's Trust and Safety features.
- Should be prioritized and developed alongside or immediately before the admin-facing moderation stories (US-084, US-085, etc.) to complete the workflow.

## 11.4.0.0 Release Impact

This is a critical feature for a public launch to ensure the platform has basic community safety tools from day one.

