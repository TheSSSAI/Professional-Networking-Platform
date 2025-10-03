# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-009 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | See Error for Incorrect Credentials during Login |
| As A User Story | As a registered user attempting to log in, I want ... |
| User Persona | Any registered or unregistered user attempting to ... |
| Business Value | Provides essential, actionable feedback to users, ... |
| Functional Area | User Authentication |
| Story Theme | User Account and Session Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Login attempt with a non-existent email address

### 3.1.3 Scenario Type

Error_Condition

### 3.1.4 Given

A user is on the login page

### 3.1.5 When

The user enters an email address that is not registered in the system, enters any password, and submits the form

### 3.1.6 Then

A single, generic error message such as 'Invalid email or password. Please try again.' is displayed to the user.

### 3.1.7 Validation Notes

Verify that the API returns a 401 Unauthorized status and the UI displays the specified error message. The message must not indicate that the email was not found.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Login attempt with a correct email but incorrect password

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

A registered and verified user is on the login page

### 3.2.5 When

The user enters their correct email address, enters an incorrect password, and submits the form

### 3.2.6 Then

The exact same generic error message from AC-001 is displayed to the user.

### 3.2.7 Validation Notes

Verify that the API returns a 401 Unauthorized status and the UI displays the identical error message. This is critical for security to prevent user enumeration.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

UI behavior after a failed login attempt

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

A user has submitted the login form with invalid credentials

### 3.3.5 When

The error message is displayed

### 3.3.6 Then

The user remains on the login page, the email input field retains the value the user entered, and the password input field is cleared.

### 3.3.7 Validation Notes

Manually test or use an E2E test to confirm the state of the form fields after the error is shown.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Failed login attempt is logged for security auditing

### 3.4.3 Scenario Type

Security

### 3.4.4 Given

A user attempts to log in with incorrect credentials

### 3.4.5 When

The system processes the failed authentication attempt

### 3.4.6 Then

A 'failed login' event is recorded in the security audit trail, including the target email address, source IP address, and a timestamp, as per SRS-2.3.6.

### 3.4.7 Validation Notes

Check the audit log table or system to ensure a new entry is created for each failed attempt.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Error message is accessible

### 3.5.3 Scenario Type

Accessibility

### 3.5.4 Given

A user is on the login page

### 3.5.5 When

A login error message is displayed

### 3.5.6 Then

The error message is programmatically associated with the relevant form inputs and is announced by screen readers.

### 3.5.7 Validation Notes

Use a screen reader (e.g., NVDA, VoiceOver) or browser accessibility tools to verify that the error is announced when focus is on the form.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- An error message container, visually distinct from other UI elements (e.g., red text).

## 4.2.0 User Interactions

- On form submission failure, the error message appears.
- The password field is automatically cleared after a failed attempt.

## 4.3.0 Display Requirements

- The error message must be clear, concise, and avoid technical jargon.
- The message must be displayed in a prominent location close to the login button or form fields.

## 4.4.0 Accessibility Needs

- Error message must meet WCAG 2.1 Level AA contrast requirements.
- Use of ARIA attributes (e.g., `aria-describedby`, `role='alert'`) to ensure the error is communicated to assistive technologies.

# 5.0.0 Business Rules

- {'rule_id': 'BR-AUTH-001', 'rule_description': 'Authentication error messages must be generic and not reveal whether the username or password was the incorrect part of the credential pair.', 'enforcement_point': 'Backend Authentication Service', 'violation_handling': "A specific error message (e.g., 'User not found') is a security vulnerability (user enumeration) and must be rejected in code review and security testing."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-001

#### 6.1.1.2 Dependency Reason

Requires the user registration system to be in place to have valid accounts to test against.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-006

#### 6.1.2.2 Dependency Reason

This story defines the primary error path for the login functionality. The login form UI and basic API endpoint must exist.

## 6.2.0.0 Technical Dependencies

- Authentication microservice with access to the user database.
- A secure password hashing and comparison mechanism (e.g., bcrypt).
- Centralized logging service for security audit trails.

## 6.3.0.0 Data Dependencies

- Test user accounts with known passwords must be available in the testing environment.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response for a failed login must adhere to the P95 latency target of < 200ms (SRS-2.1.2).

## 7.2.0.0 Security

- The system must use a constant-time algorithm for password hash comparison to mitigate timing attacks.
- All failed login attempts must be logged in the audit trail (SRS-2.3.6).
- The API must return a 401 Unauthorized status code for this specific failure type.

## 7.3.0.0 Usability

- The error message should be easily understandable by non-technical users.
- Retaining the email address in the form after an error reduces user effort to correct a password typo.

## 7.4.0.0 Accessibility

- Error message must comply with WCAG 2.1 Level AA standards (SRS-2.4.3).

## 7.5.0.0 Compatibility

- The error message display and form behavior must be consistent across all supported browsers and devices.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Standard authentication logic.
- Requires coordination between frontend (displaying the error) and backend (returning the correct status and message).
- Integration with the audit logging system.

## 8.3.0.0 Technical Risks

- Risk of implementing an insecure error message that leaks user data (user enumeration). This must be a key focus during code review and testing.

## 8.4.0.0 Integration Points

- Frontend Login Component -> API Gateway -> Authentication Service
- Authentication Service -> User Database (PostgreSQL)
- Authentication Service -> Audit Log Service

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- Submit with an unregistered email.
- Submit with a registered email and incorrect password.
- Verify the audit log is updated after each failed attempt.
- Verify the password field is cleared and the email field is not.
- Use a screen reader to confirm the error message is announced.

## 9.3.0.0 Test Data Needs

- A set of valid user credentials.
- A list of email addresses that are known not to be registered.

## 9.4.0.0 Testing Tools

- Jest/Vitest for unit tests.
- Supertest for API integration tests.
- Cypress/Playwright for E2E tests.
- NVDA/VoiceOver for accessibility testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other developer, with a specific check for the generic error message implementation
- Unit tests implemented for the authentication logic with >80% coverage
- Integration tests for the login API endpoint are passing
- E2E tests confirm the correct UI behavior on login failure
- Security review confirms protection against user enumeration and timing attacks
- Accessibility of the error message is verified against WCAG 2.1 AA
- Documentation for the login API endpoint's error response is updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

1

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical path story for the login feature and should be completed in the same sprint as US-006 (User Login).
- The security requirements are non-negotiable and must be fully implemented and tested.

## 11.4.0.0 Release Impact

Essential for the initial public launch. The platform cannot go live without this basic security and usability feature.

