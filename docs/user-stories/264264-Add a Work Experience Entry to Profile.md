# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-022 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Add a Work Experience Entry to Profile |
| As A User Story | As a Profile Owner, I want to add a new work exper... |
| User Persona | Any registered and logged-in user of the platform ... |
| Business Value | Increases profile completeness, which enhances use... |
| Functional Area | User Profile Management |
| Story Theme | Profile Building and Enhancement |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successfully add a past work experience entry

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user on my own profile page

### 3.1.5 When

I click the 'Add Experience' button, fill in all required fields (Company, Title, Start Date, End Date) with valid data, and click 'Save'

### 3.1.6 Then

the new work experience entry is added to my profile in the correct chronological order, a success confirmation is briefly displayed, and the entry form is closed.

### 3.1.7 Validation Notes

Verify the new entry is persisted in the database and correctly displayed on the profile page. The order should be reverse chronological (most recent first).

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Successfully add a current work experience entry

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am a logged-in user on my own profile page

### 3.2.5 When

I click the 'Add Experience' button, fill in Company, Title, Start Date, check the 'I currently work here' checkbox, and click 'Save'

### 3.2.6 Then

the new work experience entry is added to the top of my experience list, displaying 'Present' for the end date.

### 3.2.7 Validation Notes

Verify the End Date field is disabled or hidden when the checkbox is checked. The database should store a null or specific flag for the end date.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Attempt to save with missing required fields

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I have the 'Add Experience' form open

### 3.3.5 When

I attempt to save the form without filling in a required field, such as 'Title'

### 3.3.6 Then

the form submission is prevented, and an inline error message 'Title is required' is displayed next to the Title field.

### 3.3.7 Validation Notes

Test for each required field: Company, Title, Start Date. The API call should not be made.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Attempt to save with an invalid date range

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

I have the 'Add Experience' form open

### 3.4.5 When

I enter a Start Date that is chronologically after the End Date and click 'Save'

### 3.4.6 Then

the form submission is prevented, and an error message 'End date cannot be before the start date' is displayed.

### 3.4.7 Validation Notes

This validation must be performed on the client-side for immediate feedback and re-validated on the server-side.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Cancel adding a new work experience

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

I have the 'Add Experience' form open and have entered some data

### 3.5.5 When

I click the 'Cancel' button or close the modal

### 3.5.6 Then

the form is closed, and no changes are saved to my profile.

### 3.5.7 Validation Notes

Verify that no new entry is created in the database.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Network error during save operation

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

I have filled out the 'Add Experience' form with valid data

### 3.6.5 When

I click 'Save' and a network error occurs preventing the data from reaching the server

### 3.6.6 Then

a user-friendly error message (e.g., 'Failed to save experience. Please check your connection and try again.') is displayed, and the form remains open with the entered data intact.

### 3.6.7 Validation Notes

Simulate a network failure using browser developer tools or a testing framework.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- An 'Add' icon button in the 'Work Experience' section of the profile.
- A modal dialog for the entry form.
- Input fields: 'Company' (text), 'Title' (text).
- Date picker controls for 'Start Date' and 'End Date' (Month/Year selection).
- A checkbox: 'I currently work here'.
- A multi-line textarea for 'Description'.
- Buttons: 'Save' (primary action), 'Cancel' (secondary action).
- Inline error message containers next to each field.

## 4.2.0 User Interactions

- Clicking 'Add' opens the modal.
- Checking 'I currently work here' disables or hides the 'End Date' field.
- Clicking 'Save' with invalid data triggers inline validation messages.
- Clicking 'Save' with valid data closes the modal and updates the profile UI.
- Clicking 'Cancel' or the modal's close icon closes the modal without saving.

## 4.3.0 Display Requirements

- Saved experience entries must be displayed on the user's profile page.
- Entries should be listed in reverse chronological order (most recent first).
- Current positions should display 'Present' as the end date.

## 4.4.0 Accessibility Needs

- The form must be fully keyboard navigable (Tab, Shift+Tab, Enter, Esc).
- All form fields must have a corresponding `<label>` tag.
- Error messages must be programmatically linked to their respective input fields using `aria-describedby`.
- The modal must trap focus and be dismissible with the Escape key.
- Must comply with WCAG 2.1 Level AA standards.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-EXP-001

