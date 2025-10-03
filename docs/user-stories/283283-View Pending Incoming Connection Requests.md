# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-041 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | View Pending Incoming Connection Requests |
| As A User Story | As a platform user, I want to view a clear and org... |
| User Persona | Any registered and active user of the platform see... |
| Business Value | Enables the core networking loop by allowing users... |
| Functional Area | Connection Management |
| Story Theme | Network Building |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-041-01

### 3.1.2 Scenario

User with pending requests views the invitations list

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user and have 3 pending connection requests from other users

### 3.1.5 When

I navigate to the 'My Network' or 'Invitations' page

### 3.1.6 Then

I see a list containing exactly 3 pending requests, ordered with the most recent request at the top.

### 3.1.7 Validation Notes

Verify the API returns a list of 3 requests for the authenticated user and the UI renders them in reverse chronological order.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-041-02

### 3.2.2 Scenario

Information displayed for each pending request

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am viewing my list of pending connection requests

### 3.2.5 When

I look at any request in the list

### 3.2.6 Then

I must see the sender's profile picture, full name, and professional headline.

### 3.2.7 Validation Notes

Check that the UI component for a single request correctly displays the `profilePictureUrl`, `name`, and `headline` fields from the API response.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-041-03

### 3.3.2 Scenario

Request includes a personalized message

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

I am viewing my list of pending requests

### 3.3.5 And

one of the requests includes a personalized message

### 3.3.6 When

I view that specific request

### 3.3.7 Then

the personalized message is clearly displayed as part of the request details.

### 3.3.8 Validation Notes

Confirm that if the API response for a request contains a non-null `message` field, it is rendered in the UI.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-041-04

### 3.4.2 Scenario

User has no pending requests

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

I am a logged-in user and I have no pending connection requests

### 3.4.5 When

I navigate to the 'My Network' or 'Invitations' page

### 3.4.6 Then

I see an informative message, such as 'You have no pending invitations.'

### 3.4.7 And

I do not see an empty list container or an error message.

### 3.4.8 Validation Notes

Verify the UI handles an empty array response from the API by displaying the specified empty-state component.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-041-05

### 3.5.2 Scenario

Sender's profile is accessible from the request

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

I am viewing a pending connection request from 'User A'

### 3.5.5 When

I click on 'User A's' name or profile picture

### 3.5.6 Then

I am navigated to 'User A's' profile page, respecting their profile visibility settings.

### 3.5.7 Validation Notes

Test that the name and picture are wrapped in a link pointing to the sender's public profile URL (e.g., '/in/username').

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-041-06

### 3.6.2 Scenario

Sender deactivates their account after sending a request

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

I have a pending connection request from 'User B'

### 3.6.5 And

'User B' has since deactivated their account

### 3.6.6 When

I view my list of pending requests

### 3.6.7 Then

the request from 'User B' is no longer visible in the list.

### 3.6.8 Validation Notes

The backend service should filter out requests from users with a 'deactivated' status before returning the list to the client.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-041-07

### 3.7.2 Scenario

List pagination for a large number of requests

### 3.7.3 Scenario Type

Edge_Case

### 3.7.4 Given

I am a logged-in user with more than 20 pending connection requests

### 3.7.5 When

I navigate to the 'Invitations' page

### 3.7.6 Then

I see the first 20 requests displayed.

### 3.7.7 And

I see a 'Load More' button or infinite scroll mechanism to view the next set of requests.

### 3.7.8 Validation Notes

Verify the API supports pagination (e.g., using limit and offset parameters) and the frontend correctly implements the loading mechanism.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated page or section for 'Invitations'.
- A list/grid to display request cards.
- For each request card: Profile Picture, Full Name, Headline, optional Message, 'Accept' button, 'Decline' button.
- An empty-state component with an icon and text for when there are no pending requests.
- Pagination controls ('Load More' button or scroll listener).

## 4.2.0 User Interactions

- Clicking on a sender's name or picture navigates to their profile.
- Scrolling or clicking 'Load More' fetches and appends the next page of requests.
- The 'Accept' and 'Decline' buttons should be clearly interactive (e.g., hover states), though their functionality is handled in US-042 and US-043.

