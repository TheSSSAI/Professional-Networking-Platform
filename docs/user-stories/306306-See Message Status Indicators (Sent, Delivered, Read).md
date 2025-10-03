# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-064 |
| Elaboration Date | 2025-01-18 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | See Message Status Indicators (Sent, Delivered, Re... |
| As A User Story | As a Communicating Professional, I want to see rea... |
| User Persona | Any user actively sending messages within the plat... |
| Business Value | Increases user confidence and satisfaction in the ... |
| Functional Area | Messaging System |
| Story Theme | Real-time Communication Enhancements |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Message status updates to 'Sent' upon successful server receipt

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am logged in and have an active direct message conversation open with a connection

### 3.1.5 When

I send a message and it is successfully received and persisted by the server

### 3.1.6 Then

The message I sent immediately displays in my conversation history with a 'Sent' status indicator (e.g., a single grey checkmark).

### 3.1.7 Validation Notes

Verify the UI shows the correct icon. Check the message record in the database has a 'sent' status.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Message status updates to 'Delivered' when pushed to an active recipient client

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I have sent a message that has a 'Sent' status

### 3.2.5 And

The recipient is online with the application open (but not necessarily viewing my conversation)

### 3.2.6 When

The message is successfully delivered to the recipient's client via the WebSocket connection

### 3.2.7 Then

The status indicator for that message updates in real-time from 'Sent' to 'Delivered' (e.g., two grey checkmarks).

### 3.2.8 Validation Notes

Requires simulating two users. The sender's UI must update automatically without a page refresh. The server should log the delivery event.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Message status updates to 'Read' when viewed by the recipient

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

I have sent a message that has a 'Delivered' status

### 3.3.5 And

The recipient has my specific conversation window open and active

### 3.3.6 When

The message becomes visible within the recipient's viewport

### 3.3.7 Then

The status indicator for that message updates in real-time from 'Delivered' to 'Read' (e.g., two blue checkmarks).

### 3.3.8 Validation Notes

The recipient's client must emit a 'message_read' event. The sender's UI must update in real-time. The database record for the message should be updated to 'read'.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Message status remains 'Sent' if the recipient is offline

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

I send a message to a connection who is currently offline

### 3.4.5 When

The message is successfully received by the server

### 3.4.6 Then

The message status indicator shows 'Sent' and remains 'Sent' until the recipient logs in and the message is delivered.

### 3.4.7 Validation Notes

Test by sending a message to a logged-out user. Log in as the recipient and verify the status updates to 'Delivered' on the sender's side.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Multiple unread messages are marked as 'Read' simultaneously

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

I have sent several messages to a connection, all of which have a 'Delivered' status

### 3.5.5 When

The recipient opens the conversation, and all of my unread messages become visible in their viewport

### 3.5.6 Then

All corresponding messages in my view should update their status to 'Read' at the same time.

### 3.5.7 Validation Notes

The client should batch 'message_read' events or the server should process them to update all relevant messages. The sender should see a single batch of UI updates.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Message status indicator provides text details on hover

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

I have sent a message with a visible status indicator ('Sent', 'Delivered', or 'Read')

### 3.6.5 When

I hover my mouse cursor over the status indicator

### 3.6.6 Then

A tooltip appears displaying the status as text and the corresponding timestamp (e.g., 'Read at 10:45 AM').

### 3.6.7 Validation Notes

Verify the tooltip appears and displays the correct status and timestamp. The timestamp should be formatted for the user's locale.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A distinct icon for each message status: 'Sending' (e.g., clock icon), 'Sent' (e.g., single grey checkmark), 'Delivered' (e.g., double grey checkmarks), 'Read' (e.g., double blue checkmarks).
- A tooltip component for displaying status details on hover.

## 4.2.0 User Interactions

- Status icons update automatically and in real-time without requiring a user action or page refresh.
- Hovering over the status icon reveals a tooltip.

## 4.3.0 Display Requirements

- The most recent status of a sent message must be displayed next to the message bubble.
- Timestamps in tooltips should be user-friendly.

## 4.4.0 Accessibility Needs

- Status icons must have appropriate ARIA labels (e.g., aria-label="Message delivered") so screen readers can announce the status.
- Color should not be the only means of distinguishing the 'Delivered' and 'Read' states; the icon design or tooltip must also provide differentiation.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-001

### 5.1.2 Rule Description

A message is only considered 'Read' when it has entered the recipient's active viewport in the specific conversation window.

### 5.1.3 Enforcement Point

Client-side (Recipient's browser)

### 5.1.4 Violation Handling

The 'message_read' event is not fired, and the sender will not see a 'Read' receipt.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-002

### 5.2.2 Rule Description

Message status updates are unidirectional and follow the sequence: Sending -> Sent -> Delivered -> Read.

### 5.2.3 Enforcement Point

Server-side (Messaging Service)

### 5.2.4 Violation Handling

The system will reject any out-of-sequence status update requests for a given message.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-060

#### 6.1.1.2 Dependency Reason

A conversation must exist before messages can be sent and their status tracked.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-061

#### 6.1.2.2 Dependency Reason

The core functionality to send a message must be implemented first.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-062

#### 6.1.3.2 Dependency Reason

The UI for displaying the conversation history is required to place the status indicators.

## 6.2.0.0 Technical Dependencies

- A fully functional WebSocket server (Socket.IO) for real-time, bidirectional communication.
- Backend Messaging Service capable of persisting and updating message states.
- Client-side state management library (e.g., Redux, Zustand) to handle real-time UI updates efficiently.

## 6.3.0.0 Data Dependencies

- The `Messages` table in the PostgreSQL database must have a column to store the message status (e.g., `status` ENUM('sending', 'sent', 'delivered', 'read')) and a `read_at` timestamp.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- Real-time status updates (from Delivered to Read) must be reflected on the sender's UI within 500ms under normal network conditions.
- The client-side 'read' detection mechanism (e.g., Intersection Observer) must not degrade scrolling performance in long conversations.

## 7.2.0.0 Security

- All WebSocket communications must be encrypted using WSS (WebSocket Secure).
- The server must validate that status update events originate from the authenticated, correct recipient.

## 7.3.0.0 Usability

- The meaning of each status icon should be intuitive or easily discoverable (e.g., via tooltip).

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards, as detailed in the UI requirements.

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported modern browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordinated full-stack development (frontend, backend, database).
- Managing the lifecycle of WebSocket connections and ensuring reliable real-time updates.
- Implementing efficient client-side logic to detect when messages are read without impacting performance.
- Ensuring the backend can handle a high volume of status update events at scale.

## 8.3.0.0 Technical Risks

- Potential for message status to get out of sync due to network interruptions. A reconciliation mechanism may be needed.
- High load on the WebSocket server could introduce latency in status updates.

## 8.4.0.0 Integration Points

- Frontend messaging component.
- Backend WebSocket service.
- Backend API for persisting messages.
- PostgreSQL database.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance

## 9.2.0.0 Test Scenarios

- Simulate a two-user chat to verify the entire lifecycle of a message status from Sent to Read.
- Test the offline recipient scenario.
- Test sending multiple messages in quick succession and verifying all statuses update correctly.
- Test performance with a long conversation history to ensure no UI lag.

## 9.3.0.0 Test Data Needs

- At least two test user accounts that can be connected to each other.
- A method to simulate one user being online while the other is offline.

## 9.4.0.0 Testing Tools

- Jest/Vitest for unit tests.
- Cypress or Playwright for E2E testing, as they can manage multiple browser sessions.
- A WebSocket testing tool for load testing the real-time component.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by team
- Unit tests implemented and passing with >80% coverage for new logic
- Integration testing between frontend, backend, and WebSocket service completed successfully
- User interface reviewed and approved for visual correctness and accessibility
- Performance requirements for real-time updates verified
- Security requirements for WebSocket communication validated
- Documentation for the messaging event schema (e.g., 'message_read') is created or updated
- Story deployed and verified in staging environment by QA

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- Requires both frontend and backend developer capacity within the same sprint.
- Should be prioritized after the foundational messaging stories (US-060, US-061, US-062) are completed.

## 11.4.0.0 Release Impact

This is a key feature for a modern messaging experience and is critical for user satisfaction with the communication tools of the platform.

