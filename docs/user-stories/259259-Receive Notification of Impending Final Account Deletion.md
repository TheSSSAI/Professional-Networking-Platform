# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-017 |
| Elaboration Date | 2025-01-17 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Receive Notification of Impending Final Account De... |
| As A User Story | As a user who has requested to permanently delete ... |
| User Persona | A registered user who has initiated the permanent ... |
| Business Value | Improves user trust and provides a positive off-bo... |
| Functional Area | User Account Management |
| Story Theme | Account Lifecycle and Security |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful sending of the 24-hour pre-deletion notification email

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A user has requested permanent account deletion, and their account status is 'Pending Deletion'

### 3.1.5 When

The system time reaches 24 hours (with a small tolerance, e.g., +/- 15 minutes) before the scheduled 14-day grace period expires

### 3.1.6 Then

A scheduled job is triggered and sends an email to the user's registered email address via the transactional email service (AWS SES).

### 3.1.7 Validation Notes

Verify that an email is sent and received by a test email inbox. The email content must match the template defined in UI requirements. Check system logs for successful job execution and email dispatch.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Email content is clear and contains a valid cancellation link

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

The pre-deletion notification email has been successfully sent

### 3.2.5 When

The user opens the email

### 3.2.6 Then

The email subject line is 'Final Notice: Your [Platform Name] Account Deletion'.

### 3.2.7 And

The email contains a prominent, secure, single-use link or button to cancel the deletion process.

### 3.2.8 Validation Notes

Manually inspect the received email for content, clarity, and branding. Click the cancellation link to ensure it directs to the correct page/endpoint and functions as expected (as per US-016).

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

User cancels deletion before the notification is sent

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

A user has requested permanent account deletion and a 24-hour notification job is scheduled for them

### 3.3.5 When

The user cancels their account deletion request (per US-016) before the 24-hour notification is scheduled to be sent

### 3.3.6 Then

The scheduled notification job for this user must be cancelled and removed from the job queue.

### 3.3.7 And

The user must not receive the 24-hour pre-deletion notification email.

### 3.3.8 Validation Notes

In a test environment, request deletion, then immediately cancel it. Verify that the scheduled job is deleted and no email is sent after the notification time has passed.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Transactional email service fails to send the notification

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

The system attempts to send the 24-hour pre-deletion notification

### 3.4.5 When

The transactional email service (AWS SES) is unavailable or returns a failure response

### 3.4.6 Then

The system attempts to resend the email according to a defined retry policy (e.g., 3 retries over 1 hour).

### 3.4.7 And

If all retries fail, a critical error is logged containing the user ID, timestamp, and the error from the email service.

### 3.4.8 Validation Notes

Simulate an email service failure using a mock service. Verify that the retry logic is executed and that a critical error is logged upon final failure.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- This story is backend-focused. The primary UI is the email notification itself.

## 4.2.0 User Interactions

- User receives and reads the email.
- User may click the 'Cancel Deletion' link within the email.

## 4.3.0 Display Requirements

- Email Subject: 'Final Notice: Your [Platform Name] Account Deletion'
- Email Body: Must include user's name, platform branding, a clear statement of irreversible deletion, the approximate time/date of deletion, and a call-to-action button/link to 'Cancel Account Deletion'.

## 4.4.0 Accessibility Needs

- The email must be a well-structured HTML document, compliant with WCAG 2.1 AA for email, ensuring it is readable by screen readers and has sufficient color contrast.

# 5.0.0 Business Rules

- {'rule_id': 'BR-001', 'rule_description': 'The final deletion notification must be scheduled to be sent 24 hours prior to the expiration of the 14-day deletion grace period.', 'enforcement_point': 'System scheduler at the time of the initial deletion request (US-015).', 'violation_handling': 'A failure to schedule the job should result in a logged error and potentially a manual alert for administrative review.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-015

#### 6.1.1.2 Dependency Reason

This story is triggered by the account deletion process initiated in US-015. The deletion request and grace period must exist before a notification can be scheduled.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-016

#### 6.1.2.2 Dependency Reason

The logic to cancel the scheduled notification depends on the account deletion cancellation flow defined in US-016.

## 6.2.0.0 Technical Dependencies

- A robust job scheduling system (e.g., AWS EventBridge Scheduler, cron).
- Integration with the transactional email service (AWS SES) as per SRS 2.6.9.
- A system for managing and rendering email templates.

## 6.3.0.0 Data Dependencies

- Access to user records to retrieve email address and the timestamp of the deletion request.

## 6.4.0.0 External Dependencies

- The availability and reliability of the external AWS SES service.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The job scheduler must be able to handle a high volume of scheduled tasks without performance degradation.

## 7.2.0.0 Security

- The 'Cancel Deletion' link in the email must be a secure, single-use, time-limited token to prevent unauthorized account recovery.

## 7.3.0.0 Usability

- The email content must be unambiguous and easily understandable, clearly communicating the gravity of the situation and the action required to cancel.

## 7.4.0.0 Accessibility

- Email must adhere to WCAG 2.1 AA standards.

## 7.5.0.0 Compatibility

- The HTML email should render correctly across major email clients (e.g., Gmail, Outlook, Apple Mail).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires a reliable, scalable background job scheduling and execution system.
- State management is critical: the system must correctly handle the cancellation of scheduled jobs if a user reverses their decision.
- Requires robust error handling and retry logic for the external email service integration.
- Time zone handling for scheduling and communicating the deletion time to the user must be consistent.

## 8.3.0.0 Technical Risks

- The job scheduler fails to trigger, or triggers at the wrong time, leading to a poor user experience or missed notifications.
- The email service API has an extended outage, causing notifications to fail despite retry logic.

## 8.4.0.0 Integration Points

- User Management Service: To get user data and update status.
- Job Scheduling Service: To create and cancel the notification job.
- Notification Service / AWS SES: To dispatch the email.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify email is sent exactly 13 days after a deletion request in a time-accelerated test environment.
- Verify the scheduled job is successfully cancelled when a user cancels their deletion request.
- Verify the system's behavior when the email service is mocked to be unavailable.
- Verify the content and functionality of the link in the received email.

## 9.3.0.0 Test Data Needs

- Test user accounts that can be placed in a 'Pending Deletion' state.
- A mechanism to manipulate system time in the test environment to trigger the scheduled job without waiting 13 days.

## 9.4.0.0 Testing Tools

- A mock email service (e.g., MailHog, Mailtrap) to intercept and inspect outgoing emails in test environments.
- Frameworks for mocking time (e.g., Timecop, Mockito) to test time-sensitive logic.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by team
- Unit tests implemented and passing with >80% coverage for the new logic
- Integration testing between the user service, job scheduler, and email service completed successfully
- The email template is reviewed and approved by UX/Product
- Error logging for failed jobs and email sends is verified in the staging environment
- Documentation for the account deletion lifecycle is updated
- Story deployed and verified in staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story should be planned in the same or a subsequent sprint as US-015 and US-016.
- Requires coordination with DevOps if new infrastructure for job scheduling is needed.

## 11.4.0.0 Release Impact

- This is a critical component of the account deletion feature. The feature should not be released to production without this notification mechanism in place.

