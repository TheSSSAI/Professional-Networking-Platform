# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-025 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Add an Education Entry to Profile |
| As A User Story | As a Profile Builder, I want to add a new educatio... |
| User Persona | Any registered user of the platform who wants to b... |
| Business Value | Enriches user profiles, making the platform more v... |
| Functional Area | User Profile Management |
| Story Theme | Profile Completeness |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successfully add a complete education entry with a defined end date

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user on my profile editing page

### 3.1.5 When

I click to add a new education entry, fill in all required fields (Institution, Degree, Field of Study, Start Date, End Date) with valid data, and click 'Save'

### 3.1.6 Then

The new education entry is saved, appears correctly in the 'Education' section of my profile, and a success confirmation message is briefly displayed.

### 3.1.7 Validation Notes

Verify the record is created in the 'Education' table in the database, associated with the correct user profile. The profile page UI should update to show the new entry.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Successfully add an education entry for current studies

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am a logged-in user on the 'Add Education' form

### 3.2.5 When

I fill in the required fields, check the 'I currently study here' box, and click 'Save'

### 3.2.6 Then

The 'End Date' field is disabled or hidden, and the saved entry displays the start date followed by 'Present' (or a similar indicator).

### 3.2.7 Validation Notes

Verify the database stores the end date as NULL or a special value. The UI must render 'Present' instead of an end date.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Attempt to save an education entry with missing required fields

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I am a logged-in user on the 'Add Education' form

### 3.3.5 When

I attempt to save the form without filling in a required field, such as 'Institution'

### 3.3.6 Then

The form submission is prevented, and an inline validation error message (e.g., 'Institution is required') appears next to the empty required field.

### 3.3.7 Validation Notes

Test this for each required field (Institution, Degree, Field of Study, Start Date). No API call should be made.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Attempt to save an education entry with an invalid date range

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

I am a logged-in user on the 'Add Education' form

### 3.4.5 When

I enter an 'End Date' that is chronologically before the 'Start Date' and click 'Save'

### 3.4.6 Then

The form submission is prevented, and a validation error message is displayed, such as 'End date cannot be before the start date'.

### 3.4.7 Validation Notes

This validation should be present on both the client-side for immediate feedback and the server-side for data integrity.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Cancel adding a new education entry

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

I am a logged-in user on the 'Add Education' form and have entered some data

### 3.5.5 When

I click the 'Cancel' button

### 3.5.6 Then

The form closes, no data is saved, and I am returned to my profile editing view.

### 3.5.7 Validation Notes

Verify that no new record was created in the database.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Attempt to save an education entry with a start date in the future

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

I am a logged-in user on the 'Add Education' form

### 3.6.5 When

I enter a 'Start Date' that is in the future and click 'Save'

### 3.6.6 Then

The form submission is prevented, and a validation error message is displayed, such as 'Start date cannot be in the future'.

### 3.6.7 Validation Notes

Server-side validation is critical for this rule.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- An 'Add' button/icon within the 'Education' section of the profile edit view.
- A modal or dedicated form for adding an education entry.
- Input fields for: Institution (text), Degree (text), Field of Study (text).
- Date pickers (Month/Year selectors) for Start Date and End Date.
- A checkbox labeled 'I currently study here'.
- 'Save' and 'Cancel' buttons.

## 4.2.0 User Interactions

- Clicking the 'Add' button opens the form.
- Checking 'I currently study here' disables or hides the End Date picker.
- Clicking 'Save' triggers validation and, if successful, submits the form, closes it, and updates the profile view.
- Clicking 'Cancel' closes the form without saving.

## 4.3.0 Display Requirements

- Saved education entries should be listed chronologically on the user's profile.
- Each entry must clearly display the institution, degree, field of study, and dates.
- Inline, user-friendly error messages must appear for validation failures.

## 4.4.0 Accessibility Needs

- The form must be fully navigable using a keyboard.
- All form fields must have associated `<label>` tags for screen reader compatibility.
- Error messages must be programmatically associated with their respective input fields.
- The modal must properly manage focus, trapping it within the modal when open and returning it to the trigger button on close.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-EDU-001

### 5.1.2 Rule Description

The End Date of an education entry cannot be before its Start Date.

### 5.1.3 Enforcement Point

Client-side form validation and Server-side API validation.

### 5.1.4 Violation Handling

