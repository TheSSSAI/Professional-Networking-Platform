# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-034 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Set Profile Visibility to Public or Private |
| As A User Story | As a privacy-conscious professional, I want to set... |
| User Persona | Any registered user of the platform who wants to m... |
| Business Value | Increases user trust, engagement, and retention by... |
| Functional Area | User Profile Management |
| Story Theme | User Privacy and Settings |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

User sets their Public profile to Private

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user and my profile visibility is currently set to 'Public'

### 3.1.5 When

I navigate to my profile settings and change the visibility setting to 'Private' and save the change

### 3.1.6 Then

The system confirms the setting has been saved and my profile is now private.

### 3.1.7 Validation Notes

Verify via a toast notification or success message. The database field for my profile's visibility should be updated to 'PRIVATE'.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

User sets their Private profile to Public

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am a logged-in user and my profile visibility is currently set to 'Private'

### 3.2.5 When

I navigate to my profile settings and change the visibility setting to 'Public' and save the change

### 3.2.6 Then

The system confirms the setting has been saved and my profile is now public.

### 3.2.7 Validation Notes

Verify via a toast notification or success message. The database field for my profile's visibility should be updated to 'PUBLIC'.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

A non-connection views a profile that has been set to Private

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

User A has set their profile visibility to 'Private'

### 3.3.5 When

User B, who is not a first-degree connection of User A, views User A's profile

### 3.3.6 Then

User B can only see a minimal subset of User A's information (Name, Profile Picture, Headline) as defined in SRS-001-F2.

### 3.3.7 Validation Notes

Test by making a direct API call for the profile and asserting that the response payload is limited to the specified fields.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

A first-degree connection views a profile that has been set to Private

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

User A has set their profile visibility to 'Private'

### 3.4.5 When

User C, who is a first-degree connection of User A, views User A's profile

### 3.4.6 Then

User C can see User A's full profile information.

### 3.4.7 Validation Notes

This confirms that the 'Private' setting is correctly bypassed for first-degree connections.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

A non-connection views a profile that has been set to Public

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

User A has set their profile visibility to 'Public'

### 3.5.5 When

User B, who is not a first-degree connection of User A, views User A's profile

### 3.5.6 Then

User B can see User A's full profile information.

### 3.5.7 Validation Notes

This confirms the 'Public' setting works as expected for all users.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Search results respect Private profile settings for non-connections

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

User A has set their profile visibility to 'Private' and has 'Senior Developer' in their experience section

### 3.6.5 When

User B, who is not a connection, searches for 'Senior Developer'

### 3.6.6 Then

User A's profile should not appear in the search results based on that term, but should still be findable by name.

### 3.6.7 Validation Notes

This requires verifying that the search index (OpenSearch) is updated asynchronously to remove private fields from the searchable document for non-connections.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

System fails to save the new visibility setting

### 3.7.3 Scenario Type

Error_Condition

### 3.7.4 Given

I am a logged-in user on the profile settings page

### 3.7.5 When

I change my visibility setting and the backend API returns an error (e.g., 500 server error)

### 3.7.6 Then

The UI should display a clear error message like 'Could not save your settings. Please try again.' and the setting should revert to its original state.

### 3.7.7 Validation Notes

Use browser developer tools or a proxy to mock a failed API response to test this.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated 'Privacy Settings' or 'Visibility' section within the user's account settings.
- A set of radio buttons or a toggle switch for 'Public' and 'Private' options.
- Clear helper text next to each option explaining its effect (e.g., 'Public: Your full profile is visible to all users.' 'Private: Only your connections can see your full profile.').
- A 'Save Changes' button.
- A toast notification for success or failure feedback.

## 4.2.0 User Interactions

- User selects their desired visibility option.
- User clicks 'Save Changes' to persist the setting.
- User receives immediate visual feedback on the success or failure of the action.

## 4.3.0 Display Requirements

- The current visibility setting must be clearly indicated when the user visits the settings page.

## 4.4.0 Accessibility Needs

- The radio buttons or toggle switch must be fully keyboard accessible.
- All controls must have proper labels and ARIA attributes for screen reader compatibility, compliant with WCAG 2.1 Level AA.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-VIS-001

### 5.1.2 Rule Description

