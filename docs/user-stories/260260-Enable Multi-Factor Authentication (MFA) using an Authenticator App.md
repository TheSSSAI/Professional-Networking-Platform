# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-018 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Enable Multi-Factor Authentication (MFA) using an ... |
| As A User Story | As a security-conscious user, I want to set up and... |
| User Persona | A user who is proactive about account security and... |
| Business Value | Enhances platform security, reduces the risk of ac... |
| Functional Area | User Account Management & Security |
| Story Theme | Account Security Enhancements |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful MFA Enablement (Happy Path)

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user on my account's security settings page and MFA is currently disabled

### 3.1.5 When

I click the 'Enable Multi-Factor Authentication' option

### 3.1.6 Then

The system presents a setup screen displaying a unique QR code and a corresponding secret key in text format. I am prompted to enter a 6-digit verification code from my authenticator app.

### 3.1.7 Validation Notes

Verify the QR code is scannable and the secret key is valid for TOTP generation.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Successful Verification and Activation

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am on the MFA setup screen after scanning the QR code with my authenticator app

### 3.2.5 When

I enter the correct, current 6-digit code from my app and submit the form

### 3.2.6 Then

The system validates the code, displays a success message, and presents me with a list of single-use recovery codes. The system prompts me to save these codes securely. My account's MFA status is now set to 'Enabled'.

### 3.2.7 Validation Notes

Check the database to confirm the user's MFA status is updated and hashed recovery codes are stored.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Entering an Incorrect Verification Code

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I am on the MFA setup screen

### 3.3.5 When

I enter an incorrect or expired 6-digit code and submit the form

### 3.3.6 Then

The system displays an inline error message like 'Invalid verification code. Please try again.' and does not enable MFA. My account's MFA status remains 'Disabled'.

### 3.3.7 Validation Notes

The system must not reveal whether the failure was due to a wrong user or wrong code. The setup process should not be terminated, allowing for another attempt.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Canceling the MFA Setup Process

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

I have started the MFA setup process and am on the QR code screen

### 3.4.5 When

I navigate away from the page or click a 'Cancel' button

### 3.4.6 Then

The MFA setup process is aborted, any temporary secrets are discarded, and my account's MFA status remains 'Disabled'.

### 3.4.7 Validation Notes

Verify that no partial MFA configuration is saved for the user.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

MFA is Already Enabled

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

I am a logged-in user on my account's security settings page

### 3.5.5 When

I view the MFA section

### 3.5.6 Then

The system shows that MFA is already 'Enabled' and provides an option to 'Disable MFA' instead of 'Enable MFA'.

### 3.5.7 Validation Notes

The setup flow (AC-001) should not be accessible if MFA is already active.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- An 'Enable MFA' button on the security settings page.
- A modal or dedicated page for the setup process.
- A clearly rendered QR code image.
- A display for the secret key with a 'Copy' button.
- An input field for the 6-digit verification code.
- A 'Submit' or 'Verify' button.
- A screen to display recovery codes with 'Copy' and 'Download' buttons.

## 4.2.0 User Interactions

- User clicks to initiate the setup flow.
- User scans QR code or copies key into their authenticator app.
- User enters the generated code to verify.
- User is required to acknowledge they have saved the recovery codes before completing the flow.

## 4.3.0 Display Requirements

- Clear instructions must be provided at each step of the setup process.
- The current status of MFA (Enabled/Disabled) must be clearly visible on the security settings page.

## 4.4.0 Accessibility Needs

- The secret key must be provided as text for users who cannot use a QR code scanner.
- All form fields and buttons must have proper labels and be keyboard-navigable, adhering to WCAG 2.1 AA standards.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-MFA-001

### 5.1.2 Rule Description

The TOTP secret key is unique per user and should only be displayed during the setup process.

### 5.1.3 Enforcement Point

Backend service during MFA setup initiation.

### 5.1.4 Violation Handling

The key should never be retrievable or displayed again after the initial setup is complete.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-MFA-002

### 5.2.2 Rule Description

Recovery codes are single-use only.

### 5.2.3 Enforcement Point

Backend authentication service during login with a recovery code.

### 5.2.4 Violation Handling

Once a recovery code is used, it must be invalidated and cannot be used again.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-MFA-003

### 5.3.2 Rule Description

The verification code input must be rate-limited to prevent brute-force attacks.

### 5.3.3 Enforcement Point

API endpoint for MFA code verification.

### 5.3.4 Violation Handling

After 5 failed attempts within 15 minutes, the user's account should be temporarily locked from further MFA setup attempts for 30 minutes.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-006

#### 6.1.1.2 Dependency Reason

User must be able to log in to access account settings.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

A story for creating the 'Security Settings' page must be completed first.

#### 6.1.2.2 Dependency Reason

A dedicated UI location is needed to host the 'Enable MFA' functionality.

## 6.2.0.0 Technical Dependencies

- A server-side library for TOTP generation and validation (e.g., 'speakeasy' for Node.js).
- Database schema modification to the 'User' table (or a related table) to store the encrypted MFA secret and an enabled/disabled flag.
- A new database table to store hashed recovery codes.

## 6.3.0.0 Data Dependencies

*No items available*

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The QR code and secret key generation must complete in under 200ms.
- The server-side verification of the TOTP code must have a P95 latency of less than 150ms.

## 7.2.0.0 Security

- The MFA secret key must be stored encrypted at rest in the database.
- Communication between client and server during setup must be over HTTPS/TLS 1.3.
- The secret key must never be exposed in client-side logs or stored in browser local storage.
- Recovery codes must be stored as hashes, not plaintext.
- The system must adhere to OWASP guidelines for authentication.

## 7.3.0.0 Usability

- The setup process should be intuitive and require minimal technical knowledge from the user.
- Error messages must be clear and actionable.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The setup process must be compatible with standard TOTP authenticator apps (e.g., Google Authenticator, Microsoft Authenticator, Authy).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires secure handling and storage of cryptographic secrets.
- Involves modifications to the core authentication logic.
- Requires a multi-step frontend user flow with careful state management.
- Needs a robust recovery mechanism (recovery codes) to prevent user lockout.

## 8.3.0.0 Technical Risks

- Improper implementation could lead to major security vulnerabilities.
- Risk of users losing both their authenticator and recovery codes, leading to account lockout and support overhead.

## 8.4.0.0 Integration Points

- Integrates with the core User Authentication service.
- Requires changes to the PostgreSQL database schema.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify successful MFA setup with a real authenticator app.
- Test failure case with incorrect verification codes.
- Test rate limiting by submitting multiple incorrect codes.
- Verify that canceling the flow does not enable MFA.
- Confirm that the UI updates correctly after MFA is enabled.

## 9.3.0.0 Test Data Needs

- Test user accounts with MFA disabled.
- Test user accounts with MFA already enabled.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Cypress or Playwright for E2E tests.
- OWASP ZAP or similar for security scanning.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least two peers
- Unit and integration tests implemented with >80% code coverage for new logic
- E2E tests for the full setup flow are passing
- User interface reviewed and approved by UX/UI designer
- Security review completed and any findings addressed
- Documentation for the MFA setup flow is created for the user help center
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a blocker for US-019 (Login using MFA). Both should be planned in close succession.
- Requires both frontend and backend development effort, which should be coordinated.

## 11.4.0.0 Release Impact

This is a major security feature. Its release should be highlighted to users to encourage adoption.

