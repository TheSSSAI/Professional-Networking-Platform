# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-060 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Initiate a Direct Message Conversation with a Conn... |
| As A User Story | As a Platform User, I want to initiate a private, ... |
| User Persona | Any registered and logged-in user of the platform ... |
| Business Value | Enables private communication, a core feature for ... |
| Functional Area | Messaging System |
| Story Theme | Direct Messaging |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

User initiates a new conversation with a connection for the first time.

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user viewing the profile of one of my first-degree connections

### 3.1.5 When

I click the 'Message' button and I have no prior message history with this user

### 3.1.6 Then

a new messaging interface is displayed, showing the connection's name and profile picture in the header

### 3.1.7 And

the message history area is empty, and the message input field is ready for me to type the first message.

### 3.1.8 Validation Notes

Verify that a new conversation record is created in the database for the two users. The UI should transition smoothly to the messaging view.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

User opens an existing conversation with a connection.

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am a logged-in user viewing the profile of one of my first-degree connections

### 3.2.5 When

I click the 'Message' button and I have an existing message history with this user

### 3.2.6 Then

the existing messaging interface for that conversation is displayed

### 3.2.7 And

the previous message history is loaded and visible (as per US-062).

### 3.2.8 Validation Notes

Verify that the system correctly fetches the existing conversation from the database and no new conversation is created. The UI should display the last few messages upon opening.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

User attempts to message a user who is not a first-degree connection.

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I am a logged-in user viewing the profile of a user who is not my first-degree connection

### 3.3.5 When

I view their profile page

### 3.3.6 Then

the 'Message' button must not be visible or must be disabled.

### 3.3.7 Validation Notes

Test this by viewing profiles of 2nd-degree connections and users with no connection. Also, perform an API-level test to ensure a conversation cannot be initiated by directly calling the endpoint with a non-connection's user ID.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

User attempts to initiate a conversation with a deactivated user.

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

I am a logged-in user and I navigate to a conversation with a connection who has since deactivated their account

### 3.4.5 When

I open the conversation view from my message list

### 3.4.6 Then

the conversation history remains viewable

### 3.4.7 And

the message input field is disabled, preventing me from sending new messages.

### 3.4.8 Validation Notes

Requires a test user account that can be deactivated. Verify that a clear visual indicator explains why messaging is disabled.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A clearly identifiable 'Message' button on a connection's profile page.
- A messaging view/modal with a header displaying the recipient's name and profile picture.
- A message history panel.
- A text input field for composing messages.

## 4.2.0 User Interactions

- Clicking the 'Message' button should navigate the user to the messaging interface or open a chat modal/widget.
- The transition should be quick and visually smooth.

## 4.3.0 Display Requirements

- The recipient's identity must be clearly and persistently displayed within the conversation view.

## 4.4.0 Accessibility Needs

- The 'Message' button must be keyboard-focusable and have a clear accessible name (e.g., 'Message [User's Name]').
- The messaging interface must be navigable using a keyboard.

# 5.0.0 Business Rules

- {'rule_id': 'BR-MSG-001', 'rule_description': 'Direct messaging is strictly limited to first-degree connections.', 'enforcement_point': 'Server-side API endpoint for initiating or fetching a conversation.', 'violation_handling': 'The API must return an authorization error (e.g., HTTP 403 Forbidden) if a user attempts to message a non-connection.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-006

#### 6.1.1.2 Dependency Reason

User must be able to log in to access any feature.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-021

#### 6.1.2.2 Dependency Reason

User profiles must exist to provide a location for the 'Message' button.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-042

#### 6.1.3.2 Dependency Reason

The connection system must be functional, as messaging is only allowed between connections.

## 6.2.0.0 Technical Dependencies

- Backend messaging service with API endpoints for creating/retrieving conversations.
- WebSocket server infrastructure for real-time communication (as per SRS 2.6.7).
- Database schema for `Conversations` and `Messages` must be defined and migrated.
- Client-side state management solution for handling the messaging UI.

## 6.3.0.0 Data Dependencies

- Requires access to user profile data (name, picture) and connection relationship data.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to initiate/fetch a conversation should have a P95 latency of less than 200ms.
- The messaging UI should render in under 500ms after clicking the 'Message' button.

## 7.2.0.0 Security

- Server-side authorization must strictly enforce that only first-degree connections can initiate a conversation.
- All communication between client and server must be over HTTPS/WSS.

## 7.3.0.0 Usability

- The process of starting a conversation should be intuitive and require minimal clicks.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires both frontend UI work and backend service logic.
- Backend logic must efficiently check for existing conversations between two users, which requires a well-designed database query and indexing.
- This story lays the foundation for the real-time messaging system, so the initial WebSocket connection logic on the client will be part of this implementation.

## 8.3.0.0 Technical Risks

- Potential for race conditions if two users try to initiate a conversation with each other simultaneously. The backend logic must handle this gracefully to avoid creating duplicate conversation records.
- Initial setup of WebSocket connection management on the client can be complex.

## 8.4.0.0 Integration Points

- User Profile Service (to get connection status and user details).
- Authentication Service (to validate user session).
- Messaging Service (core logic).
- Real-time Notification Service (via WebSockets).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify a user can start a new chat from a connection's profile.
- Verify a user can open an existing chat from a connection's profile.
- Verify the 'Message' button is absent/disabled for non-connections.
- Verify API endpoint rejects requests to message non-connections.
- Verify behavior when interacting with a deactivated user's conversation.

## 9.3.0.0 Test Data Needs

- Test accounts with established first-degree connections.
- Test accounts with no connections.
- Test accounts with existing message history.
- A test account that can be deactivated.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Cypress or Playwright for E2E tests.
- Postman or similar for API-level security testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% code coverage for the new logic.
- E2E tests covering the primary scenarios are passing.
- Security check confirms that non-connections cannot initiate messages via the API.
- Performance of the conversation initiation API meets the defined NFRs.
- UI is responsive and adheres to accessibility standards.
- Relevant technical documentation (e.g., API schema) has been updated.
- The feature has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational story for the entire messaging feature set.
- It is a blocker for subsequent messaging stories like US-061 (Send Message) and US-062 (View History).
- Requires coordinated effort between frontend and backend developers.

## 11.4.0.0 Release Impact

This story enables a major new feature category (Direct Messaging). Its completion is critical for the initial product launch or a major feature release.

