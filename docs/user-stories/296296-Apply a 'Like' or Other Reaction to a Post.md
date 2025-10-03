# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-054 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Apply a 'Like' or Other Reaction to a Post |
| As A User Story | As a platform user viewing a post, I want to apply... |
| User Persona | Any authenticated platform user viewing content in... |
| Business Value | Increases user engagement and interaction on the p... |
| Functional Area | Content Sharing and Feed |
| Story Theme | Post Interactions |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

User applies a 'Like' reaction to a post for the first time

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user viewing a post that I have not yet reacted to

### 3.1.5 When

I click the 'Like' button on the post

### 3.1.6 Then

The 'Like' button's visual state changes to 'active' or 'selected'.

### 3.1.7 And

A notification event is triggered for the post's author (as per US-075).

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

User changes their existing reaction to a different one

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am a logged-in user viewing a post that I have already reacted to with 'Like'

### 3.2.5 When

I hover over the 'Like' button and select the 'Celebrate' reaction

### 3.2.6 Then

My reaction is updated from 'Like' to 'Celebrate' in the database.

### 3.2.7 And

The total reaction count on the post remains unchanged.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

User views the list of users who have reacted to a post

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given

I am a logged-in user viewing a post that has one or more reactions

### 3.3.5 When

I click on the reaction count indicator

### 3.3.6 Then

A modal or popover appears.

### 3.3.7 And

The modal displays a list of all users who have reacted, along with the specific reaction icon for each user.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

User attempts to react to a post that was just deleted

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

I am viewing a post in my feed

### 3.4.5 And

The reaction action fails and no change is persisted.

### 3.4.6 When

I attempt to apply a reaction

### 3.4.7 Then

The system displays a non-blocking, user-friendly error message, such as 'This content is no longer available'.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

User attempts to react during a network interruption

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

I am a logged-in user viewing a post

### 3.5.5 When

I click to apply a reaction, but my device has lost its network connection

### 3.5.6 Then

The UI provides immediate feedback that the action could not be completed (e.g., a toast notification).

### 3.5.7 And

The reaction count does not change.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Like' button (or similar primary reaction icon) on each post card.
- A set of secondary reaction icons (e.g., Celebrate, Support, Funny, Insightful) that appear on hover/long-press.
- A numerical counter displaying the total number of reactions on the post.
- A modal/popover to display a detailed list of users and their reactions.

## 4.2.0 User Interactions

- A single click on the primary reaction button applies that reaction.
- Hovering over (desktop) or long-pressing (mobile) the primary reaction button reveals the other reaction options.
- Clicking on the reaction count opens the detailed list of reactors.
- The user's own active reaction should be visually distinct.

## 4.3.0 Display Requirements

- The total reaction count must update in near real-time as new reactions are added.
- The list of reactors in the modal should be scrollable if it exceeds the modal's height.

## 4.4.0 Accessibility Needs

- All reaction buttons must be keyboard accessible and focusable.
- Buttons must have descriptive ARIA labels, e.g., 'Like post by [Author Name]'.
- The popover for selecting different reactions must be navigable via keyboard.
- Color changes for active states must have sufficient contrast to meet WCAG 2.1 AA standards.

# 5.0.0 Business Rules

- {'rule_id': 'BR-001', 'rule_description': 'A user can only have one reaction per post. Applying a new reaction overwrites any previous reaction by that user on that post.', 'enforcement_point': 'Backend API service when processing a reaction request.', 'violation_handling': "The system will perform an 'upsert' operation (update if exists, insert if not) on the reaction record for the given user and post."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-053

#### 6.1.1.2 Dependency Reason

A user must be able to see a post in a feed to be able to react to it.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-048

#### 6.1.2.2 Dependency Reason

Posts must exist in the system to be reacted to.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-006

#### 6.1.3.2 Dependency Reason

User must be authenticated to perform actions like reacting.

## 6.2.0.0 Technical Dependencies

- A backend API endpoint for creating/updating reactions (`POST /posts/{id}/reaction`).
- A database table (`reactions`) to store user reactions on posts, indexed on `post_id` and `user_id`.
- Frontend state management library (e.g., Redux, Zustand) to handle optimistic UI updates.
- Integration with the WebSocket service (per SRS-001-F7) to trigger real-time notifications.

## 6.3.0.0 Data Dependencies

- Requires access to Post IDs and authenticated User IDs.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for applying a reaction must have a P95 latency of less than 200ms (SRS-001-NFR 2.1.2).
- The UI should update optimistically (<100ms) to provide immediate user feedback.

## 7.2.0.0 Security

- The reaction API endpoint must be protected and require user authentication.
- The system must validate that the user ID in the request matches the authenticated user's session token.
- Rate limiting should be applied to the endpoint to prevent abuse/spam.

## 7.3.0.0 Usability

- The interaction for selecting different reactions (hover/long-press) must be intuitive and discoverable.

## 7.4.0.0 Accessibility

- Must adhere to WCAG 2.1 Level AA standards (SRS-001-NFR 2.4.3).

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Implementing a smooth and accessible hover/long-press UI for selecting reactions.
- Handling optimistic UI updates and state rollback on API failure.
- Ensuring the database query for reaction counts is performant at scale. Consider denormalizing counts onto the posts table.
- Integrating with the real-time notification service.

## 8.3.0.0 Technical Risks

- Poor database performance for aggregating reaction counts on high-traffic posts.
- Complexity in managing UI state across many posts in a virtualized list (the feed).

## 8.4.0.0 Integration Points

- Post Data Service: To fetch post details and update reaction counts.
- User Authentication Service: To verify user identity.
- Notification Service: To send real-time notifications to the post author.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify a user can add, change, and view reactions.
- Verify reaction counts update correctly for all users viewing the post.
- Test the optimistic UI update and its rollback on network failure.
- Test keyboard navigation for selecting different reactions.
- Load test the reaction API endpoint.

## 9.3.0.0 Test Data Needs

- Multiple test user accounts.
- Posts with zero, few, and many existing reactions.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Cypress or Playwright for E2E tests.
- k6 or JMeter for performance testing.
- Axe for accessibility audits.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and passing with >80% code coverage.
- E2E tests covering the happy path and key alternative flows are passing.
- UI has been reviewed and approved by the design/product owner.
- Performance latency targets for the API are met under simulated load.
- Accessibility audit (WCAG 2.1 AA) has been performed and any issues resolved.
- Relevant technical documentation (e.g., API spec) has been updated.
- The feature has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational engagement feature. It is highly recommended to implement this story and US-055 (Remove a Reaction) together in the same sprint, as the logic is tightly coupled.
- Requires coordination between frontend and backend developers for API contract and real-time event handling.

## 11.4.0.0 Release Impact

This feature is critical for the initial public launch as it is a core mechanism for user interaction and platform engagement.

