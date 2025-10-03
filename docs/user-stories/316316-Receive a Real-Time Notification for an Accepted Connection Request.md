# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-074 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Receive a Real-Time Notification for an Accepted C... |
| As A User Story | As a user who has sent a connection request, I wan... |
| User Persona | The 'Requesting User' - any platform user who has ... |
| Business Value | Increases user engagement and platform responsiven... |
| Functional Area | Notifications |
| Story Theme | Connection Management & User Engagement |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Active user receives a real-time notification

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

User A has sent a connection request to User B, and User A is currently active on the platform with a stable WebSocket connection.

### 3.1.5 When

User B accepts the connection request from User A.

### 3.1.6 Then

User A must receive a real-time in-app notification within 2 seconds.

### 3.1.7 And

A visual indicator for unread notifications (e.g., a badge count on the notification icon) must increment for User A.

### 3.1.8 Validation Notes

Verify via E2E test. Simulate User B's action and assert that User A's client receives the WebSocket message and the UI updates without a page refresh.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Offline user sees the notification upon next login

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

User A has sent a connection request to User B, and User A is currently offline.

### 3.2.5 When

User B accepts the connection request.

### 3.2.6 And

The notification center must list the new notification from User B at the top of the unread notifications.

### 3.2.7 Then

The notification icon must immediately show an unread notification indicator.

### 3.2.8 Validation Notes

Test by logging out User A, performing the acceptance action as User B, then logging User A back in. Verify the notification state is correctly loaded from the database.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

User navigates to the new connection's profile from the notification

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

User A has an unread notification that User B accepted their connection request.

### 3.3.5 When

User A clicks on the notification.

### 3.3.6 Then

The application must navigate User A to User B's profile page.

### 3.3.7 And

The unread notification indicator count must decrement accordingly.

### 3.3.8 Validation Notes

E2E test: Click the notification element and assert the URL changes to the correct profile URL and the notification's visual 'unread' state is removed.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Notification is not sent if user has disabled this notification type

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

User A has disabled notifications for 'Accepted Connection Requests' in their settings.

### 3.4.5 And

No new notification item for this event should appear in User A's notification center.

### 3.4.6 When

User B accepts the connection request.

### 3.4.7 Then

No real-time notification should be pushed to User A's client.

### 3.4.8 Validation Notes

Requires implementation of US-080. Test by configuring user preferences, triggering the event, and asserting that no notification is created or sent for User A.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

New connection deactivates their account before notification is seen

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

User B accepts User A's connection request.

### 3.5.5 And

The link to User B's profile should be disabled or redirect to a page indicating the user is no longer active, consistent with SRS-001-F1.

### 3.5.6 When

User A views the notification in their notification center.

### 3.5.7 Then

The notification text should still be present (e.g., '[User B's Name] has accepted your connection request.').

### 3.5.8 Validation Notes

Requires a test setup where an account can be programmatically deactivated. Verify the notification link's behavior.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A notification item in the notification center/dropdown list.
- A temporary 'toast' or pop-up notification for active users.
- A badge counter on the main navigation's notification icon.

## 4.2.0 User Interactions

- Clicking the notification item navigates the user to the new connection's profile.
- Viewing the notification center marks the notification as read.

## 4.3.0 Display Requirements

- The notification must display the full name and profile picture of the user who accepted the request.
- The notification item must have a clear visual distinction between 'read' and 'unread' states.
- A relative timestamp (e.g., '5m ago') should be displayed.

## 4.4.0 Accessibility Needs

- Real-time toast notifications must use ARIA live regions to be announced by screen readers.
- Notification list items must be keyboard-focusable and navigable.
- The unread indicator must have a text-based alternative for screen readers (e.g., '1 unread notification').

# 5.0.0 Business Rules