A 'Private' profile is only fully visible to the profile owner and their first-degree connections.

### 5.1.3 Enforcement Point

Backend API (Profile Service) before returning profile data.

### 5.1.4 Violation Handling

The API must return a limited, public subset of the profile data instead of the full data or an error.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-VIS-002

### 5.2.2 Rule Description

A 'Public' profile is fully visible to any logged-in user of the platform.

### 5.2.3 Enforcement Point

Backend API (Profile Service) before returning profile data.

### 5.2.4 Violation Handling

N/A - The API returns the full profile data.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-VIS-003

### 5.3.2 Rule Description

Changing profile visibility must trigger an asynchronous update of the user's document in the search index to reflect new access permissions.

### 5.3.3 Enforcement Point

Backend API (Profile Service) after successfully saving the visibility change.

### 5.3.4 Violation Handling

The system should log the failure and have a retry mechanism for the indexing job.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-021

#### 6.1.1.2 Dependency Reason

A user profile must exist and be editable before its visibility can be managed.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-036

#### 6.1.2.2 Dependency Reason

The concept of a 'first-degree connection' must be implemented to correctly apply the 'Private' visibility rule.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-037

#### 6.1.3.2 Dependency Reason

This story defines the minimal profile view that is displayed when a profile is private, which is a direct outcome of this story's functionality.

## 6.2.0.0 Technical Dependencies

- The Profile database schema must be updated to include a visibility field.
- The Profile service API must have authorization logic to enforce visibility rules.
- An event-driven mechanism (e.g., message queue) to communicate visibility changes to the Search service.

## 6.3.0.0 Data Dependencies

- Requires access to the user's current profile data and their connection list.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API check for profile visibility must add less than 20ms of latency to the profile load request.
- The asynchronous search re-indexing process should complete within 1 minute of the visibility change.

## 7.2.0.0 Security

- All visibility checks MUST be enforced on the backend. The client should never receive data it is not authorized to see.
- The endpoint for changing the visibility setting must be protected and only accessible by the authenticated profile owner.

## 7.3.0.0 Usability

- The setting must be easy to find and the meaning of each option must be unambiguous to the user.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported browsers (latest versions of Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires modification of the core profile data model and API.
- Involves creating robust, multi-factor authorization logic (is viewer self? is viewer a connection? is profile public?).
- The integration with the search service (OpenSearch) adds significant complexity, requiring an asynchronous event-driven update to the search index to respect the new privacy setting.

## 8.3.0.0 Technical Risks

- Potential for race conditions if the search index is not updated correctly or quickly enough after a visibility change.
- Incorrect implementation of the backend authorization logic could lead to a serious data leak (information disclosure vulnerability).

## 8.4.0.0 Integration Points

- Primary Database (PostgreSQL): Add a `visibility` column to the `profiles` table.
- Profile Service (Backend): Update the GET profile endpoint with authorization logic.
- Search Service (OpenSearch): Update indexing logic to handle public vs. private data fields.
- Frontend Application: Add UI components in the settings area.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify a non-connection cannot see full details of a private profile.
- Verify a connection CAN see full details of a private profile.
- Verify anyone can see full details of a public profile.
- Verify search results for a non-connection do not include private data from a private profile.
- Verify that a user cannot change the visibility setting of another user's profile.
- Verify UI feedback on save success and failure.

## 9.3.0.0 Test Data Needs

- Test accounts with public profiles.
- Test accounts with private profiles.
- Test accounts that are first-degree connections.
- Test accounts that are not connected.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Supertest for API integration tests.
- Cypress or Playwright for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% coverage for the new logic.
- E2E tests covering the key user flows are implemented and passing.
- Backend authorization logic has undergone a security review.
- The UI is responsive and meets WCAG 2.1 Level AA accessibility standards.
- The asynchronous search re-indexing mechanism is implemented and verified to be working.
- Relevant documentation (API specs, architecture diagrams) has been updated.
- The feature has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational privacy feature and a blocker for many other features that display user data (e.g., advanced search, content visibility).
- The dependency on the search service integration requires coordination and may span across teams or microservices.

## 11.4.0.0 Release Impact

- This feature is critical for the initial public launch to build user trust. The platform should not go live without this functionality.

