# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-037 |
| Elaboration Date | 2025-01-17 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | View a Minimal Profile for a Non-Connection with a... |
| As A User Story | As a platform user, I want to see a limited, minim... |
| User Persona | Any registered user browsing the platform ('Viewin... |
| Business Value | Enhances user trust by enforcing privacy settings,... |
| Functional Area | User Profile Management & Access Control |
| Story Theme | Profile Visibility and Privacy |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Viewing a private profile of a non-connection

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user (User A), and another user (User B) has set their profile visibility to 'Private'

### 3.1.5 When

I navigate to User B's profile page, and I am not a first-degree connection with User B

### 3.1.6 Then

The system must display only User B's Name, Profile Picture, and Professional Headline.

### 3.1.7 Validation Notes

Verify that the API response only contains these three fields and that the UI renders them correctly. No other profile sections (Experience, Education, Skills) should be present in the DOM.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Absence of detailed profile information on a minimal view

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am viewing the minimal profile of a non-connection (User B) with a private profile

### 3.2.5 When

I inspect the page content

### 3.2.6 Then

I must not see any sections or data related to Work Experience, Education, Skills, or detailed Contact Information.

### 3.2.7 Validation Notes

Automated E2E tests should assert the absence of selectors corresponding to these detailed profile sections.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Ability to connect from a minimal profile view

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

I am viewing the minimal profile of a non-connection (User B) with a private profile

### 3.3.5 When

I view the profile

### 3.3.6 Then

A 'Connect' or 'Send Connection Request' button must be visible and functional.

### 3.3.7 Validation Notes

Test that clicking the button initiates the connection request flow as defined in US-039.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Viewing a private profile of a first-degree connection

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

I am a logged-in user (User A), and another user (User B) has set their profile visibility to 'Private'

### 3.4.5 When

I navigate to User B's profile page, and I AM a first-degree connection with User B

### 3.4.6 Then

The system must display User B's full profile, including all sections like Work Experience, Education, and Skills.

### 3.4.7 Validation Notes

Verify that the API returns the full profile DTO and the UI renders all sections correctly, respecting the business rule that connections can see each other's full profiles.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Viewing a public profile of a non-connection

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

I am a logged-in user (User A), and another user (User C) has set their profile visibility to 'Public'

### 3.5.5 When

I navigate to User C's profile page, and I am not a first-degree connection with User C

### 3.5.6 Then

The system must display User C's full profile.

### 3.5.7 Validation Notes

This confirms that the privacy check is specific to the 'Private' setting and does not incorrectly limit public profiles.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Anonymous user attempts to view a private profile

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

I am not logged into the platform

### 3.6.5 When

I attempt to navigate to the URL of a user with a 'Private' profile

### 3.6.6 Then

I must be redirected to the login page or shown a message prompting me to log in to view the profile.

### 3.6.7 Validation Notes

Verify the redirection and ensure no profile data, not even the minimal set, is exposed to unauthenticated users.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Server-side enforcement of data filtering

### 3.7.3 Scenario Type

Security

### 3.7.4 Given

I am a logged-in user (User A)

### 3.7.5 When

I use developer tools to inspect the API call made to fetch the profile of a non-connection (User B) with a private profile

### 3.7.6 Then

The JSON response from the server must contain only the minimal data (Name, Picture URL, Headline) and must not contain any other sensitive profile information.

### 3.7.7 Validation Notes

This is a critical security check to ensure that sensitive data is not being sent to the client and merely hidden by the UI.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Profile Picture component
- User Name display (h1)
- Professional Headline display (h2 or p)
- 'Connect' button

## 4.2.0 User Interactions

- The user navigates to a profile page via URL or by clicking a link (e.g., from search results).
- The user can click the 'Connect' button to initiate a connection request.

## 4.3.0 Display Requirements

- The layout must appear intentional and not like a broken or partially loaded page.
- Consider displaying a subtle message indicating that the view is limited due to privacy settings, e.g., 'Connect with [User's Name] to see their full profile.'

## 4.4.0 Accessibility Needs

- The profile picture `<img>` tag must have a descriptive `alt` attribute, e.g., 'alt="Profile picture of [User's Name]"'.
- All text must have sufficient color contrast.
- The 'Connect' button must be keyboard-navigable and have a clear focus state.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-005

