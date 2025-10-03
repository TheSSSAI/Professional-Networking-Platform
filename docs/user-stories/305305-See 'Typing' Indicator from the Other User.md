# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-063 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | See 'Typing' Indicator from the Other User |
| As A User Story | As a user engaged in a direct message conversation... |
| User Persona | Any platform user actively using the one-on-one di... |
| Business Value | Increases user engagement and satisfaction by crea... |
| Functional Area | Messaging System |
| Story Theme | Real-Time User Experience Enhancements |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Indicator appears when the other user starts typing

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am in a direct message conversation with User B and my chat window is active

### 3.1.5 When

User B types one or more characters into their message input field

### 3.1.6 Then

I should see a visual indicator (e.g., 'User B is typing...') within my chat window.

### 3.1.7 Validation Notes

Can be verified via E2E testing with two simulated users. The event should be triggered on the first keypress.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Indicator disappears when the other user sends a message

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I see the 'typing' indicator for User B

### 3.2.5 When

User B sends the message they were typing

### 3.2.6 Then

the 'typing' indicator should immediately disappear.

### 3.2.7 Validation Notes

The disappearance should be triggered by the message receipt event, not a separate 'stop typing' event.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Indicator disappears after a period of inactivity

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

I see the 'typing' indicator for User B

### 3.3.5 When

User B stops typing for a predefined period (e.g., 3 seconds) without sending a message

### 3.3.6 Then

the 'typing' indicator should disappear.

### 3.3.7 Validation Notes

Requires server-side or client-side timeout logic. A server-side timer is preferred for robustness.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Indicator does not show for conversations in other windows

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

I have active conversations open with User B and User C in separate views

### 3.4.5 When

User B starts typing in their conversation with me

### 3.4.6 Then

the 'typing' indicator should only appear in the conversation window with User B and not in the window with User C.

### 3.4.7 Validation Notes

Ensures that real-time events are correctly scoped to their specific conversation/channel.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Indicator reappears if typing resumes after a timeout

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

the 'typing' indicator for User B has disappeared due to inactivity

### 3.5.5 When

User B starts typing again

### 3.5.6 Then

the 'typing' indicator should reappear.

### 3.5.7 Validation Notes

Verifies that the start/stop/timeout cycle is repeatable.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Pasting text triggers the typing indicator

### 3.6.3 Scenario Type

Alternative_Flow

### 3.6.4 Given

I am in a direct message conversation with User B

### 3.6.5 When

User B pastes text into the message input field

### 3.6.6 Then

I should see the 'typing' indicator, just as if they had typed.

### 3.6.7 Validation Notes

The client-side event listener should handle the 'paste' or 'input' event, not just 'keydown'.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A text-based or animated ellipsis indicator.

## 4.2.0 User Interactions

- The indicator appears and disappears automatically without any user interaction required on the viewing user's part.

## 4.3.0 Display Requirements

- The indicator should be displayed in a non-intrusive area of the chat window, typically near the message input field or at the bottom of the message history.
- The indicator must clearly identify which user is typing (e.g., 'John Doe is typing...').

## 4.4.0 Accessibility Needs

- The status change (a user is typing) must be announced to screen readers using an ARIA live region (e.g., `aria-live="polite"`).

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-001

### 5.1.2 Rule Description

The typing indicator is only active for one-on-one conversations between first-degree connections.

### 5.1.3 Enforcement Point

Backend WebSocket service, before broadcasting the event.

### 5.1.4 Violation Handling

The 'typing' event is not broadcast if the users are not first-degree connections.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-002

### 5.2.2 Rule Description

A 'start typing' event from a client should have a server-side timeout of 3-5 seconds. If no new 'start typing' or 'send message' event is received within this window, a 'stop typing' state is assumed and broadcast.

### 5.2.3 Enforcement Point

Backend WebSocket service.

### 5.2.4 Violation Handling

N/A - This is a state management rule.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-060

#### 6.1.1.2 Dependency Reason

The direct message conversation UI must exist to display the indicator.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-061

#### 6.1.2.2 Dependency Reason

The core functionality for sending and receiving messages must be implemented.

## 6.2.0.0 Technical Dependencies

- A fully implemented and operational real-time communication service using WebSockets (as per SRS 2.6.7), including mechanisms for authenticating users and subscribing them to conversation-specific channels/rooms.

## 6.3.0.0 Data Dependencies

- Requires access to the conversation ID to correctly route events between participants.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The latency for transmitting the 'typing' event from the sender's client to the receiver's client should be under 500ms in nominal network conditions.
- The client-side implementation must not cause noticeable performance degradation in the browser, even with rapid typing.

## 7.2.0.0 Security

- All WebSocket communications must be encrypted using WSS (WebSocket Secure).
- The backend must validate that the user sending a 'typing' event is a legitimate participant in the specified conversation.

## 7.3.0.0 Usability

- The indicator must be subtle and not distract from reading the message history or typing a response.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards, specifically regarding notifications of status changes for screen reader users.

## 7.5.0.0 Compatibility

- The feature must work consistently across all supported modern browsers (latest versions of Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires real-time, event-driven architecture (WebSockets).
- Involves both client-side event handling (debouncing input) and server-side event routing and state management (timeouts).
- Requires careful management of WebSocket connections and conversation-specific rooms/channels to ensure scalability.

## 8.3.0.0 Technical Risks

- Potential for performance issues on the WebSocket server under high load if event handling is not efficient.
- Ensuring consistent behavior across different network conditions (latency, packet loss) can be challenging.

## 8.4.0.0 Integration Points

- Frontend messaging component.
- Backend WebSocket service.
- User authentication service (to authorize WebSocket connections).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify indicator appears on typing, disappears on send, and disappears on timeout.
- Test with two concurrent browser sessions (e.g., using Cypress or Playwright) to simulate a live conversation.
- Verify events are correctly scoped to the right conversation when multiple chats are open.
- Test accessibility with a screen reader to ensure the status is announced correctly.

## 9.3.0.0 Test Data Needs

- At least two test user accounts that are first-degree connections.

## 9.4.0.0 Testing Tools

- Jest for frontend/backend unit tests.
- Cypress or Playwright for E2E testing.
- WebSocket client library for integration testing the backend service.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other developer
- Unit and integration tests implemented with sufficient coverage (>80%) and are passing
- E2E tests covering the key scenarios are implemented and passing
- User interface reviewed and approved by UX/Product Owner
- Performance requirements (latency) verified under simulated load
- Security requirements validated (WSS, event authorization)
- Accessibility requirements (screen reader announcements) verified
- Documentation for the WebSocket events created or updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🟡 Medium

## 11.3.0.0 Sprint Considerations

- This story is a feature enhancement and should be prioritized after the core messaging MVP is stable.
- Requires the WebSocket infrastructure to be in place. If not, it must be planned as part of a larger epic.

## 11.4.0.0 Release Impact

- Enhances the user experience of a key feature (messaging). No direct impact on other system functionalities.

