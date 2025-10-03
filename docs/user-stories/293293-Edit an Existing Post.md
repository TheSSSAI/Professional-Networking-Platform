# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-051 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Edit an Existing Post |
| As A User Story | As a Content Creator, I want to edit the content o... |
| User Persona | Any authenticated user who has created at least on... |
| Business Value | Improves user satisfaction and content quality by ... |
| Functional Area | Content Sharing and Feed |
| Story Theme | Post Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: User successfully edits the text of their own post

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user viewing a post I have created on my news feed or profile page

### 3.1.5 When

I select the 'Edit' option for that post, modify the text in the editing interface, and click 'Save'

### 3.1.6 Then

The post's content is updated in the UI to show the new text, the editing interface is closed, and a visual indicator (e.g., '(edited)') appears on the post.

### 3.1.7 Validation Notes

Verify the post text is updated in the database. Verify the UI reflects the change immediately without a full page reload. Verify the 'last_edited_at' timestamp is updated in the database.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Happy Path: User cancels the edit operation

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

I am in the process of editing one of my posts

### 3.2.5 When

I click the 'Cancel' button or close the editing interface

### 3.2.6 Then

The editing interface closes, any changes I made are discarded, and the post is displayed with its original content.

### 3.2.7 Validation Notes

Verify that no API call is made to the update endpoint and the data in the database remains unchanged.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Error Condition: User attempts to edit another user's post

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I am a logged-in user viewing a post created by another user

### 3.3.5 When

I inspect the options available for that post

### 3.3.6 Then

The 'Edit' option is not visible or available to me.

### 3.3.7 Validation Notes

Also, test the API endpoint directly with the post ID and an unauthorized user's token. The API must return a 403 Forbidden status code.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Error Condition: Edited text exceeds character limit

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

I am editing one of my posts

### 3.4.5 When

I enter text that exceeds the 3000-character limit as defined in SRS-001-F4

### 3.4.6 Then

A validation message is displayed indicating the character limit has been exceeded, and the 'Save' button is disabled until the content is within the limit.

### 3.4.7 Validation Notes

Test both client-side and server-side validation. The API should return a 400 Bad Request if the server-side validation fails.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Edge Case: Editing a post preserves existing reactions and comments

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

I am editing a post that already has several likes and comments

### 3.5.5 When

I save my changes to the post's content

### 3.5.6 Then

The post content is updated, but all existing likes and comments remain associated with the post and are still visible.

### 3.5.7 Validation Notes

Verify that the `post_id` foreign key in the `reactions` and `comments` tables is not affected by the update operation on the `posts` table.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Happy Path: User edits the images on a post

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

I am editing one of my posts that contains images

### 3.6.5 When

I remove an existing image and upload a new one, then click 'Save'

### 3.6.6 Then

The post is updated to display the new set of images.

### 3.6.7 Validation Notes

Verify that the old image reference is removed from the database and the old image file is eventually deleted from S3. Verify the new image is uploaded and its reference is stored.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Error Condition: Network failure during save

### 3.7.3 Scenario Type

Error_Condition

### 3.7.4 Given

I am editing one of my posts and click 'Save'

### 3.7.5 When

The API call to update the post fails due to a network error

### 3.7.6 Then

An error message is displayed to me, the editing interface remains open, and my changes are preserved so I can try saving again.

### 3.7.7 Validation Notes

Simulate a network failure for the PATCH/PUT request to the posts API and verify the client-side state is handled gracefully.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- An 'Edit Post' option within a context menu (e.g., '...' icon) on the post card, visible only to the post author.
- An editing interface, likely a modal dialog or an inline editor, containing a text area, image management controls, and a link field.
- A 'Save' button to submit the changes.
- A 'Cancel' button or 'X' icon to discard changes and close the editor.
- A real-time character counter below the text area.
- A subtle, non-intrusive '(edited)' label on posts that have been modified.

## 4.2.0 User Interactions

- The 'Save' button should be disabled by default and only become enabled after the user has made a change to the post's content.
- Closing the modal via the escape key should trigger the 'Cancel' action.
- Hovering over the '(edited)' label could optionally show a tooltip with the date and time of the last edit.

## 4.3.0 Display Requirements

- The editing interface must be pre-populated with the post's current content.
- Validation errors (e.g., 'Text cannot exceed 3000 characters') must be displayed clearly and near the relevant input field.

## 4.4.0 Accessibility Needs