- {'rule_id': 'BR-NOTIF-01', 'rule_description': 'A notification for an accepted connection request is generated only for the user who initiated the request.', 'enforcement_point': "Notification Service, upon receiving a 'CONNECTION_ACCEPTED' event.", 'violation_handling': 'The event is ignored if the recipient cannot be identified as the original sender of the request.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-039

#### 6.1.1.2 Dependency Reason

Functionality to send a connection request must exist to initiate the workflow.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-042

#### 6.1.2.2 Dependency Reason

Functionality to accept a connection request must exist to trigger the notification event.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-078

#### 6.1.3.2 Dependency Reason

The notification center UI must exist to display the history of notifications.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

US-079

#### 6.1.4.2 Dependency Reason

The unread notification indicator UI must exist to be updated by this story.

## 6.2.0.0 Technical Dependencies

- A backend Notification Service capable of creating and persisting notifications.
- A real-time communication infrastructure (e.g., WebSockets via Socket.IO as per SRS-001-NFR 2.6.7).
- An event bus or message queue for inter-service communication between the Connection Service and Notification Service.
- A frontend state management solution to handle real-time UI updates.

## 6.3.0.0 Data Dependencies

- Access to User Profile data (Full Name, Profile Picture URL) to populate the notification content.
- A data store (e.g., a 'notifications' table in PostgreSQL) to persist notifications for offline users.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- P99 latency for notification delivery to an active client must be under 2 seconds from the acceptance event.
- The database query to fetch unread notifications for a user upon login must execute in under 50ms.

## 7.2.0.0 Security

- The WebSocket connection must be encrypted using WSS (TLS).
- The notification payload must not expose any sensitive user data beyond what is necessary for display (e.g., no email addresses).

## 7.3.0.0 Usability

- The notification must be clear, concise, and immediately understandable.
- The interaction (clicking) must be intuitive and lead to the expected location.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards, particularly for dynamic content and keyboard navigation.

## 7.5.0.0 Compatibility

- Real-time updates must function correctly on all supported modern browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordination between multiple microservices (Connections, Notifications, Users).
- Implementation of a reliable real-time messaging layer using WebSockets.
- Handling state for offline users and ensuring delivery upon their return.
- Frontend state management for real-time UI updates without performance degradation.

## 8.3.0.0 Technical Risks

- Scalability of the WebSocket server to handle a large number of concurrent connections.
- Potential for missed events if the message queue or subscribing service experiences downtime. A dead-letter queue or similar retry mechanism should be considered.
- Ensuring exactly-once processing of the 'CONNECTION_ACCEPTED' event to prevent duplicate notifications.

## 8.4.0.0 Integration Points

- Connection Service: Publishes the 'CONNECTION_ACCEPTED' event.
- Notification Service: Subscribes to the event, creates the notification, and pushes it via WebSocket.
- User Profile Service: Queried by the Notification Service for user details.
- API Gateway: Manages the WebSocket connections.
- Frontend Application: Listens for WebSocket messages and updates the UI.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance

## 9.2.0.0 Test Scenarios

- Verify real-time notification delivery for an online user.
- Verify notification is available in the notification center for a user who was offline.
- Verify clicking the notification navigates to the correct profile.
- Verify notification is NOT sent if user preferences are set to disable it.
- Verify system behavior under high load (many concurrent acceptances).

## 9.3.0.0 Test Data Needs

- At least two distinct user accounts for sending and receiving requests.
- Ability to set notification preferences for a user account.
- Ability to simulate a user being online (active WebSocket) and offline.

## 9.4.0.0 Testing Tools

- Jest/Vitest for frontend/backend unit tests.
- Cypress or Playwright for E2E testing.
- k6 or similar for load testing the WebSocket server and notification endpoints.

# 10.0.0.0 Definition Of Done

- All acceptance criteria are validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% coverage for new code.
- E2E tests for both online and offline scenarios are implemented and passing.
- Performance test confirms notification delivery latency is within the defined NFR.
- Accessibility requirements (ARIA roles, keyboard navigation) have been implemented and verified.
- The feature is documented in the API specification and user-facing help center.
- The story has been successfully deployed and verified in the production environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a core engagement feature and should be prioritized soon after the basic connection management functionality is complete.
- Requires that the foundational architecture for event-driven communication and WebSockets is in place.

## 11.4.0.0 Release Impact

This feature significantly improves the user experience by making the platform feel more dynamic and interactive. It is a key component for the public launch.

