# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-023 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Edit a Work Experience Entry on Profile |
| As A User Story | As a registered user managing my professional prof... |
| User Persona | Any registered and authenticated user of the platf... |
| Business Value | Enhances data accuracy and relevance on the platfo... |
| Functional Area | User Profile Management |
| Story Theme | Profile Completeness and Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successfully edit and save a work experience entry

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user viewing my own profile page, and I have an existing work experience entry

### 3.1.5 When

I click the 'edit' action for that entry, modify the 'Title' field in the presented form, and click 'Save'

### 3.1.6 Then

The editing form closes, my profile page updates to display the new title for that work experience entry, and the change is persisted in the database.

### 3.1.7 Validation Notes

Verify via UI inspection and by checking the database record for the updated value.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Cancel editing a work experience entry

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

I am editing a work experience entry and have made changes to the data in the form

### 3.2.5 When

I click the 'Cancel' button or close the editing interface without saving

### 3.2.6 Then

The editing form closes, my profile page displays the original, unchanged information for that entry, and no changes are saved to the database.

### 3.2.7 Validation Notes

Verify that the UI reverts to the original state and the database record remains unchanged.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Attempt to save with an invalid date range

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I am editing a work experience entry

### 3.3.5 When

I set the 'End Date' to be chronologically before the 'Start Date' and click 'Save'

### 3.3.6 Then

A user-friendly validation error message is displayed (e.g., 'End date cannot be before the start date'), the form remains open for correction, and the data is not saved.

### 3.3.7 Validation Notes

Trigger the validation and confirm the error message appears and the API call to save is not made or is rejected.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Attempt to save with a required field empty

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

I am editing a work experience entry

### 3.4.5 When

I clear the content of a required field, such as 'Company' or 'Title', and click 'Save'

### 3.4.6 Then

A validation error message is displayed indicating the required field is empty, the form remains open, and the data is not saved.

### 3.4.7 Validation Notes

Test for each required field (Company, Title, Start Date).

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Attempt to save with fields exceeding character limits

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

I am editing a work experience entry

### 3.5.5 When

I enter text into the 'Title' or 'Description' field that exceeds its defined character limit and click 'Save'

### 3.5.6 Then

A validation error message is displayed indicating the field and its character limit, the form remains open, and the data is not saved.

### 3.5.7 Validation Notes

Refer to SRS-001-F2.1 for character limits. Test both client-side and server-side validation.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Unauthorized attempt to edit another user's profile

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

I am a logged-in user viewing the profile of another user

### 3.6.5 When

I inspect the page for work experience entries

### 3.6.6 Then

The 'edit' action/icon is not visible or is disabled, and any direct API call to the update endpoint for that user's data must be rejected with a 403 Forbidden status.

### 3.6.7 Validation Notes

Requires both UI inspection and a direct API test using tools like Postman or cURL.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- An 'Edit' icon (e.g., pencil icon) next to each work experience entry on the user's own profile.
- A modal or inline form for editing, containing fields for Company, Title, Dates (Start/End), and Description.
- Clearly labeled 'Save' and 'Cancel' buttons within the editing form.
- Inline validation error messages next to the relevant fields.

## 4.2.0 User Interactions

- Clicking the 'Edit' icon opens the editing interface pre-populated with the existing data.
- The 'Save' button should ideally be disabled until a change is made to the form data.
- Clicking 'Cancel' or the modal's close icon discards changes and closes the form.

## 4.3.0 Display Requirements

- The editing form must accurately reflect the current data of the selected work experience entry upon opening.
- Upon successful save, the profile view must immediately update to show the new information.

## 4.4.0 Accessibility Needs

- The 'Edit' icon must have an accessible name (e.g., 'aria-label="Edit work experience at [Company Name]"').
- The editing modal/form must be fully keyboard-navigable.
- Validation errors must be programmatically associated with their respective form fields and announced by screen readers.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-001

### 5.1.2 Rule Description

A user can only edit their own work experience entries.

