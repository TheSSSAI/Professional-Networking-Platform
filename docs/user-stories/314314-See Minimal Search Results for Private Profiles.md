# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-072 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | See Minimal Search Results for Private Profiles |
| As A User Story | As a platform user searching for other professiona... |
| User Persona | Any registered user performing a search ('Searchin... |
| Business Value | Builds user trust by strictly enforcing privacy se... |
| Functional Area | Search and Discovery |
| Story Theme | User Privacy and Trust |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Search result for a non-connection with a private profile

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given



```
I am a logged-in user, 'User A',
AND 'User B' has a profile with visibility set to 'private',
AND I am not a first-degree connection with 'User B'
```

### 3.1.5 When

I perform a search query that matches 'User B's profile

### 3.1.6 Then



```
The search result entry for 'User B' must display only their Name, Profile Picture, and Headline.
AND The search result entry must not display their current company, location, skills, or any other detailed profile information.
```

### 3.1.7 Validation Notes

Verify via E2E test. The API response for the search query must contain a trimmed object for 'User B', exposing only the allowed fields.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Search result for a connection with a private profile

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given



```
I am a logged-in user, 'User A',
AND 'User B' has a profile with visibility set to 'private',
AND I am a first-degree connection with 'User B'
```

### 3.2.5 When

I perform a search query that matches 'User B's profile

### 3.2.6 Then

The search result entry for 'User B' must display their full summary information (e.g., Name, Profile Picture, Headline, Current Company, Location), consistent with a public profile result.

### 3.2.7 Validation Notes

Verify that being a connection correctly overrides the privacy restriction for search result display. The API response should contain the full summary data for 'User B'.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Search result for a non-connection with a public profile

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given



```
I am a logged-in user, 'User A',
AND 'User C' has a profile with visibility set to 'public',
AND I am not a first-degree connection with 'User C'
```

### 3.3.5 When

I perform a search query that matches 'User C's profile

### 3.3.6 Then

The search result entry for 'User C' must display their full summary information (e.g., Name, Profile Picture, Headline, Current Company, Location).

### 3.3.7 Validation Notes

This confirms the logic correctly differentiates between public and private profiles. This is the default behavior.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Deactivated users do not appear in search results

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

User 'D' had an active account and has now deactivated it

### 3.4.5 When

I perform a search query that would have previously matched 'User D's profile

### 3.4.6 Then

'User D' must not appear in the search results list.

### 3.4.7 Validation Notes

Verify that the search indexing or query process correctly filters out users with a 'deactivated' status.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Search results respect immediate changes to profile visibility

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

'User B' has a 'public' profile and I am not a connection

### 3.5.5 When



```
'User B' changes their profile visibility to 'private',
AND I immediately perform a search that matches 'User B'
```

### 3.5.6 Then

The search result for 'User B' must display the minimal information (Name, Picture, Headline), honoring the new 'private' setting.

### 3.5.7 Validation Notes

This tests for stale data. The system must prioritize the authoritative data from the primary database over potentially lagging search index data when rendering results.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Search results list
- Individual user entry within the search results list

## 4.2.0 User Interactions

- The entire user entry in the search results list should be a single clickable target that navigates to the user's profile page.

## 4.3.0 Display Requirements

- For a minimal result, only the user's Profile Picture, Name, and Headline are displayed.
- The layout should remain consistent, with blank space where extended information (like current company) would normally appear, to avoid jarring UI shifts.
- No explicit 'Private Profile' badge should be shown in the search results list.

## 4.4.0 Accessibility Needs

- All clickable elements must have appropriate ARIA roles and labels.
- Information should be structured semantically so screen readers can parse the results correctly.

# 5.0.0 Business Rules

- {'rule_id': 'BR-SEARCH-VISIBILITY-01', 'rule_description': "A user's profile data displayed in search results must adhere to their profile visibility setting (public/private) in relation to the searching user's connection degree.", 'enforcement_point': 'Server-side, within the backend service that processes search queries and formats the API response.', 'violation_handling': 'If the rule cannot be enforced (e.g., connection service is down), the system should fail safely by showing minimal data rather than exposing private information.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-034

#### 6.1.1.2 Dependency Reason

The ability for users to set their profile to private must exist before this logic can be applied.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-066

#### 6.1.2.2 Dependency Reason

The basic user search functionality and infrastructure must be in place.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-042

#### 6.1.3.2 Dependency Reason

The concept of a first-degree connection must be implemented to differentiate search result visibility.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

US-037

#### 6.1.4.2 Dependency Reason

This story is a direct prerequisite for the user experience, as clicking a minimal search result must lead to a minimal profile view.

## 6.2.0.0 Technical Dependencies

- A functioning OpenSearch cluster for indexing and querying user data.
- A data synchronization pipeline from PostgreSQL to OpenSearch.
- A backend service capable of checking connection status between two users (e.g., a Connection or Graph Service).

## 6.3.0.0 Data Dependencies

- The user profile data in OpenSearch must be indexed with a `visibility` field ('public' or 'private').

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The additional logic for checking privacy and connection status must not cause the P95 latency of the search API to exceed 200ms, as per SRS-001-NFR 2.1.2.
- The connection status check for a page of results should be performed in a single batch operation to avoid N+1 query problems.

## 7.2.0.0 Security

- All visibility rules must be enforced on the server-side. The API must never send private profile data to a client that is not authorized to view it.
- Penetration tests should include scenarios to attempt to bypass this visibility logic and access private data via the search API.

## 7.3.0.0 Usability

- The reduction in information for private profiles should be intuitive and not appear as a bug or broken UI.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported browsers (latest versions of Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires real-time, performant, inter-service communication between the Search service, User Profile service, and Connection service.
- Designing an efficient query to check connection status for a list of search results without impacting latency.
- Ensuring data consistency between the primary database (PostgreSQL) and the search index (OpenSearch) regarding user visibility settings.

## 8.3.0.0 Technical Risks

- High latency introduced by checking connection status for each search result. This must be mitigated with a batching strategy or an efficient graph lookup.
- Potential for data inconsistency if the OpenSearch index is not updated promptly after a user changes their privacy settings, requiring a fallback to the primary DB.

## 8.4.0.0 Integration Points

- Backend Search Service -> OpenSearch Cluster
- Backend Search Service -> Connection Service (or database)
- Backend Search Service -> User Profile Service (or database)

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Security

## 9.2.0.0 Test Scenarios

- A non-connection searches for a private profile.
- A connection searches for a private profile.
- Any user searches for a public profile.
- A user changes their profile from public to private, and another user immediately searches for them.
- A search is performed that would match a now-deactivated user.

## 9.3.0.0 Test Data Needs

- User accounts with 'public' profiles.
- User accounts with 'private' profiles.
- User accounts that are first-degree connections.
- User accounts that are not connected.
- A user account that can be programmatically deactivated during a test run.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Supertest for API integration tests.
- Cypress or Playwright for E2E tests.
- k6 or JMeter for performance testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% coverage for the new logic.
- E2E tests covering all key scenarios are passing.
- Performance tests confirm that search API latency is within the 200ms P95 threshold.
- A security review has confirmed that no private data is leaked via the API.
- Any necessary documentation (API specs, architecture diagrams) has been updated.
- The feature has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is blocked by the completion of foundational search, profile, and connection stories.
- Requires coordination between developers working on the search, user, and connection services.
- Test data setup is critical and may require dedicated time.

## 11.4.0.0 Release Impact

This is a critical feature for user trust and must be included in the initial public launch.

