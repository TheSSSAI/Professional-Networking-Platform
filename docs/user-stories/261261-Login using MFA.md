# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-019 |
| Elaboration Date | 2025-01-17 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Login using MFA |
| As A User Story | As a security-conscious user who has enabled Multi... |
| User Persona | A registered user who has already successfully ena... |
| Business Value | Enhances account security, mitigates the risk of a... |
| Functional Area | User Authentication and Authorization |
| Story Theme | Account Security Enhancements |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful login with a valid MFA code

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A user with MFA enabled has successfully submitted their correct email and password

### 3.1.5 When

The user is presented with the MFA verification screen and enters the correct, current 6-digit code from their authenticator app and submits the form

### 3.1.6 Then

The system validates the code, completes the login process, issues new session tokens (access and refresh), and redirects the user to their main news feed page.

### 3.1.7 Validation Notes

Verify that a valid JWT is returned and the user is redirected to the authenticated part of the application.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Login attempt with an invalid or expired MFA code

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

A user with MFA enabled is on the MFA verification screen

### 3.2.5 When

The user enters an incorrect or expired 6-digit code and submits the form

### 3.2.6 Then

The system rejects the code and displays a clear error message, such as 'Invalid verification code. Please try again.' The user remains on the MFA verification screen, and the input field is cleared.

### 3.2.7 Validation Notes

Confirm no session token is issued and the user is not logged in. The error message should be user-friendly and not reveal specific failure reasons (e.g., 'code expired' vs 'code wrong').

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Rate limiting is triggered after multiple failed MFA attempts

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

A user with MFA enabled is on the MFA verification screen and has made 4 consecutive failed attempts

### 3.3.5 When

The user enters an incorrect code for the 5th consecutive time

### 3.3.6 Then

The system temporarily locks the account from further login attempts for 15 minutes and displays a message like 'Too many failed attempts. Please try again in 15 minutes.'

### 3.3.7 Validation Notes

Test that subsequent login attempts (even with correct credentials) are blocked for the specified duration. This must be enforced server-side.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Standard login flow for a user without MFA enabled

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

A user who does NOT have MFA enabled on their account

### 3.4.5 When

The user successfully enters their correct email and password on the login page

### 3.4.6 Then

The system logs them in directly and redirects them to their main news feed page, without presenting the MFA verification screen.

### 3.4.7 Validation Notes

Verify that the MFA step is correctly bypassed for non-MFA users.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Client-side validation for MFA code format

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

A user is on the MFA verification screen

### 3.5.5 When

The user attempts to enter non-numeric characters or fewer/more than 6 digits into the code input field

### 3.5.6 Then

The UI prevents the input of invalid characters and the submission button remains disabled until a 6-digit numeric code is entered.

### 3.5.7 Validation Notes

This should be tested on the frontend. The backend must also validate the format as a security measure.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated screen/modal for MFA code entry.
- A text input field specifically for a 6-digit numeric code.
- A primary action button labeled 'Verify' or 'Submit'.
- A clear instruction label, e.g., 'Enter the 6-digit code from your authenticator app.'
- An area to display error messages.

## 4.2.0 User Interactions

- After successful password submission, the user is automatically redirected to the MFA screen.
- The code input field should be auto-focused upon page load.
- Pressing 'Enter' in the input field should trigger the form submission.

## 4.3.0 Display Requirements

- The screen must clearly indicate that it is the second step of the login process.
- Error messages must be displayed prominently near the input field.

## 4.4.0 Accessibility Needs

- The input field must have a proper `<label>` for screen readers.
- Error messages must be associated with the input field using `aria-describedby`.
- The screen must be fully navigable using a keyboard.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-MFA-001

### 5.1.2 Rule Description

An MFA code (TOTP) is valid for a single time window (typically 30 seconds) and a small grace period (e.g., one preceding window) to account for clock skew.

### 5.1.3 Enforcement Point

Server-side during the MFA code validation process.

### 5.1.4 Violation Handling