### 5.1.2 Rule Description

A user's full profile is only visible to their first-degree connections if their profile visibility is set to 'Private'.

### 5.1.3 Enforcement Point

Backend API service responsible for fetching user profile data.

### 5.1.4 Violation Handling

The API must return a limited DTO (Data Transfer Object) containing only the publicly permissible fields (Name, Picture, Headline).

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-006

### 5.2.2 Rule Description

Public profiles are fully visible to all logged-in users, regardless of connection status.

### 5.2.3 Enforcement Point

Backend API service responsible for fetching user profile data.

### 5.2.4 Violation Handling

N/A - The API returns the full profile DTO.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-034

#### 6.1.1.2 Dependency Reason

The ability to set a profile to 'Private' must exist before rules for viewing it can be implemented.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-044

#### 6.1.2.2 Dependency Reason

The system must be able to determine if two users are first-degree connections.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-021

#### 6.1.3.2 Dependency Reason

The basic profile fields (Name, Headline) must be implemented and populated.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

US-030

#### 6.1.4.2 Dependency Reason

The profile picture feature must be implemented.

### 6.1.5.0 Story Id

#### 6.1.5.1 Story Id

US-039

#### 6.1.5.2 Dependency Reason

The 'Connect' button requires the functionality to send a connection request.

## 6.2.0.0 Technical Dependencies

- Backend Profile Service/Controller capable of checking connection status and privacy settings.
- Frontend Profile Page component capable of conditional rendering (minimal vs. full view).

## 6.3.0.0 Data Dependencies

- Requires access to User, Profile, and Connection data models.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for fetching profile data must maintain a P95 latency of < 200ms.
- The database query to check connection status between two users must be highly optimized, likely requiring a composite index on the connections table.

## 7.2.0.0 Security

- Access control logic MUST be enforced on the backend. The frontend should never receive full profile data for a private profile it is not authorized to see.
- Penetration testing should explicitly attempt to bypass this access control mechanism.

## 7.3.0.0 Usability

- The minimal profile view should be clear and intuitive, avoiding user confusion about missing information.

## 7.4.0.0 Accessibility

- The rendered minimal profile page must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The feature must render correctly on all supported browsers and devices (desktop, tablet, mobile).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- The backend authorization logic is security-critical and requires careful implementation and thorough testing.
- Requires coordination between frontend conditional rendering and the specific data structure returned by the backend API.
- Database query performance for checking connection status at scale.

## 8.3.0.0 Technical Risks

- Risk of exposing private data if the backend authorization logic is flawed.
- Potential for performance degradation if the connection lookup is inefficient.

## 8.4.0.0 Integration Points

- User Authentication Service (to identify the requesting user).
- Profile Database (to get profile data and privacy settings).
- Connections Database (to check relationship status).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify minimal view for non-connection with private profile.
- Verify full view for connection with private profile.
- Verify full view for non-connection with public profile.
- Verify redirection for anonymous user attempting to view private profile.
- Verify API response payload contains only minimal data for restricted views.

## 9.3.0.0 Test Data Needs

- Test accounts with 'Public' profiles.
- Test accounts with 'Private' profiles.
- Test account pairs that are connected.
- Test account pairs that are not connected.

## 9.4.0.0 Testing Tools

- Jest/Vitest for backend unit tests.
- Supertest for API integration tests.
- Cypress or Playwright for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Backend code implementing the access control logic has been peer-reviewed with a focus on security.
- Unit tests for the profile data fetching service achieve >90% coverage for the new logic.
- API integration tests covering all scenarios in the ACs are implemented and passing.
- E2E tests for the UI rendering are implemented and passing.
- A specific security review/test case for this feature has been conducted and passed.
- Frontend component reviewed for accessibility and responsiveness.
- Documentation for the profile API endpoint is updated to reflect the different possible response structures.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational privacy feature and a blocker for any public launch.
- Requires both backend and frontend development effort that can be parallelized once the API contract is defined.

## 11.4.0.0 Release Impact

- Critical for user trust and must be included in the initial public release (MVP).

