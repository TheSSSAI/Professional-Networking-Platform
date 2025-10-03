# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-040 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Include a Personalized Message with a Connection R... |
| As A User Story | As a Network Builder, I want to add an optional, s... |
| User Persona | Any platform user actively seeking to expand their... |
| Business Value | Enhances the quality of network interactions, incr... |
| Functional Area | Connection Management |
| Story Theme | Networking and User Interaction |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Send connection request with a personalized message

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user viewing the profile of another user to whom I am not connected

### 3.1.5 When

I click the 'Connect' button, enter a valid message (under 300 characters) in the provided text area, and click 'Send'

### 3.1.6 Then

A modal or confirmation message appears indicating the request was sent, and the recipient receives the connection request which includes my personalized message.

### 3.1.7 Validation Notes

Verify the 'Connection' entity in the database for the pending request contains the correct message text.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Alternative Flow: Send connection request without a message

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

I am a logged-in user viewing the profile of another user to whom I am not connected

### 3.2.5 When

I click the 'Connect' button and click 'Send' without entering any text in the message area

### 3.2.6 Then

The connection request is sent successfully without a message.

### 3.2.7 Validation Notes

Verify the 'Connection' entity in the database for the pending request has a null or empty value for the message field.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Error Condition: Exceed character limit for the message

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

The connection request dialog is open and I am typing a message

### 3.3.5 When

I attempt to type more than the 300-character limit

### 3.3.6 Then

The UI prevents me from entering additional characters, and the character counter visually indicates that the limit has been reached (e.g., turns red, shows '300/300').

### 3.3.7 Validation Notes

Test by pasting text longer than 300 characters and by typing past the limit. The 'Send' button may be disabled.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

UI: Real-time character counter display

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

The connection request dialog is open

### 3.4.5 When

I type characters into the message text area

### 3.4.6 Then

A character counter is visible and updates in real-time to show the current character count out of the 300-character maximum (e.g., '150/300').

### 3.4.7 Validation Notes

Verify the counter increments on key press and decrements on backspace/delete.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Edge Case: Cancel sending the connection request

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

The connection request dialog is open and I have typed a message

### 3.5.5 When

I click the 'Cancel' button or close the dialog without sending

### 3.5.6 Then

The dialog closes, the typed message is discarded, and no connection request is sent.

### 3.5.7 Validation Notes

Check the database to ensure no new pending connection request was created for the target user.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Security: Input sanitization

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

I am sending a connection request with a message

### 3.6.5 When

I include potentially malicious input (e.g., <script>alert('XSS')</script>) in the message

### 3.6.6 Then

The message is sanitized on the server-side before being stored, and when displayed to the recipient, it renders as plain text without executing any scripts.

### 3.6.7 Validation Notes

The recipient should see the literal string '<script>alert('XSS')</script>' and not an alert box.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A modal dialog that appears upon clicking 'Connect'.
- A multi-line text area for the message, with placeholder text (e.g., 'Add a note...').
- A real-time character counter displayed near the text area.
- A primary action button ('Send' or 'Send Request').
- A secondary action ('Cancel' button or a close 'X' icon).

## 4.2.0 User Interactions

- Clicking 'Connect' opens the modal.
- Typing in the text area updates the character counter.
- Clicking 'Send' submits the request and closes the modal.
- Clicking 'Cancel' or 'X' closes the modal without sending.

## 4.3.0 Display Requirements

- The recipient's name and profile picture should be visible in the modal to confirm the target.
- The character limit (300) must be clearly indicated.

## 4.4.0 Accessibility Needs

- The modal must be keyboard accessible (trapping focus within it).
- The text area must have an associated <label>.
- The character counter updates must be announced by screen readers.
- All buttons must be clearly labeled and keyboard-operable.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-001

### 5.1.2 Rule Description

A personalized message with a connection request cannot exceed 300 characters.

### 5.1.3 Enforcement Point

Client-side UI and Server-side API validation.

### 5.1.4 Violation Handling

Client-side: Prevent further input. Server-side: Reject the request with a '400 Bad Request' error and a descriptive message.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-002

### 5.2.2 Rule Description

Adding a message is optional for a connection request.

### 5.2.3 Enforcement Point

Connection request submission logic.

### 5.2.4 Violation Handling

N/A - This is a permissive rule.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-039

#### 6.1.1.2 Dependency Reason

This story extends the functionality of sending a connection request. The base mechanism to create and send a request must exist first.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-041

#### 6.1.2.2 Dependency Reason

The recipient must be able to view the personalized message. The UI for viewing incoming requests must be updated to display this message.

## 6.2.0.0 Technical Dependencies

- A modal component from the chosen UI library (MUI).
- An existing API endpoint for creating connection requests that can be modified to accept an optional message payload.
- Database schema for the 'Connection' or 'ConnectionRequest' table must support a nullable text field for the message.

## 6.3.0.0 Data Dependencies

- Requires access to the sender's and recipient's user profile data to display in the modal.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The connection request modal must load in under 200ms.
- Submitting the request (API response time) should be under 200ms (P95).

## 7.2.0.0 Security

- All message content must be sanitized on the server-side to prevent Cross-Site Scripting (XSS) attacks, as per OWASP Top 10 guidelines.
- The API endpoint must be authenticated and authorized to ensure a user can only send requests on their own behalf.

## 7.3.0.0 Usability

- The process of adding a note should be intuitive and not add significant friction to sending a connection request.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The modal and its functionality must work correctly on all supported browsers (latest versions of Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Requires modification of an existing feature (connection request).
- Frontend modal implementation is a standard pattern.
- Backend change involves adding one optional field to a DTO and a nullable column to a database table.
- Requires coordinated changes across frontend, backend, and database.

## 8.3.0.0 Technical Risks

- Potential for regression bugs in the existing connection request functionality if not tested thoroughly.
- Ensuring consistent and secure input sanitization.

## 8.4.0.0 Integration Points

- Frontend UI (Profile Page) -> Backend API (Connection Service)
- Backend API (Connection Service) -> Database (PostgreSQL)
- The message data needs to be integrated into the notification system (US-073) and the connection management UI (US-041).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- Send request with message.
- Send request without message.
- Attempt to send request with message exceeding character limit.
- Cancel request after typing a message.
- Verify recipient can view the message correctly.
- Test XSS payload in the message field.

## 9.3.0.0 Test Data Needs

- At least two user accounts (sender and recipient) that are not connected.
- Test strings of various lengths, including one exactly 300 characters and one over 300 characters.
- A test string containing HTML/script tags.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Jest/Supertest for backend API integration tests.
- Cypress or Playwright for E2E tests.
- Axe for accessibility audits.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written for new logic and achieve >80% code coverage.
- E2E tests covering the primary success and failure scenarios are passing.
- UI is responsive and meets WCAG 2.1 AA accessibility standards.
- Backend API changes are documented (e.g., in Swagger/OpenAPI if used).
- Security review confirms input sanitization is correctly implemented.
- Feature has been verified by a QA engineer or product owner.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story should be scheduled in a sprint immediately following the completion of US-039 (Send Connection Request).
- Coordinate with the development of US-041 (View Pending Requests) to ensure the message is displayed to the recipient.

## 11.4.0.0 Release Impact

This is a core feature enhancement for the networking functionality and should be included in the initial public launch.

