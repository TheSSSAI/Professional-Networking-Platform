# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-032 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Set a Custom Public Profile URL |
| As A User Story | As a professional user, I want to define a unique ... |
| User Persona | Any registered user of the platform who wants to p... |
| Business Value | Enhances user engagement and personal branding, ma... |
| Functional Area | User Profile Management |
| Story Theme | Profile Personalization and Sharing |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successfully set a custom URL for the first time

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user on the 'Edit Profile' page and I have not set a custom URL before

### 3.1.5 When

I enter a valid and available URL slug (e.g., 'jane-doe-dev') into the 'Public Profile URL' field and click 'Save'

### 3.1.6 Then

The system displays a success confirmation message, the new URL is saved to my profile, and navigating to '/in/jane-doe-dev' successfully loads my public profile page.

### 3.1.7 Validation Notes

Verify by checking the database for the saved slug and by accessing the URL directly in a new browser tab.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Attempt to set a custom URL that is already taken

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

I am a logged-in user on the 'Edit Profile' page

### 3.2.5 When

I enter a URL slug that is already in use by another user (e.g., 'john-smith')

### 3.2.6 Then

The system displays an inline error message stating 'This URL is already taken.' and the 'Save' button is disabled until the conflict is resolved.

### 3.2.7 Validation Notes

This check should be case-insensitive. Test with 'john-smith', 'John-Smith', and 'JOHN-SMITH'.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Attempt to set a custom URL with an invalid format

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I am a logged-in user on the 'Edit Profile' page

### 3.3.5 When

I enter a URL slug containing invalid characters (e.g., 'jane doe!' or 'jane_doe')

### 3.3.6 Then

The system displays an inline error message stating 'Only letters, numbers, and dashes are allowed.' and the 'Save' button is disabled.

### 3.3.7 Validation Notes

Test with spaces, underscores, and special characters like !, @, #, $.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Successfully edit an existing custom URL

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

I am a logged-in user on the 'Edit Profile' page and my current custom URL is '/in/old-url'

### 3.4.5 When

I change the URL slug to a new, valid, and available slug (e.g., 'new-url') and click 'Save'

### 3.4.6 Then

The system saves the new URL, navigating to '/in/new-url' loads my profile, and navigating to the old URL '/in/old-url' results in a 'Profile Not Found' (404) error.

### 3.4.7 Validation Notes

Verify the old URL is freed up and can be taken by another user.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Real-time validation feedback is provided as the user types

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

I am a logged-in user on the 'Edit Profile' page with focus on the custom URL field

### 3.5.5 When

I type into the field

### 3.5.6 Then

The system performs a debounced, real-time check and provides visual feedback (e.g., a checkmark for valid/available, an 'X' with an error message for invalid/taken).

### 3.5.7 Validation Notes

Ensure the check is not performed on every keystroke to avoid excessive server load. A debounce of 300-500ms is appropriate.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Attempt to use a reserved keyword as a custom URL

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

I am a logged-in user on the 'Edit Profile' page

### 3.6.5 When

I enter a reserved keyword (e.g., 'admin', 'search', 'settings') into the custom URL field

### 3.6.6 Then

The system displays an inline error message stating 'This URL is unavailable.' and the 'Save' button is disabled.

### 3.6.7 Validation Notes

Test against a predefined list of reserved system routes and keywords.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Custom URL is released upon account deletion

### 3.7.3 Scenario Type

Edge_Case

### 3.7.4 Given

A user with the custom URL '/in/to-be-deleted' exists

### 3.7.5 When

That user's account is permanently deleted from the system

### 3.7.6 Then

The custom URL 'to-be-deleted' becomes available for other users to claim.

### 3.7.7 Validation Notes

This requires an integration test with the account deletion feature (US-015).

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- An input field for the custom URL slug within the profile editing interface.
- A static text prefix displaying the base URL (e.g., 'platform.com/in/').
- An icon area for real-time validation feedback (check or 'X').
- A text area below the input for displaying specific error messages.

## 4.2.0 User Interactions

- User can only type into the slug portion of the URL.
- As the user types, validation occurs automatically after a short delay (debounce).
- The 'Save' button for the profile section is disabled if the custom URL field contains an invalid or unavailable value.

## 4.3.0 Display Requirements

- The user's current custom URL (if set) is pre-populated in the input field.
- Error messages must be clear, concise, and specific to the validation failure (format vs. availability).

## 4.4.0 Accessibility Needs

- The input field must have a correctly associated `<label>`.
- Validation feedback (both visual icons and text messages) must be accessible to screen readers using `aria-live` regions or similar techniques.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-URL-01

### 5.1.2 Rule Description