The code is considered invalid, and the login attempt is rejected.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-MFA-002

### 5.2.2 Rule Description

A maximum of 5 consecutive failed MFA attempts are allowed before a temporary account lockout is enforced.

### 5.2.3 Enforcement Point

Server-side, tracked per user account, likely using a Redis cache.

### 5.2.4 Violation Handling

The account is locked for login attempts for 15 minutes. An error message is displayed to the user.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-006

#### 6.1.1.2 Dependency Reason

The standard login flow with email and password must be functional before the MFA step can be added to it.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-018

#### 6.1.2.2 Dependency Reason

Users must be able to enable MFA and have a secret key stored in the system before they can use it to log in. This story provides the setup mechanism.

## 6.2.0.0 Technical Dependencies

- Authentication service must be capable of handling a multi-step login flow.
- A server-side library for TOTP validation (e.g., speakeasy for Node.js).
- A Redis cache for implementing rate limiting, as per SRS-001-NFR (2.6.6).

## 6.3.0.0 Data Dependencies

- The `User` entity in the database must have a field to store the MFA secret key (encrypted) and a boolean flag indicating if MFA is enabled.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The MFA code validation API endpoint must have a P95 latency of less than 200ms, consistent with SRS-001-NFR (2.1.2).

## 7.2.0.0 Security

- All communication must be over HTTPS/TLS 1.3.
- MFA validation must be performed exclusively on the server-side.
- The system must protect against brute-force attacks on the MFA endpoint via strict rate limiting.
- The TOTP validation logic must account for minor clock drift between the server and the user's device.

## 7.3.0.0 Usability

- The MFA step should feel like a seamless part of the login flow, not a jarring interruption.

## 7.4.0.0 Accessibility

- The MFA verification screen must comply with WCAG 2.1 Level AA standards, as per SRS-001-NFR (2.4.3).

## 7.5.0.0 Compatibility

- The feature must work correctly on all supported browsers (latest versions of Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Modifying the state machine of the core authentication flow.
- Secure implementation of server-side TOTP validation logic.
- Implementing robust, stateful rate limiting.
- Frontend state management to handle the intermediate step between password validation and full authentication.

## 8.3.0.0 Technical Risks

- Incorrect TOTP validation logic could lead to valid codes being rejected or, worse, invalid codes being accepted.
- Time synchronization issues between servers or between server and client device could cause validation failures.
- The temporary authentication state (post-password, pre-MFA) must be managed securely to prevent bypass attacks.

## 8.4.0.0 Integration Points

- Frontend Login Component.
- Backend Authentication Service.
- Redis Caching Service (for rate limiting).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify successful login for an MFA-enabled user.
- Verify successful login for a non-MFA user.
- Verify login failure with an incorrect MFA code.
- Verify login failure with an expired MFA code.
- Verify account lockout after 5 failed MFA attempts.
- Verify that the lockout period expires correctly.
- Verify that a user cannot bypass the MFA step after entering a correct password.

## 9.3.0.0 Test Data Needs

- At least two test accounts: one with MFA enabled, one without.
- For the MFA-enabled account, the QA team needs access to the secret key or a QR code to set it up in their own authenticator app.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Supertest for API integration tests.
- Cypress or Playwright for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% coverage for the new logic.
- E2E tests for both MFA and non-MFA login flows are passing.
- A security review of the implementation has been conducted, specifically checking for rate-limiting bypass and state management vulnerabilities.
- The UI is responsive and meets accessibility standards (WCAG 2.1 AA).
- API performance meets the P95 < 200ms latency requirement under load.
- Relevant documentation (API specs, testing notes) has been updated.
- The feature has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is blocked by US-018 (Enable MFA) and cannot be started until it is complete.
- Requires coordinated effort between frontend and backend developers. A clear API contract for the MFA verification endpoint should be defined early.

## 11.4.0.0 Release Impact

This is a major security feature. Its release should be communicated to users who may be interested in enabling MFA.