### 5.1.3 Enforcement Point

Backend API (Authorization Middleware)

### 5.1.4 Violation Handling

The API request is rejected with a 403 Forbidden HTTP status code.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-002

### 5.2.2 Rule Description

Employment start and end dates must be logically valid (End Date >= Start Date).

### 5.2.3 Enforcement Point

Client-side form validation and Backend API data validation.

### 5.2.4 Violation Handling

A validation error is returned to the user, and the save operation is blocked.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-003

### 5.3.2 Rule Description

Company, Title, and Start Date fields are mandatory for a work experience entry.

### 5.3.3 Enforcement Point

Client-side form validation and Backend API data validation.

### 5.3.4 Violation Handling

A validation error is returned to the user, and the save operation is blocked.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-022

#### 6.1.1.2 Dependency Reason

A work experience entry must first be created before it can be edited.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-006

#### 6.1.2.2 Dependency Reason

User must be authenticated to access their profile and perform edit actions.

## 6.2.0.0 Technical Dependencies

- A secure backend API endpoint (e.g., PATCH /api/profiles/me/experience/{experienceId}) for updating a work experience record.
- Frontend state management solution to handle form data and UI updates.
- Authentication service to verify user identity and ownership of the profile.

## 6.3.0.0 Data Dependencies

- Requires the existence of a user profile and at least one work experience record in the database associated with that user.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for saving the update must respond with a P95 latency of less than 200ms as per SRS-001-NFR 2.1.2.
- The editing form should load instantly upon clicking the 'edit' icon.

## 7.2.0.0 Security

- The backend must perform an ownership check to ensure the authenticated user owns the profile being modified.
- All user-provided input must be sanitized on the server-side to prevent Cross-Site Scripting (XSS) attacks, as per OWASP Top 10 guidelines (SRS-001-NFR 2.3.1).

## 7.3.0.0 Usability

- The editing process should be intuitive, with clear affordances for editing, saving, and canceling.
- Error messages must be clear, concise, and guide the user toward a solution.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards (SRS-001-NFR 2.4.3).

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported browsers and devices as defined in the project's scope.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Standard CRUD (Update) operation.
- Requires both client-side and server-side validation logic.
- State management for the editing form/modal.
- Robust security check on the backend is critical.

## 8.3.0.0 Technical Risks

- Potential for insecure object reference if the ownership check on the backend is not implemented correctly, allowing users to edit others' data.
- Inconsistent validation logic between the client and server could lead to a poor user experience.

## 8.4.0.0 Integration Points

- Frontend Profile Component -> Backend Profile API
- Backend Profile Service -> Authentication Service
- Backend Profile Service -> PostgreSQL Database

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify successful editing of all fields.
- Verify cancellation of edits.
- Test all validation rules (invalid dates, empty required fields, max length).
- Automate an E2E test where a user logs in, edits an experience, saves, and verifies the change.
- Perform a security test by attempting to call the update API endpoint with an authenticated user for a profile they do not own.

## 9.3.0.0 Test Data Needs

- A test user account with a pre-populated profile including at least two work experience entries.
- A second test user account to test unauthorized access scenarios.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- A backend testing framework (e.g., Jest for NestJS) for API unit/integration tests.
- Cypress or Playwright for E2E tests.
- Postman or cURL for direct API security testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other developer
- Unit and integration tests implemented with >80% code coverage for the new logic
- E2E tests for the happy path and cancellation flow are passing
- User interface reviewed for consistency and usability by a designer or product owner
- Security checks on the backend are verified and tested
- Accessibility requirements (WCAG 2.1 AA) have been met and verified
- Relevant API documentation is updated
- Story deployed and verified in the staging environment without regressions

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is dependent on US-022 (Add Work Experience) and cannot be started until it is complete.
- Requires both frontend and backend development effort, which can be parallelized after the API contract is defined.

## 11.4.0.0 Release Impact

This is a core feature for profile management. Its inclusion is essential for a minimum viable product (MVP) related to user profiles.

