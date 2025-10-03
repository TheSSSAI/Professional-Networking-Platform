# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-002 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Receive Email Verification after Registration |
| As A User Story | As a new user who has just completed the registrat... |
| User Persona | A new, unverified user who has just submitted thei... |
| Business Value | Verifies user email addresses to reduce spam/fake ... |
| Functional Area | User Authentication and Authorization |
| Story Theme | User Account Lifecycle Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful sending of verification email after registration

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a new user has successfully submitted the registration form with a valid email address

### 3.1.5 When

the system processes the successful registration request

### 3.1.6 Then

the user's account is created in the database with a status of 'inactive' or 'pending_verification'.

### 3.1.7 Validation Notes

Verify the user record in the PostgreSQL database has the correct status.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Successful sending of verification email after registration

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a user account has been created with a 'pending_verification' status

### 3.2.5 When

the system processes the successful registration request

### 3.2.6 Then

a secure, unique, single-use verification token is generated and associated with the user account.

### 3.2.7 Validation Notes

Check the database to ensure a token and its expiry timestamp are stored for the user.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Successful sending of verification email after registration

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

a verification token has been generated for a new user

### 3.3.5 When

the system triggers the email sending process

### 3.3.6 Then

an email is sent to the user's provided email address via the transactional email service (AWS SES) within 60 seconds.

### 3.3.7 Validation Notes

Use a mail-trapping service in a test environment (e.g., Mailtrap, MailHog) to confirm receipt and timing of the email.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Verification email content and format

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

the verification email has been sent

### 3.4.5 When

the user opens the email

### 3.4.6 Then

the email content clearly states its purpose, includes platform branding, and contains the unique verification link.

### 3.4.7 Validation Notes

Manually inspect the email received by the test service for correct content, branding, and a valid link format.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Failure of the external email service

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

a new user has successfully registered

### 3.5.5 When

the system attempts to send the verification email and the external email service (AWS SES) is unavailable or returns an error

### 3.5.6 Then

the system logs the failure with the user ID, timestamp, and service error response.

### 3.5.7 Validation Notes

Simulate an email service failure and check system logs (e.g., Loki) for the detailed error message.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Failure of the external email service

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

an initial attempt to send a verification email has failed

### 3.6.5 When

the system processes the failure

### 3.6.6 Then

a retry mechanism (e.g., exponential backoff for 3 attempts) is initiated for the email sending job.

### 3.6.7 Validation Notes

Verify that the system re-attempts to send the email by observing logs or mock service calls.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

User-facing message after registration submission

### 3.7.3 Scenario Type

Happy_Path

### 3.7.4 Given

a new user has successfully submitted the registration form

### 3.7.5 When

the registration processing is complete (regardless of immediate email sending success)

### 3.7.6 Then

the user is shown a confirmation message on the UI, such as 'Registration successful! Please check your email at [user's email] for a verification link.'

### 3.7.7 Validation Notes

Perform an E2E test to confirm the UI displays the correct message after form submission.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Post-registration confirmation message/toast

## 4.2.0 User Interactions

- User sees a confirmation message after submitting the registration form, informing them to check their email.

## 4.3.0 Display Requirements

- The confirmation message must dynamically include the email address the user registered with.

## 4.4.0 Accessibility Needs

- The confirmation message must be readable by screen readers and have sufficient color contrast.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-002

### 5.1.2 Rule Description

The email verification token must expire 24 hours after it is generated.

### 5.1.3 Enforcement Point

During the token validation process (covered in US-003).

### 5.1.4 Violation Handling

If an expired token is used, the user is shown an error message and prompted to request a new verification email.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-003

### 5.2.2 Rule Description

The email verification token must be single-use.

### 5.2.3 Enforcement Point

During the token validation process (covered in US-003).

### 5.2.4 Violation Handling

Once a token is successfully used, it is invalidated. Subsequent attempts to use the same token will fail.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

