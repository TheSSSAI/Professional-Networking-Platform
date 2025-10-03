# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-077 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Receive Batched Notifications for Multiple Similar... |
| As A User Story | As an active platform user who shares content, I w... |
| User Persona | Active Content Creator: Any user who creates posts... |
| Business Value | Improves user experience by reducing 'notification... |
| Functional Area | Notifications |
| Story Theme | User Engagement and Experience |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Batching multiple 'likes' on a single post within the time window

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a user and I have created a post

### 3.1.5 When

Three different users ('User A', 'User B', 'User C') 'like' my post within the 5-minute batching window

### 3.1.6 Then

I should receive exactly one new notification for these likes in my notification center

### 3.1.7 And

The notification text should be formatted as: 'User A, User B, and 1 other liked your post.'

### 3.1.8 Validation Notes

Verify that three separate notifications are not created. Check the notification text for the correct format and count.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Batching multiple 'comments' on a single post within the time window

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am a user and I have created a post

### 3.2.5 When

Two different users ('User A', 'User B') comment on my post within the 5-minute batching window

### 3.2.6 Then

I should receive exactly one new notification for these comments

### 3.2.7 And

The notification text should be formatted as: 'User A and User B commented on your post.'

### 3.2.8 Validation Notes

Verify that two separate notifications are not created. This confirms batching works for comments as well as likes.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

A single event occurs, no batching should happen

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

I am a user and I have created a post

### 3.3.5 When

Only one user ('User A') likes my post and no other similar events occur within the 5-minute batching window

### 3.3.6 Then

I should receive a single, non-batched notification

### 3.3.7 And

The notification text should read: 'User A liked your post.'

### 3.3.8 Validation Notes

Ensures that the system doesn't attempt to batch a single event and correctly generates a standard notification.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Similar events occur outside the batching window

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

I have received a batched notification for 2 likes on my post that occurred within the first 5-minute window

### 3.4.5 When

A third user ('User C') likes the same post 6 minutes after the first like

### 3.4.6 Then

I should receive a new, separate notification for the third like

### 3.4.7 And

The new notification text should read: 'User C liked your post.'

### 3.4.8 Validation Notes

Tests the time-bound nature of the batching logic. The second notification should not be batched with the first two.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Different event types on the same post are not batched together

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

I am a user and I have created a post

### 3.5.5 When

'User A' likes my post and 'User B' comments on my post within the same 5-minute window

### 3.5.6 Then

I should receive two separate notifications

### 3.5.7 And

The other notification should read 'User B commented on your post.'

### 3.5.8 Validation Notes

Verifies that the batching logic correctly differentiates between event types (like vs. comment) and does not group them.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

User interaction with a batched notification

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

I have received a batched notification, such as 'User A and 5 others liked your post'

### 3.6.5 When

I click on this notification in the notification center

### 3.6.6 Then

The application should navigate me directly to the specific post that received the likes.

### 3.6.7 Validation Notes

Confirm that the notification link correctly resolves to the target content entity.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Notification item in the Notification Center (UI from US-078)

## 4.2.0 User Interactions

- Clicking a batched notification navigates the user to the associated content (e.g., the post).

## 4.3.0 Display Requirements

- The notification text must be dynamically generated based on the number of actors.
- For 2 actors: '[User A] and [User B] [action] your post.'
- For 3 actors: '[User A], [User B], and 1 other [action] your post.'
- For 4+ actors: '[User A], [User B], and [N-2] others [action] your post.'

## 4.4.0 Accessibility Needs

- The full notification text, including names and counts, must be readable by screen readers.

# 5.0.0 Business Rules

- {'rule_id': 'BR-001', 'rule_description': "Notifications of the same type (e.g., 'like') on the same content item shall be batched if they occur within a 5-minute window. (Ref: SRS 5.1.3)", 'enforcement_point': 'Notification Generation Service, upon receiving an interaction event.', 'violation_handling': 'If the rule fails, the system may generate multiple individual notifications, degrading user experience. This should be monitored via alerting.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-054

#### 6.1.1.2 Dependency Reason

Functionality to 'like' a post must exist to generate the event.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-056

#### 6.1.2.2 Dependency Reason

Functionality to 'comment' on a post must exist to generate the event.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-075

#### 6.1.3.2 Dependency Reason

The basic real-time notification system for likes must be implemented first.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

US-076

#### 6.1.4.2 Dependency Reason

The basic real-time notification system for comments must be implemented first.

### 6.1.5.0 Story Id

#### 6.1.5.1 Story Id

US-078

#### 6.1.5.2 Dependency Reason

The Notification Center UI must exist to display the batched notification.

## 6.2.0.0 Technical Dependencies

- A real-time communication layer (WebSockets/Socket.IO) for pushing notifications.
- A caching layer (Redis) for temporary storage and aggregation of events during the batching window.
- An asynchronous task/job queue for processing batches after the time window expires.

## 6.3.0.0 Data Dependencies

- Access to User data (for names) and Post data (for linking).

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The batching mechanism must not introduce a user-perceptible delay beyond the defined 5-minute window.
- The system must handle a high throughput of interaction events without degrading performance.

## 7.2.0.0 Security

- The notification service must validate that the user receiving the notification is the actual owner of the content.

## 7.3.0.0 Usability

- The batched notification text must be clear, concise, and easily understandable.

## 7.4.0.0 Accessibility

- Must adhere to WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- Notification display and interaction must be consistent across all supported browsers and devices.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires asynchronous processing and state management over a time window.
- Involves coordination between multiple services (e.g., Post Service, Notification Service).
- Requires robust implementation of a delayed job processing system.
- Logic for handling race conditions and ensuring exactly-once processing of a batch is non-trivial.

## 8.3.0.0 Technical Risks

- Potential for race conditions if Redis operations are not atomic.
- The delayed job scheduler could become a single point of failure if not designed for high availability.
- Ensuring accurate aggregation at scale can be challenging.

## 8.4.0.0 Integration Points

- Consumes events from services that handle user interactions (e.g., Posts service).
- Writes to the primary database (PostgreSQL) to persist the final notification.
- Pushes real-time updates to clients via the WebSocket service.
- Utilizes Redis for caching and aggregation.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance

## 9.2.0.0 Test Scenarios

- Verify correct text generation for 1, 2, 3, and 4+ actors.
- Test the 5-minute time window boundary accurately.
- Confirm that mixed event types (like/comment) are not batched.
- Test the end-to-end flow from user action to batched notification appearing in the UI.
- Load test the system with a high volume of concurrent events to check for bottlenecks.

## 9.3.0.0 Test Data Needs

- Multiple test user accounts.
- A target post created by a test user.
- Ability to script actions (likes, comments) from different users in a controlled time sequence.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Supertest or similar for integration tests of the notification service.
- Cypress or Playwright for E2E tests.
- k6 or JMeter for load testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least two peers
- Unit and integration tests implemented with >80% code coverage for the new logic
- E2E tests for the primary scenarios are passing
- Performance testing shows the system meets latency requirements under expected load
- The feature is deployed and verified in the staging environment
- No regressions are introduced in the existing notification system
- Relevant technical documentation for the batching mechanism is created

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story should be scheduled after all prerequisite stories are completed and deployed.
- Requires developer expertise in asynchronous processing, Redis, and message queues.
- The team should allocate time for thorough integration and E2E testing due to the asynchronous nature of the feature.

## 11.4.0.0 Release Impact

This is a significant UX improvement and should be highlighted in release notes as a key feature for enhancing user experience.