### 5.1.2 Rule Description

The start date of an experience entry must be before or the same as the end date.

### 5.1.3 Enforcement Point

Client-side validation on form submission and Server-side API validation.

### 5.1.4 Violation Handling

Prevent form submission and display a clear error message to the user.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-EXP-002

### 5.2.2 Rule Description

Company, Title, and Start Date are mandatory fields for a work experience entry.

### 5.2.3 Enforcement Point

Client-side validation on form submission and Server-side API validation.

### 5.2.4 Violation Handling

Prevent form submission and display inline error messages for each missing required field.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-006

#### 6.1.1.2 Dependency Reason

User must be authenticated to access and modify their own profile.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-021

#### 6.1.2.2 Dependency Reason

The core profile structure and UI page must exist to provide a location for the 'Work Experience' section and the 'Add' button.

## 6.2.0.0 Technical Dependencies

- A backend API endpoint (`POST /api/v1/profile/experience`) must be available to accept and persist new experience data.
- The database schema must include an 'Experience' table with a foreign key relationship to the 'Profile' table.
- A reusable modal component and date-picker component in the frontend component library.

## 6.3.0.0 Data Dependencies

- The user's profile ID is required to associate the new experience entry correctly.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for saving the experience must have a P95 latency of less than 200ms under nominal load (as per SRS-001-NFR 2.1.2).
- The profile page UI should update optimistically or immediately upon successful API response without requiring a full page reload.

## 7.2.0.0 Security

- All user-provided text (Company, Title, Description) must be sanitized on the server-side to prevent Cross-Site Scripting (XSS) attacks (as per SRS-001-NFR 2.3.1).
- The API endpoint must be protected and only allow a user to add experience to their own profile.

## 7.3.0.0 Usability

- The form should be intuitive, with clear labels and helpful placeholders.
- Date selection should be easy using a standard month/year picker.
- Feedback on save (success or failure) must be immediate and clear.

## 7.4.0.0 Accessibility

- Must adhere to WCAG 2.1 Level AA standards (as per SRS-001-NFR 2.4.3).

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported browsers (latest two versions of Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Standard CRUD (Create) operation.
- Frontend form development with client-side validation.
- Backend API endpoint with server-side validation and database interaction.
- Complexity is low as it follows well-established patterns.

## 8.3.0.0 Technical Risks

- Ensuring robust and consistent date validation logic across both client and server.
- Handling time zone considerations for dates, if applicable (decision should be to store all dates in UTC).

## 8.4.0.0 Integration Points

- Frontend Profile Component: To display the new data.
- Backend Profile Service: To handle the business logic.
- PostgreSQL Database: To persist the data.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify successful creation of past and current experience entries.
- Verify all validation rules (required fields, date logic) on both client and server.
- Verify UI updates correctly after saving.
- Verify keyboard navigation and screen reader compatibility for the form.
- Verify API endpoint security to prevent a user from adding experience to another user's profile.

## 9.3.0.0 Test Data Needs

- A test user account with an existing profile.
- Data sets for valid entries.
- Data sets for invalid entries (missing fields, invalid dates, oversized text).

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Supertest for backend API integration tests.
- Cypress or Playwright for E2E tests.
- Axe for accessibility audits.

# 10.0.0.0 Definition Of Done

- All acceptance criteria are validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit tests for frontend components and backend services are written and achieve >80% coverage.
- Integration tests for the API endpoint are implemented and passing.
- E2E test scenario for the happy path is automated and passing.
- UI/UX has been reviewed and approved by the design team.
- Accessibility audit (WCAG 2.1 AA) has been performed and passed.
- API endpoint is documented in the API specification.
- Story has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational feature for profile management and a prerequisite for editing (US-023) and deleting (US-024) work experience.
- Should be prioritized early in the development of the profile feature set.

## 11.4.0.0 Release Impact

- Enables a core functionality for users to build their professional identity on the platform. Critical for initial user adoption and engagement.