- {'story_id': 'US-001', 'dependency_reason': 'This story is triggered by the successful completion of the user registration process defined in US-001. The user record must exist in the database before the verification email can be sent.'}

## 6.2.0 Technical Dependencies

- Integration with a configured transactional email service (AWS SES as per SRS-2.6.9).
- A User entity/table in the PostgreSQL database with a 'status' field and fields for storing the verification token and its expiry.
- An asynchronous job processing system (e.g., built-in NestJS async tasks, or a message queue like RabbitMQ/SQS) to send emails without blocking the API response.

## 6.3.0 Data Dependencies

- Requires the user's email address and user ID from the newly created user record.

## 6.4.0 External Dependencies

- The AWS Simple Email Service (SES) API must be available and accessible from the application environment.

# 7.0.0 Non Functional Requirements

## 7.1.0 Performance

- The verification email should be delivered to the user's inbox within 60 seconds of successful registration under normal load.

## 7.2.0 Security

- Verification tokens must be generated using a cryptographically secure random string generator.
- Tokens must not contain any personally identifiable information (PII).
- The email sending process must not log the plaintext token, only a hashed version if necessary for lookup.

## 7.3.0 Usability

- The email subject line should be clear and concise (e.g., 'Verify Your Email for [Platform Name]').
- The email content must be easy to understand with a clear call-to-action.

## 7.4.0 Accessibility

- The HTML email template must be responsive and accessible, following email accessibility best practices (e.g., using semantic HTML, alt text for images).

## 7.5.0 Compatibility

- The HTML email must render correctly across major email clients (e.g., Gmail, Outlook, Apple Mail).

# 8.0.0 Implementation Considerations

## 8.1.0 Complexity Assessment

Medium

## 8.2.0 Complexity Factors

- Integration with an external service (AWS SES) requires handling API keys, credentials, and potential failures.
- Implementation of a secure token generation, storage, and expiry mechanism.
- Requires an asynchronous task runner to avoid blocking the user registration API call.
- Development and testing of a robust, cross-client compatible HTML email template.

## 8.3.0 Technical Risks

- Email deliverability issues (e.g., emails being marked as spam). Requires proper setup of SPF, DKIM, and DMARC records for the sending domain.
- Failure or latency in the external email service could impact the user experience.

## 8.4.0 Integration Points

- Backend User Service (NestJS): To create the user and trigger the process.
- Backend Notification Service (NestJS): To handle email construction and sending.
- AWS SES API: The external endpoint for sending the email.

# 9.0.0 Testing Requirements

## 9.1.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0 Test Scenarios

- Verify email is sent upon successful registration.
- Verify the content and link within the email are correct.
- Test the system's behavior when the email service is down.
- Verify the user's status is 'pending_verification' in the database after registration.

## 9.3.0 Test Data Needs

- A set of valid test email addresses.
- Access to a mail-trapping service (e.g., Mailtrap) for E2E testing environments.

## 9.4.0 Testing Tools

- Jest for unit/integration tests.
- Cypress or Playwright for E2E tests.
- Mailtrap or MailHog for capturing and inspecting emails in test environments.

# 10.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other developer
- Unit and integration tests implemented for the email sending logic, achieving >80% code coverage
- E2E test successfully registers a user and confirms the verification email is received in a mail-trapping service
- HTML email template is responsive and approved by UI/UX
- Security review of token generation logic is complete
- All infrastructure changes (e.g., SES configuration) are defined in Terraform
- Documentation for the email verification flow is created or updated
- Story deployed and verified in the staging environment

# 11.0.0 Planning Information

## 11.1.0 Story Points

5

## 11.2.0 Priority

🔴 High

## 11.3.0 Sprint Considerations

- This is a foundational story for the user activation flow and blocks subsequent verification stories (US-003).
- Requires AWS SES to be configured with a verified sending domain before development can be completed.

## 11.4.0 Release Impact

Critical for launch. The platform cannot onboard new users without this functionality.

