# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-061 |
| Elaboration Date | 2025-01-17 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Send a Text Message in a Conversation |
| As A User Story | As a platform user, I want to type and send a text... |
| User Persona | Any registered and logged-in user who is viewing a... |
| Business Value | Enables the core functionality of private, real-ti... |
| Functional Area | Messaging System |
| Story Theme | Direct Messaging |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successfully send a valid text message

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am logged in and viewing a direct message conversation with a connection

### 3.1.5 When

I type a valid text message into the message input field and either click the 'Send' button or press the 'Enter' key

### 3.1.6 Then

My message is optimistically added to my conversation view with a 'sending' status, and the input field is cleared.

### 3.1.7 Validation Notes

Verify the message appears instantly in the sender's UI. The message should be right-aligned or styled to indicate it's from the current user.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Message is successfully delivered to the server and recipient

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I have just sent a message

### 3.2.5 When

the server confirms receipt of the message and delivers it to the recipient's client

### 3.2.6 Then

the message status in my UI updates from 'sending' to 'delivered'.

### 3.2.7 Validation Notes

This requires WebSocket communication. Test by having two clients open (sender and receiver) and verifying the message appears on the receiver's screen in near real-time.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Attempt to send an empty or whitespace-only message

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I am viewing a direct message conversation

### 3.3.5 When

the message input field is empty or contains only whitespace characters (spaces, tabs, newlines)

### 3.3.6 Then

the 'Send' button is in a disabled state and pressing the 'Enter' key does nothing.

### 3.3.7 Validation Notes

Check the disabled attribute on the send button. The button should become enabled as soon as a non-whitespace character is typed.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Create a new line in a message

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

I am typing a message in the input field

### 3.4.5 When

I press 'Shift+Enter'

### 3.4.6 Then

a new line is created within the input field, and the message is not sent.

### 3.4.7 Validation Notes

Verify that the textarea grows to accommodate the new line and the cursor moves down.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Message fails to send due to network error

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

I have typed a valid message and hit 'Send'

### 3.5.5 When

my client is offline or cannot reach the server

### 3.5.6 Then

the message in my conversation view shows a 'Failed to send' status.

### 3.5.7 Validation Notes

Use browser developer tools to simulate an offline network condition. The UI should provide an option to retry sending the failed message.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Send a message containing special characters or script tags

### 3.6.3 Scenario Type

Security

### 3.6.4 Given

I am typing a message

### 3.6.5 When

I enter content with special characters (e.g., emojis, accented letters) and script tags (e.g., '<script>alert(1)</script>') and send it

### 3.6.6 Then

the message is persisted and displayed correctly to both sender and receiver, with all special characters rendered properly and any script tags sanitized to appear as plain text.

### 3.6.7 Validation Notes

Verify that no alert box appears and the literal string '<script>alert(1)</script>' is visible in the chat history.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A multi-line text input field (textarea) for composing messages.
- A 'Send' button, visually indicating its state (enabled/disabled).
- A visual indicator for message status (e.g., a small icon or text for 'sending', 'delivered', 'failed').

## 4.2.0 User Interactions

- Typing in the textarea enables the 'Send' button.
- Clicking the 'Send' button or pressing 'Enter' (without Shift) sends the message.
- Pressing 'Shift+Enter' adds a newline to the message.
- Sent messages appear aligned differently (e.g., to the right) than received messages.

## 4.3.0 Display Requirements

- The sent message text must be displayed exactly as entered (after sanitization).
- A timestamp should be associated with the sent message.

## 4.4.0 Accessibility Needs

- The message input field must have an associated label for screen readers.
- The 'Send' button must be keyboard-focusable and operable.
- Message status indicators should have accessible text equivalents (e.g., via aria-label).

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-MSG-001

### 5.1.2 Rule Description

Messaging is restricted to users who are first-degree connections.

### 5.1.3 Enforcement Point

Backend service, before processing and sending the message.

### 5.1.4 Violation Handling

The WebSocket event to send the message is rejected with an error, and the client UI displays a failure message.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-MSG-002

### 5.2.2 Rule Description

A message cannot be empty or contain only whitespace.

### 5.2.3 Enforcement Point

Client-side validation (disabling send button) and server-side validation (rejecting the message).

### 5.2.4 Violation Handling

Client-side: UI prevents sending. Server-side: Request is rejected with an error code.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-060

#### 6.1.1.2 Dependency Reason

This story implements the action of sending a message, which can only occur within an existing conversation view established by US-060.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-062

#### 6.1.2.2 Dependency Reason

Sent messages must be persisted and added to the conversation history, which is the core functionality of US-062.

## 6.2.0.0 Technical Dependencies

- A functional real-time communication layer (WebSockets/Socket.IO as per SRS-2.6.7).
- A backend messaging microservice capable of receiving, validating, persisting, and broadcasting messages.
- A PostgreSQL database with a defined schema for storing messages.

## 6.3.0.0 Data Dependencies

- Requires the existence of two connected user accounts to test the end-to-end flow.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- SRS-001-F5.2: Messages shall be delivered in near real-time. Target latency from sender's 'send' action to receiver's UI render should be < 500ms under nominal load and network conditions.

## 7.2.0.0 Security

- SRS-2.3.1: All message content must be sanitized on the server-side to prevent Cross-Site Scripting (XSS) attacks.
- All communication must occur over a secure WebSocket connection (WSS).

## 7.3.0.0 Usability

- The interaction of typing and sending a message should be intuitive and follow established patterns of modern messaging applications.

## 7.4.0.0 Accessibility

- The messaging interface must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires both frontend and backend implementation for real-time communication.
- Frontend state management for optimistic UI updates and message statuses.
- Backend logic for message persistence and fan-out to the correct recipient client.
- Handling of WebSocket connection states (connect, disconnect, reconnect).

## 8.3.0.0 Technical Risks

- Latency in message delivery under high load.
- Ensuring message delivery guarantees (e.g., what happens if the recipient is offline when the message is sent).
- Scalability of the WebSocket server infrastructure.

## 8.4.0.0 Integration Points

- Frontend client to the API Gateway/WebSocket endpoint.
- WebSocket service to the Messaging microservice.
- Messaging microservice to the primary PostgreSQL database.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Two users successfully exchange messages in real-time.
- A user sends a message while the recipient is offline, and the recipient receives it upon coming back online.
- Attempt to send a message with malicious script content.
- Simulate network failure during message sending and verify the UI response.
- Verify that a user cannot send a message to another user after they have been disconnected.

## 9.3.0.0 Test Data Needs

- At least two user accounts that are first-degree connections.
- Pre-existing conversation history to add new messages to.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Jest/Supertest for backend unit/integration tests.
- Cypress or Playwright for E2E testing, capable of managing two browser sessions simultaneously.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other engineer
- Unit tests implemented for new logic, achieving >80% coverage
- Integration tests for the message-sending flow are implemented and passing
- E2E tests simulating a conversation are implemented and passing
- Security review confirms input sanitization is effective against XSS
- UI/UX has been reviewed and approved by the design team
- Documentation for the WebSocket message event and payload is created/updated
- Story deployed and verified in the staging environment by QA

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a core feature and a high priority for the messaging epic.
- Requires coordinated effort between frontend and backend developers.
- Should be developed alongside or immediately after US-060 (Initiate Conversation).

## 11.4.0.0 Release Impact

- This story is critical for the initial launch of the messaging feature. The feature cannot be released without it.