Prevent form submission and display a clear error message to the user.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-EDU-002

### 5.2.2 Rule Description

Institution, Degree, Field of Study, and Start Date are mandatory fields.

### 5.2.3 Enforcement Point

Client-side form validation and Server-side API validation.

### 5.2.4 Violation Handling

Prevent form submission and display an error message indicating which fields are required.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-EDU-003

### 5.3.2 Rule Description

The Start Date cannot be in the future.

### 5.3.3 Enforcement Point

Client-side form validation and Server-side API validation.

### 5.3.4 Violation Handling

Prevent form submission and display a clear error message to the user.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

- {'story_id': 'US-021', 'dependency_reason': "This story requires the existence of a user profile and a profile editing interface where the 'Add Education' functionality can be initiated."}

## 6.2.0 Technical Dependencies

- A backend API endpoint (e.g., POST /api/v1/profile/education) for creating education records.
- Database schema migration to create the 'Education' table with a foreign key to the 'Profile' table.
- Frontend UI component library (MUI) for the modal and form elements.

## 6.3.0 Data Dependencies

- Requires the authenticated user's profile ID to associate the new education entry correctly.

## 6.4.0 External Dependencies

*No items available*

# 7.0.0 Non Functional Requirements

## 7.1.0 Performance

- The API call to save the education entry must have a P95 latency of less than 200ms as per SRS-001-NFR 2.1.2.

## 7.2.0 Security

- All user-provided text input must be sanitized on the server-side to prevent Cross-Site Scripting (XSS) attacks, as per SRS-001-NFR 2.3.1.
- The API endpoint must be secured, ensuring only the authenticated owner of the profile can add an education entry to it.

## 7.3.0 Usability

- The form should be intuitive, with clear labels and minimal friction for the user.
- Date selection should be easy using standardized date pickers.

## 7.4.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards, as per SRS-001-NFR 2.4.3.

## 7.5.0 Compatibility

- The form and its components must render and function correctly on all supported browsers (latest versions of Chrome, Firefox, Safari, Edge).

# 8.0.0 Implementation Considerations

## 8.1.0 Complexity Assessment

Medium

## 8.2.0 Complexity Factors

- Requires coordinated changes across frontend, backend, and database.
- Implementation of robust, user-friendly validation logic for dates on both client and server.
- Creating a reusable and accessible form modal component.

## 8.3.0 Technical Risks

- Potential for inconsistent validation logic between the client and server.
- Accessibility issues in the modal and form components if not carefully implemented.
- Date and time zone handling could introduce subtle bugs if not managed consistently.

## 8.4.0 Integration Points

- Frontend Profile Component -> Backend Education Service API
- Backend Education Service -> PostgreSQL Database

# 9.0.0 Testing Requirements

## 9.1.0 Testing Types

- Unit
- Integration
- E2E
- Accessibility

## 9.2.0 Test Scenarios

- Verify successful creation of an education entry with past dates.
- Verify successful creation of an entry for current studies ('Present' end date).
- Test all validation rules: required fields, invalid date ranges, future start date.
- Test the 'Cancel' functionality to ensure no data is persisted.
- E2E test: User logs in, navigates to profile, adds an education entry, saves, and verifies it is displayed on their public-facing profile.

## 9.3.0 Test Data Needs

- A test user account with an existing profile.
- Data sets for valid entries, entries with missing fields, and entries with invalid dates.

## 9.4.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Cypress or Playwright for E2E tests.
- Axe for automated accessibility testing.

# 10.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written with sufficient coverage (>80%) and are passing.
- E2E tests covering the happy path and key error conditions are passing.
- The UI is responsive and matches the design specifications.
- Accessibility (WCAG 2.1 AA) standards have been met and verified.
- Server-side validation is confirmed to be robust and secure.
- API documentation (GraphQL schema) is updated.
- The feature has been successfully deployed and verified in the staging environment.

# 11.0.0 Planning Information

## 11.1.0 Story Points

3

## 11.2.0 Priority

🔴 High

## 11.3.0 Sprint Considerations

- This is a foundational profile feature, critical for an MVP.
- The backend API and database schema changes can be developed in parallel with the frontend form component.
- Requires a full-stack developer or close collaboration between frontend and backend developers.

## 11.4.0 Release Impact

- Significantly improves the completeness and value of user profiles.
- Unlocks the ability to implement features based on education data in the future.