Custom profile URLs must be globally unique across all users, checked in a case-insensitive manner.

### 5.1.3 Enforcement Point

Server-side, upon submission of the profile edit form.

### 5.1.4 Violation Handling

The request is rejected with a '409 Conflict' status code and a user-facing error message is displayed.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-URL-02

### 5.2.2 Rule Description

Custom profile URLs must only contain alphanumeric characters and dashes (a-z, 0-9, -).

### 5.2.3 Enforcement Point

Client-side for immediate feedback and server-side for security and integrity.

### 5.2.4 Violation Handling

The request is rejected with a '400 Bad Request' status code and a user-facing error message is displayed.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-URL-03

### 5.3.2 Rule Description

A predefined list of keywords (e.g., 'admin', 'login', 'api') are reserved and cannot be used as custom URLs.

### 5.3.3 Enforcement Point

Server-side during validation.

### 5.3.4 Violation Handling

The request is rejected with a '409 Conflict' status code and a user-facing error message is displayed.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

- {'story_id': 'US-021', 'dependency_reason': 'This feature is part of the profile editing functionality and requires the existence of a profile edit page.'}

## 6.2.0 Technical Dependencies

- A database schema modification to the 'Profile' table to add a unique, indexed column for the URL slug.
- A backend API endpoint to handle the validation and updating of the custom URL.
- A global application routing mechanism capable of resolving '/in/:slug' to a user profile.

## 6.3.0 Data Dependencies

- A configurable list of reserved keywords that cannot be used as URL slugs.

## 6.4.0 External Dependencies

*No items available*

# 7.0.0 Non Functional Requirements

## 7.1.0 Performance

- The server-side uniqueness check API call must have a P95 latency of less than 100ms to support real-time validation.

## 7.2.0 Security

- All user input for the URL slug must be strictly sanitized on the server-side to prevent any injection vulnerabilities.
- The uniqueness check must be designed to prevent race conditions where two users could claim the same URL simultaneously.

## 7.3.0 Usability

- Feedback on URL validity and availability should be provided to the user in near real-time to minimize friction.

## 7.4.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0 Compatibility

- The feature must function correctly on all supported browsers (latest versions of Chrome, Firefox, Safari, Edge).

# 8.0.0 Implementation Considerations

## 8.1.0 Complexity Assessment

Medium

## 8.2.0 Complexity Factors

- Implementing a performant, debounced, real-time validation UI on the frontend.
- Handling the race condition for the uniqueness check on the backend (requires a transactional or locked operation).
- Modifying the core application routing to handle the new URL structure.
- Ensuring the database index on the URL slug column is optimized for fast, case-insensitive lookups.

## 8.3.0 Technical Risks

- Potential for performance degradation of the uniqueness check as the user base grows.
- Complexity in correctly handling race conditions could lead to data integrity issues if not implemented carefully.

## 8.4.0 Integration Points

- User Profile Service (for storing the URL).
- API Gateway (for routing profile requests).
- Frontend Application (for the UI and routing logic).

# 9.0.0 Testing Requirements

## 9.1.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Security

## 9.2.0 Test Scenarios

- Set, edit, and save a valid URL.
- Attempt to save a URL with invalid characters.
- Attempt to save a URL that is already taken by another user.
- Attempt to save a reserved keyword.
- Verify that an old URL is released and returns a 404 after being changed.
- Verify case-insensitivity of the uniqueness check.

## 9.3.0 Test Data Needs

- A set of user accounts with pre-assigned custom URLs.
- A set of user accounts without custom URLs.
- A defined list of reserved keywords for testing.

## 9.4.0 Testing Tools

- Jest/Vitest for unit tests.
- Supertest for API integration tests.
- Cypress/Playwright for E2E tests.
- k6/JMeter for performance testing the validation endpoint.

# 10.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% code coverage for the new logic.
- E2E tests for the happy path and key error conditions are implemented and passing.
- Performance of the validation endpoint is confirmed to be under 100ms P95 latency.
- Security review has been conducted to ensure no injection vulnerabilities and proper handling of race conditions.
- The feature is confirmed to be compliant with WCAG 2.1 AA standards.
- API documentation for the new/modified endpoints is created or updated.
- The database migration script has been successfully tested.

# 11.0.0 Planning Information

## 11.1.0 Story Points

5

## 11.2.0 Priority

🔴 High

## 11.3.0 Sprint Considerations

- The backend API contract should be defined early to allow for parallel frontend and backend development.
- The database schema change must be deployed before the application code that depends on it.

## 11.4.0 Release Impact

This is a key user-facing feature that improves the core value proposition of the platform. It should be communicated in release notes and marketing materials.

