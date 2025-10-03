# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-070 |
| Elaboration Date | 2025-01-18 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Filter Search Results by Current Company |
| As A User Story | As a Platform User who is searching for people, I ... |
| User Persona | Any platform user (e.g., Recruiter, Sales Professi... |
| Business Value | Enhances the utility and precision of the user sea... |
| Functional Area | Search and Discovery |
| Story Theme | Advanced Search Capabilities |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Applying a company filter to an existing search

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am on the user search results page after searching for 'Software Engineer'

### 3.1.5 When

I enter 'Innovate Corp' into the 'Current Company' filter field and apply the filter

### 3.1.6 Then

The list of search results updates to display only users whose most recent work experience is at 'Innovate Corp' and who match the original search query.

### 3.1.7 Validation Notes

Verify via E2E test. The API call for search should now include a filter parameter for the company. The returned user list must be validated against the database for accuracy.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Filter UI displays the active filter

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I have successfully applied a filter for the company 'Innovate Corp'

### 3.2.5 When

I view the search results page

### 3.2.6 Then

A visual indicator, such as a tag or chip labeled 'Company: Innovate Corp', is displayed, indicating the filter is active.

### 3.2.7 Validation Notes

UI snapshot testing can verify the presence and appearance of the filter tag.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Removing an active company filter

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

I have an active filter for the company 'Innovate Corp'

### 3.3.5 When

I click the 'remove' or 'x' icon on the active filter indicator

### 3.3.6 Then

The company filter is removed, and the search results revert to the original, unfiltered list for 'Software Engineer'.

### 3.3.7 Validation Notes

E2E test to confirm the UI interaction triggers a new API call without the filter parameter and the results are updated correctly.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Filtering results in no matches

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

I am on the user search results page

### 3.4.5 When

I apply a company filter for 'NonExistent Corp', which has no employees in the current result set

### 3.4.6 Then

The results area is cleared and a user-friendly message is displayed, such as 'No results match your current filters'.

### 3.4.7 Validation Notes

Test by applying a filter that is guaranteed to return zero results. Verify the message text and that the results list is empty.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Combining company filter with other filters

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

I have an active filter for 'Location: San Francisco'

### 3.5.5 When

I add a new filter for 'Company: Global Tech Inc.'

### 3.5.6 Then

The search results are updated to show users who are located in 'San Francisco' AND are currently employed at 'Global Tech Inc.'.

### 3.5.7 Validation Notes

Integration test to ensure the backend search logic correctly applies multiple filters using an AND condition.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Company filter respects user privacy settings

### 3.6.3 Scenario Type

Security_Condition

### 3.6.4 Given

User A has a private profile and works at 'Secretive Startup Inc.' and is not connected to me

### 3.6.5 When

I search for users and filter by company 'Secretive Startup Inc.'

### 3.6.6 Then

User A does not appear in my search results, as their full profile data is not indexed for non-connections.

### 3.6.7 Validation Notes

Requires specific test data setup with private profiles and non-connected users. Verify that the search index respects the privacy flag during indexing and querying, as per SRS-001-F6.2.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Company filter input provides autocomplete suggestions

### 3.7.3 Scenario Type

Happy_Path

### 3.7.4 Given

I am on the search results page

### 3.7.5 When

I type 'Innov' into the 'Current Company' filter input

### 3.7.6 Then

A dropdown list of suggested company names starting with 'Innov' (e.g., 'Innovate Corp', 'Innovation Labs') appears below the input field.

### 3.7.7 Validation Notes

The frontend should debounce this input. The backend needs an endpoint to query for matching company names from the search index.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated 'Filters' section or sidebar on the search results page.
- A text input field labeled 'Current Company' within the filters section.
- An autocomplete dropdown menu that appears as the user types in the company field.
- A removable 'chip' or 'tag' element displayed above the search results to indicate an active filter.

## 4.2.0 User Interactions

- User can type into the company filter field.
- User can select a company from the autocomplete list using a mouse click or keyboard navigation (arrow keys and Enter).
- Applying the filter updates the search results list without a full page reload.
- User can click an 'x' icon on the filter chip to remove the filter.

## 4.3.0 Display Requirements

- The number of search results should update when a filter is applied or removed.
- If no results are found after filtering, a clear message must be displayed.

## 4.4.0 Accessibility Needs

- The filter input field must have a proper label.
- The autocomplete dropdown must be keyboard accessible (navigable with up/down arrows, selection with Enter, dismissal with Escape).
- The active filter chip must be focusable and removable via keyboard.
- All elements must comply with WCAG 2.1 Level AA standards.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-SEARCH-01

### 5.1.2 Rule Description

Filters are combined using a logical AND operator. A user must match all active filter criteria to be included in the results.

### 5.1.3 Enforcement Point

Backend Search Service (when constructing the OpenSearch query).

### 5.1.4 Violation Handling

N/A - This is a system logic rule.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-SEARCH-02

### 5.2.2 Rule Description

Filtering is based on the user's single most recent work experience entry that does not have an end date.

### 5.2.3 Enforcement Point

Data Indexing Process (from PostgreSQL to OpenSearch).

### 5.2.4 Violation Handling

N/A - This is a data processing rule.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-066

#### 6.1.1.2 Dependency Reason

The core user search functionality and results page must exist before filters can be added.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-022

#### 6.1.2.2 Dependency Reason

Users must be able to add work experience to their profiles for the company data to be available for filtering.

## 6.2.0.0 Technical Dependencies

- A provisioned and configured OpenSearch cluster (as per SRS-001-F6.2).
- A data indexing pipeline that syncs user profile data from PostgreSQL to OpenSearch.
- A GraphQL API endpoint for user search that can accept filter parameters.

## 6.3.0.0 Data Dependencies

- The OpenSearch user profile index must contain a dedicated, filterable field for `currentCompany`.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response time for applying/removing a filter must be under 200ms at the 95th percentile (P95), as per SRS-001-NFR 2.1.2.
- The frontend UI update after receiving the filtered results should be visually instantaneous (<100ms).

## 7.2.0.0 Security

- All filter parameters must be sanitized on the backend to prevent injection attacks against the search engine (e.g., OpenSearch query injection).
- The search query must enforce privacy rules, ensuring non-connections cannot filter on or see data from private profiles.

## 7.3.0.0 Usability

- The filter's purpose and state (active/inactive) must be immediately obvious to the user.
- The process of adding and removing filters should be intuitive and require minimal clicks.

## 7.4.0.0 Accessibility

- Must adhere to WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Frontend: Development of a reusable, accessible autocomplete filter component.
- Backend: Modification of the search service to correctly incorporate filter clauses into OpenSearch queries.
- Data Indexing: Ensuring the logic to identify and index the 'current company' is robust and handles edge cases (e.g., multiple concurrent jobs, missing end dates).
- API Design: Potentially creating a new endpoint for company name typeahead suggestions to power the autocomplete.

## 8.3.0.0 Technical Risks

- Performance degradation of the search query if the OpenSearch index is not optimized for filtering/faceting on the company field.
- Inconsistent company names ('Innovate Corp' vs 'Innovate Corporation') could lead to fragmented results. The autocomplete feature helps mitigate this but doesn't solve it completely.

## 8.4.0.0 Integration Points

- Frontend Search UI <-> Backend GraphQL API
- Backend Search Service <-> OpenSearch Cluster

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Accessibility

## 9.2.0.0 Test Scenarios

- Apply a single company filter and verify results.
- Apply multiple different types of filters (e.g., company + location) and verify results.
- Apply and then remove a filter, verifying the results revert correctly.
- Test filtering with a company name that yields no results.
- Test filtering as a user who is not connected to a target user with a private profile.
- Test keyboard navigation and selection within the autocomplete dropdown.

## 9.3.0.0 Test Data Needs

- User accounts with clearly defined 'current' companies.
- User accounts with no current company.
- Multiple user accounts at the same company.
- User accounts with private profiles.
- A set of non-connected users to test privacy constraints.

## 9.4.0.0 Testing Tools

- Jest/Vitest for unit tests.
- Cypress or Playwright for E2E tests.
- Axe for accessibility scanning.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% coverage for the new logic.
- E2E tests covering the primary user flows are implemented and passing.
- The feature is confirmed to be responsive and accessible (WCAG 2.1 AA).
- API performance testing confirms the P95 latency is below 200ms under load.
- Security review confirms that input is sanitized and privacy rules are enforced.
- Relevant documentation (API specs, component library) has been updated.
- The story has been demonstrated to the Product Owner and accepted.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a high-value feature for users and should be prioritized shortly after the basic search is functional.
- Requires coordinated effort between frontend and backend developers.

## 11.4.0.0 Release Impact

Significantly improves the core search experience. This can be highlighted in release notes as a major enhancement.

