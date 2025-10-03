# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-036 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | View a Connection's Full Profile |
| As A User Story | As a Network Member, I want to view the complete a... |
| User Persona | Any authenticated user of the platform with at lea... |
| Business Value | Increases user engagement and the perceived value ... |
| Functional Area | User Profile Management |
| Story Theme | Networking and Profile Visibility |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Viewing a connection's private profile

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user, and I am a first-degree connection with User B, who has set their profile visibility to 'Private'

### 3.1.5 When

I navigate to User B's profile page

### 3.1.6 Then

The system must display User B's complete profile, including all sections: Basic Information, Work Experience, Education, and Skills.

### 3.1.7 Validation Notes

Verify that all data fields for each profile section are rendered correctly. This is the core success criteria.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Viewing a connection's public profile

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am a logged-in user, and I am a first-degree connection with User C, who has set their profile visibility to 'Public'

### 3.2.5 When

I navigate to User C's profile page

### 3.2.6 Then

The system must display User C's complete profile, with no difference in content compared to viewing a private profile of a connection.

### 3.2.7 Validation Notes

Confirm that being a connection provides the same full view regardless of the public setting.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Attempting to view a private profile of a non-connection

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given

I am a logged-in user, and I am NOT a first-degree connection with User D, who has set their profile visibility to 'Private'

### 3.3.5 When

I navigate to User D's profile page

### 3.3.6 Then

The system must only display User D's minimal profile (Name, Profile Picture, Headline), as defined in story US-037.

### 3.3.7 Validation Notes

This test validates the boundary of the access control rule. The system should correctly fall back to the non-connection visibility rules.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Viewing a profile after a connection is removed

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

I was a first-degree connection with User B, whose profile is 'Private', but I have just removed them as a connection

### 3.4.5 When

I immediately navigate to User B's profile page

### 3.4.6 Then

The system must only display User B's minimal profile, reflecting my new non-connection status.

### 3.4.7 Validation Notes

Ensures that access rights are revoked in real-time or near real-time upon change in connection status.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Attempting to view the profile of a deactivated connection

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

I am a logged-in user, and I was a first-degree connection with User E, who has since deactivated their account

### 3.5.5 When

I attempt to navigate to User E's profile page via a direct link or bookmark

### 3.5.6 Then

The system must display a page indicating the user's account is deactivated and that their profile is unavailable.

### 3.5.7 Validation Notes

Verify that account status (e.g., 'deactivated') takes precedence over connection status for profile visibility.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Profile Header (containing Profile Picture, Banner, Name, Headline)
- Basic Information Section
- Work Experience Section (list of entries)
- Education Section (list of entries)
- Skills Section (list of skills)

## 4.2.0 User Interactions

- User navigates to a profile page via search results, a link in a post, or their connections list.
- The page should be scrollable to view all sections.

## 4.3.0 Display Requirements

- The profile page must render all data associated with the connection's profile.
- There should be no visual indicator to the viewer that they are bypassing a 'Private' setting; the experience should be seamless.

## 4.4.0 Accessibility Needs

- The profile page must comply with WCAG 2.1 Level AA standards.
- All images (profile picture, banner) must have appropriate alt text.
- The page structure must use semantic HTML for screen reader compatibility.

# 5.0.0 Business Rules

- {'rule_id': 'BR-001', 'rule_description': "A user has the right to view the full profile of any of their first-degree connections, irrespective of that connection's public visibility setting.", 'enforcement_point': "Backend API (GraphQL resolver) when a request is made to fetch a user's profile data.", 'violation_handling': "If the requesting user is not a first-degree connection, the API must return a limited subset of data according to the profile's visibility setting."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-021

#### 6.1.1.2 Dependency Reason

Profile sections must be creatable before they can be viewed.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-034

#### 6.1.2.2 Dependency Reason

The ability for a user to set their profile to 'Private' must exist to test the core logic of this story.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-042

#### 6.1.3.2 Dependency Reason

The mechanism to establish a first-degree connection must be implemented first.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

US-044

#### 6.1.4.2 Dependency Reason

The system needs a way to query the connection relationship between two users.

## 6.2.0.0 Technical Dependencies

- Authentication Service (to identify the viewing user)
- Connection Service (to verify the relationship between two users)
- Profile Service (to fetch and serve profile data)
- PostgreSQL Database (containing User, Profile, and Connection tables)

## 6.3.0.0 Data Dependencies

- Requires access to the `Connections` table/entity to check for a bidirectional, accepted relationship.
- Requires access to the `Profiles` table/entity to retrieve the profile data.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for fetching profile data must have a P95 latency of less than 200ms.
- The profile page's Largest Contentful Paint (LCP) must be under 2.5 seconds as per SRS-001-NFR 2.1.1.

## 7.2.0.0 Security

- The authorization check to verify the first-degree connection status must be performed on the server-side and must not be bypassable.
- The API should not leak any private profile data to unauthorized users, even in error messages.

## 7.3.0.0 Usability

- The layout of the profile page should be intuitive and easy to read.

## 7.4.0.0 Accessibility

- Must adhere to WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The profile page must render correctly on all supported modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- The primary complexity is in the backend authorization logic. The GraphQL resolver for the user profile query must efficiently and securely check the connection status before deciding which fields to resolve.
- Data aggregation from multiple tables (profile, experience, education, skills) needs to be performant.
- Ensuring the access control is not susceptible to race conditions (e.g., a connection is removed while a data fetch is in progress).

## 8.3.0.0 Technical Risks

- A bug in the authorization logic could lead to a significant data privacy breach.
- Inefficient database queries for checking connections could lead to slow profile page load times, especially for users with large networks.

## 8.4.0.0 Integration Points

- The Profile Service must call the Connection Service (or query its data) to determine the relationship status.
- The frontend client makes a GraphQL query to the API Gateway, which routes it to the Profile Service.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Performance

## 9.2.0.0 Test Scenarios

- Verify a user can see the full private profile of a connection.
- Verify a user sees only the minimal private profile of a non-connection.
- Verify that after removing a connection, the full profile view is immediately revoked.
- Verify that a deactivated profile is not viewable, even by a former connection.

## 9.3.0.0 Test Data Needs

- Test accounts with established first-degree connections.
- Test accounts that are not connected.
- Test accounts with profiles set to 'Public' and 'Private'.
- A test account that can be deactivated.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Supertest for API integration tests.
- Cypress or Playwright for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit tests for the authorization logic in the GraphQL resolver achieve >80% coverage.
- Integration tests confirm correct interaction between Profile and Connection services.
- E2E automated tests for all scenarios described in ACs are passing.
- A security review of the access control logic has been completed and any findings addressed.
- Performance testing confirms API latency and page LCP are within defined NFRs.
- The feature is documented in the API specification.
- Story has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a core part of the networking functionality and should be prioritized after its dependencies are met.
- Requires close collaboration between frontend and backend developers to ensure the GraphQL query and UI rendering are aligned.

## 11.4.0.0 Release Impact

This is a fundamental feature for the platform's value proposition. Its absence would significantly diminish the user experience.