## 4.3.0 Display Requirements

- Requests must be displayed in reverse chronological order (newest first).
- The count of pending requests should be displayed in a badge on the 'My Network' navigation item (dependency on US-079).

## 4.4.0 Accessibility Needs

- The list of requests must be navigable using a keyboard.
- All interactive elements (links, buttons) must have accessible names (e.g., 'aria-label="Accept connection request from John Doe"').
- The page must adhere to WCAG 2.1 Level AA standards as per SRS-001-NFR 2.4.3.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-041-01

### 5.1.2 Rule Description

Only requests with a 'pending' status shall be displayed in the incoming requests list.

### 5.1.3 Enforcement Point

Backend API query

### 5.1.4 Violation Handling

Requests with other statuses (accepted, declined, withdrawn) are filtered out and never sent to the client.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-041-02

### 5.2.2 Rule Description

Requests from users who have deactivated or deleted their accounts must not be displayed.

### 5.2.3 Enforcement Point

Backend API query

### 5.2.4 Violation Handling

The query should join with the user table and filter out requests where the sender's account status is not 'active'.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-039

#### 6.1.1.2 Dependency Reason

A user must be able to send a connection request before another user can view it.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-021

#### 6.1.2.2 Dependency Reason

The sender's profile (name, picture, headline) must exist to be displayed in the request.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-040

#### 6.1.3.2 Dependency Reason

The ability to include a message with a request must exist to display it.

## 6.2.0.0 Technical Dependencies

- A backend GraphQL query to fetch pending requests for the authenticated user.
- Database schema for a 'connections' table with fields for sender_id, receiver_id, status, message, and timestamps.
- Frontend components for the invitations page, request list, and individual request items.

## 6.3.0.0 Data Dependencies

- Requires access to user profile data (name, headline, picture) for the senders of the requests.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for fetching requests must have a 95th percentile latency of less than 200ms under nominal load (SRS-001-NFR 2.1.2).
- The invitations page must achieve a Largest Contentful Paint (LCP) of under 2.5 seconds (SRS-001-NFR 2.1.1).

## 7.2.0.0 Security

- The API endpoint must be secured, ensuring a user can only view their own pending requests and not anyone else's.

## 7.3.0.0 Usability

- The layout should be intuitive, making it easy for users to quickly scan requests and take action.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards (SRS-001-NFR 2.4.3).

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Standard CRUD operation (Read).
- Requires a database query with a join.
- Frontend work involves creating a new view and components to render the fetched data.
- Pagination logic adds minor complexity.

## 8.3.0.0 Technical Risks

- Performance degradation if the database query is not properly indexed, especially for users with a very large number of pending requests.

## 8.4.0.0 Integration Points

- Integrates with the User Profile service/database to fetch sender details.
- The UI will contain action buttons that trigger the functionality of US-042 (Accept) and US-043 (Decline).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance

## 9.2.0.0 Test Scenarios

- Verify a user with no requests sees the empty state.
- Verify a user with one request sees it correctly.
- Verify a user with multiple requests sees them in the correct order.
- Verify a request with a message displays the message.
- Verify pagination works correctly for a user with >20 requests.
- Verify clicking a sender's profile navigates correctly.
- Verify a request from a deactivated user does not appear.

## 9.3.0.0 Test Data Needs

- Test accounts with 0, 1, and 25+ pending requests.
- Test requests that include personalized messages.
- A test account that can be deactivated to test the edge case.

## 9.4.0.0 Testing Tools

- Jest/Vitest for frontend/backend unit tests.
- Cypress or Playwright for E2E testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other developer
- Unit and integration tests implemented with >80% code coverage
- E2E tests for the primary user flow are passing
- User interface reviewed and approved by UX/Product team
- API performance meets the <200ms P95 latency requirement
- Security check confirms a user cannot access another user's invitations
- Accessibility audit (automated and manual) passed
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is tightly coupled with US-042 (Accept Request) and US-043 (Decline Request). It is highly recommended to implement them in the same sprint to deliver a complete user workflow.

## 11.4.0.0 Release Impact

This is a critical-path feature for the core networking functionality of the platform. The platform cannot launch without it.