- The 'Edit' control must have an accessible name (e.g., aria-label='Edit post').
- The editing modal must trap focus, be navigable using a keyboard, and be properly announced by screen readers.
- All form elements within the editor must have associated labels.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-POST-001

### 5.1.2 Rule Description

A user can only edit their own posts.

### 5.1.3 Enforcement Point

Backend API (Authorization Middleware/Service Layer)

### 5.1.4 Violation Handling

The API request will be rejected with a 403 Forbidden status code.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-POST-002

### 5.2.2 Rule Description

Edited post content must adhere to the same validation rules as new posts (e.g., 3000 character limit for text).

### 5.2.3 Enforcement Point

Client-side form and Backend API (Validation Layer)

### 5.2.4 Violation Handling

Client-side: Display an error message and prevent submission. Server-side: Reject the request with a 400 Bad Request status code and error details.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-048

#### 6.1.1.2 Dependency Reason

The ability to create a text post must exist before it can be edited.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-049

#### 6.1.2.2 Dependency Reason

The ability to create a post with images must exist before it can be edited.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-050

#### 6.1.3.2 Dependency Reason

The ability to create a post with a link must exist before it can be edited.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

US-006

#### 6.1.4.2 Dependency Reason

User must be authenticated to determine post ownership.

## 6.2.0.0 Technical Dependencies

- PostgreSQL database with a `Posts` table that includes an `author_id` and `last_edited_at` column.
- Backend API endpoint (e.g., `PATCH /posts/{id}`) for updating post records.
- Frontend component for displaying a post.
- AWS S3 integration for handling image uploads/deletions if media editing is included.

## 6.3.0.0 Data Dependencies

- Requires existing post data created by the logged-in user for testing.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for updating a post must respond within the P95 latency target of <200ms under nominal load (as per SRS-001-NFR 2.1.2).
- The editing UI should load instantly upon clicking the 'Edit' option.

## 7.2.0.0 Security

- The backend must perform a strict authorization check to ensure the authenticated user's ID matches the `author_id` of the post being edited. This prevents unauthorized modification of content.
- All user-provided text must be sanitized on the server to prevent XSS attacks when the edited content is rendered.

## 7.3.0.0 Usability

- The editing process should be intuitive and seamless, with clear feedback on success or failure.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards (as per SRS-001-NFR 2.4.3).

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported browsers and devices as defined in the project's scope.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Implementing robust, non-bypassable server-side authorization is critical and non-trivial.
- Managing state for the editing UI on the frontend (e.g., modal state, form data, validation errors).
- If media editing is included, handling file deletions and uploads in a transactionally safe manner with the database update adds significant complexity.
- Deciding on the real-time update strategy for other users viewing the post (e.g., WebSocket push vs. stale-while-revalidate).

## 8.3.0.0 Technical Risks

- A flaw in the authorization logic could lead to a critical security vulnerability allowing users to edit others' content.
- Orphaned media files in S3 if the database update fails after a successful file upload/delete operation.

## 8.4.0.0 Integration Points

- GraphQL API (Mutation for updating a post).
- PostgreSQL Database (UPDATE operation on the `Posts` table).
- AWS S3 (for deleting old images and uploading new ones).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify a user can edit their own text post.
- Verify a user can edit their own image post (add/remove images).
- Verify a user CANNOT see the edit option on another user's post.
- Verify the API rejects an edit request from an unauthorized user.
- Verify validation errors are shown for content exceeding limits.
- Verify canceling an edit discards all changes.
- Verify existing likes/comments are preserved after an edit.

## 9.3.0.0 Test Data Needs

- At least two user accounts.
- Posts created by each user, some with and some without likes/comments.

## 9.4.0.0 Testing Tools

- Jest/Vitest for frontend and backend unit tests.
- Supertest for API integration tests.
- Cypress or Playwright for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other developer
- Unit and integration tests implemented for new logic, achieving >80% code coverage
- E2E tests for the edit workflow are created and passing
- Security requirements validated, especially the authorization logic at the API level
- User interface is responsive and reviewed for accessibility compliance
- The `last_edited_at` field is correctly populated and an '(edited)' indicator is displayed
- Documentation for the new API mutation is updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a core feature for user-generated content platforms and should be prioritized soon after the initial post creation functionality is complete.
- The scope can be split: a first version could support text-only edits (lower complexity), with media editing added in a subsequent story.

## 11.4.0.0 Release Impact

This feature is expected by users of any modern social/professional networking platform. Its absence would be a significant functional gap.

