# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-065 |
| Elaboration Date | 2025-01-18 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Be Prevented from Messaging a Non-Connection |
| As A User Story | As a platform user, I want the system to only allo... |
| User Persona | Any registered platform user seeking to maintain c... |
| Business Value | Enhances user trust, safety, and privacy by preven... |
| Functional Area | Messaging System |
| Story Theme | User Privacy and Communication Controls |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

UI prevents messaging a non-connection from their profile

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user

### 3.1.5 When

I view the profile of another user who is not my first-degree connection

### 3.1.6 Then

The option to initiate a direct message (e.g., a 'Message' button) must not be visible or must be clearly disabled.

### 3.1.7 Validation Notes

Verify via E2E test. Navigate to a non-connection's profile and assert the absence or disabled state of the message button. The 'Connect' button should be visible instead.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Backend API rejects attempts to message a non-connection

### 3.2.3 Scenario Type

Security_Condition

### 3.2.4 Given

I am a logged-in user with a valid authentication token

### 3.2.5 When

I make a direct API call to create a conversation or send a message to a user who is not my first-degree connection

### 3.2.6 Then

The server must reject the request with a '403 Forbidden' HTTP status code.

### 3.2.7 Validation Notes

Verify via integration test. Attempt to POST to the messages endpoint with valid auth but for a non-connected user pair. Assert the 403 response.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Messaging is disabled in an existing conversation after a connection is removed

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

I had a message conversation with User B when we were connected

### 3.3.5 And

A clear message must be displayed, such as 'You are no longer connected. Connect with this user to send a message.'

### 3.3.6 When

I open the existing conversation thread with User B

### 3.3.7 Then

The message input field must be disabled.

### 3.3.8 Validation Notes

Manual and E2E testing. Create a connection, start a conversation, remove the connection, then revisit the conversation URL and assert the input is disabled and the informational message is present.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

System fails safely if connection status check fails

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

I am viewing the profile of a non-connection, User B

### 3.4.5 When

The backend service responsible for checking connection status is unavailable or returns an error

### 3.4.6 Then

The system must default to the most secure state, meaning the 'Message' button remains disabled or hidden.

### 3.4.7 Validation Notes

Integration test by mocking the connection service to throw an error and verifying the API gateway or messaging service handles it by denying the action.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Disabled 'Message' button on non-connection profiles.
- Informational text block within a message thread for a now-removed connection.
- Disabled message composition input field and send button in a thread with a removed connection.

## 4.2.0 User Interactions

- Hovering over a disabled 'Message' button should ideally show a tooltip explaining why it's disabled (e.g., 'Connect to message').
- The user is prevented from typing or sending new messages in a conversation with a removed connection.

## 4.3.0 Display Requirements

- The UI must never present an active 'Message' button for a user who is not a first-degree connection.

## 4.4.0 Accessibility Needs

- Any disabled button must have the `aria-disabled='true'` attribute.
- The reason for a button being disabled should be available to screen readers.

# 5.0.0 Business Rules

- {'rule_id': 'BR-MSG-001', 'rule_description': 'Direct messaging is only permitted between users who have a confirmed first-degree connection status.', 'enforcement_point': 'This rule is enforced at the API gateway/backend messaging service before any message is processed or stored.', 'violation_handling': "Any attempt to violate this rule results in a '403 Forbidden' API response, and the action is logged as a potential security event."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-042

#### 6.1.1.2 Dependency Reason

The system must have a way to establish a connection before it can check for one.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-047

#### 6.1.2.2 Dependency Reason

The system must support removing connections to handle the edge case where messaging becomes disabled.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-060

#### 6.1.3.2 Dependency Reason

The basic messaging functionality must exist for this preventative rule to be applied to it.

## 6.2.0.0 Technical Dependencies

- Connection Management Service: Must expose an efficient endpoint to check the connection status between two user IDs.
- Authentication Service: To validate the user's identity before checking permissions.
- API Gateway: To potentially enforce this rule at the edge.

## 6.3.0.0 Data Dependencies

- Access to the 'Connections' data table, which must be indexed for fast lookups between two user IDs.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The backend check for connection status must complete with a P99 latency of under 50ms to avoid delaying UI rendering or API responses.

## 7.2.0.0 Security

- This is a critical authorization control. The check MUST be performed on the server-side for every message-related action. Client-side checks are for UI convenience only and are not a security measure.

## 7.3.0.0 Usability

- The user interface should make it clear why messaging is not possible, guiding the user towards the 'Connect' action instead of causing confusion.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards, particularly concerning the state and description of disabled interactive elements.

## 7.5.0.0 Compatibility

- The behavior must be consistent across all supported browsers and devices (desktop, tablet, mobile).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires robust server-side authorization logic (e.g., middleware) in the messaging service.
- Database query for checking connection status must be highly optimized.
- Handling the real-time UI update when a connection is removed while a conversation is open adds complexity (requires WebSocket event).

## 8.3.0.0 Technical Risks

- A poorly optimized connection check could become a performance bottleneck as the number of users and connections grows.
- Failure to correctly implement the server-side check creates a significant privacy and security vulnerability.

## 8.4.0.0 Integration Points

- Messaging Service: Must integrate with the Connection Management service/database.
- User Profile Service/UI: Must fetch connection status to conditionally render the 'Message' or 'Connect' button.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify a user cannot message a non-connection from their profile page.
- Verify a user cannot message a non-connection via a direct API call.
- Verify a user CAN message a connection.
- Verify that after removing a connection, the existing message thread becomes read-only.
- Verify that if a connection request is pending, messaging is still disabled.

## 9.3.0.0 Test Data Needs

- Test accounts that are first-degree connections.
- Test accounts that are not connected.
- Test accounts that have a pending connection request.
- Test accounts that were previously connected but are now disconnected.

## 9.4.0.0 Testing Tools

- Jest for backend unit tests.
- Postman or Supertest for API integration tests.
- Cypress or Playwright for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least two peers
- Unit and integration tests implemented for the authorization logic, achieving >90% coverage for the new code
- E2E tests for all key scenarios are implemented and passing
- Backend authorization logic is confirmed to be non-bypassable
- UI correctly reflects connection status on profiles and in message threads
- Performance of the connection check is benchmarked and meets the <50ms P99 requirement
- Documentation for the messaging API is updated to reflect this authorization rule
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a critical guardrail for the messaging feature and should be prioritized in the same sprint as, or immediately following, the initial message sending story (US-060).
- Requires close collaboration between frontend and backend developers to ensure the UI state correctly reflects the backend rules.

## 11.4.0.0 Release Impact

This feature is mandatory for any release that includes direct messaging to ensure user safety and privacy.

