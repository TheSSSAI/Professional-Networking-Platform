# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-067 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Get Relevant Search Results Despite Minor Typos |
| As A User Story | As a user searching for other professionals, I wan... |
| User Persona | Any platform user utilizing the search functionali... |
| Business Value | Improves user experience by reducing search fricti... |
| Functional Area | Search and Discovery |
| Story Theme | Enhanced Search Experience |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Search with a single-character typo in a user's name

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A user profile for 'Johnathan Smith' exists and is indexed in the search engine

### 3.1.5 When

A user searches for 'Jonatan Smith'

### 3.1.6 Then

The profile of 'Johnathan Smith' is returned as a relevant search result.

### 3.1.7 Validation Notes

Verify via API response or UI that the correct profile is present in the results.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Search with a single-character typo in a company name

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

Multiple user profiles list 'Microsoft' as their current company and are indexed

### 3.2.5 When

A user filters or searches for people at 'Microsfot'

### 3.2.6 Then

The profiles of users working at 'Microsoft' are returned in the search results.

### 3.2.7 Validation Notes

Verify that the search results contain users from the correctly spelled company.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Search with a transposed character typo in a skill

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

Multiple user profiles list 'JavaScript' as a skill and are indexed

### 3.3.5 When

A user searches for people with the skill 'JavsScript'

### 3.3.6 Then

The profiles of users with the 'JavaScript' skill are returned in the search results.

### 3.3.7 Validation Notes

Verify that the search results contain users with the correctly spelled skill.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Exact matches are ranked higher than fuzzy matches

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

A user profile for 'Chris Green' and another for 'Chris Greene' both exist and are indexed

### 3.4.5 When

A user searches for 'Chris Green'

### 3.4.6 Then

The profile for 'Chris Green' must be ranked higher in the results than the profile for 'Chris Greene'.

### 3.4.7 Validation Notes

Check the order of results in the API response. The exact match must have a higher relevance score.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Search with multiple minor typos in a name

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

A user profile for 'Cassandra Williams' exists and is indexed

### 3.5.5 When

A user searches for 'Casnadra Wiliams' (two single-character typos)

### 3.5.6 Then

The profile of 'Cassandra Williams' is returned as a relevant search result.

### 3.5.7 Validation Notes

This tests the tolerance limit. The system should handle an edit distance of 2 for longer terms.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Search with excessive typos does not return irrelevant results

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

A user profile for 'Cassandra Williams' exists and is indexed

### 3.6.5 When

A user searches for 'Csdra Wlms'

### 3.6.6 Then

The profile for 'Cassandra Williams' is either not returned or has a very low relevance score, and the system may return a 'No results found' message.

### 3.6.7 Validation Notes

Verify that the fuzzy matching is not overly aggressive, preventing highly irrelevant results from cluttering the results page.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Fuzzy search respects user privacy settings

### 3.7.3 Scenario Type

Security

### 3.7.4 Given

User 'Private User' has a private profile and is not a connection

### 3.7.5 When

A user searches for 'Pravate Usr'

### 3.7.6 Then

The search result for 'Private User', if returned, must only display the minimal, publicly identifiable subset of data (Name, Profile Picture) as defined in SRS-001-F6.2.

### 3.7.7 Validation Notes

Perform the search as a non-connected user and verify that no private profile details are exposed in the search results.

## 3.8.0 Criteria Id

### 3.8.1 Criteria Id

AC-008

### 3.8.2 Scenario

Fuzzy search meets performance requirements

### 3.8.3 Scenario Type

Performance

### 3.8.4 Given

The system is under nominal load as defined in the performance test plan

### 3.8.5 When

A user executes a search query containing a minor typo

### 3.8.6 Then

The API response for the search results must have a 95th percentile (P95) latency of less than 200ms.

### 3.8.7 Validation Notes

This must be validated using load testing tools (e.g., k6, JMeter) against the search API endpoint.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- No new UI elements are strictly required for this story. It enhances the logic of the existing search bar and results page.

## 4.2.0 User Interactions

- User types a query with a minor typo into the search bar.
- User views the search results, which include the corrected matches.

## 4.3.0 Display Requirements

- Search results should be displayed as defined in the base search story (US-066).
- Consideration for future enhancement: Display a 'Did you mean: [corrected_query]?' suggestion above the results.

## 4.4.0 Accessibility Needs

- All accessibility requirements from the base search story (US-066) must be maintained.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-SEARCH-01

### 5.1.2 Rule Description

Exact matches on search terms must always be considered more relevant than fuzzy (typo-corrected) matches.

### 5.1.3 Enforcement Point

Search engine query logic (OpenSearch).

### 5.1.4 Violation Handling

A fuzzy match appearing before an exact match is a defect in the relevance tuning.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-SEARCH-02

### 5.2.2 Rule Description

The typo tolerance (fuzziness) should be configured to allow a maximum Levenshtein distance of 2 for terms of 6 characters or more, and a distance of 1 for terms of 3-5 characters. Terms less than 3 characters should not have fuzzy matching applied.

### 5.2.3 Enforcement Point

Search engine query configuration (OpenSearch).

### 5.2.4 Violation Handling

Incorrect configuration leads to either irrelevant results (too aggressive) or poor UX (not aggressive enough).

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-066

#### 6.1.1.2 Dependency Reason

This story enhances the core search functionality. The basic search bar, results page, and backend search endpoint must be implemented first.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-068

#### 6.1.2.2 Dependency Reason

While not a strict prerequisite, the relevance ranking from this story (prioritizing connections) should be combined with the fuzzy matching logic to provide the best overall search results. The implementation should consider how to blend these two ranking signals.

## 6.2.0.0 Technical Dependencies

- A provisioned and configured OpenSearch cluster (as per SRS-001-F6.2).
- An established data indexing pipeline that populates the OpenSearch index from the primary PostgreSQL database.

## 6.3.0.0 Data Dependencies

- The OpenSearch index must contain user profile data, including name, title, company, and skills, for fuzzy matching to work.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The P95 latency of the search API endpoint must remain under 200ms, even with the added computational cost of fuzzy queries (SRS-001-NFR 2.1.2).

## 7.2.0.0 Security

- Fuzzy matching logic must not bypass the access control rules for private profiles. Search results must always be filtered based on the searching user's relationship to the result profiles (SRS-001-F6.2).

## 7.3.0.0 Usability

- The search feature should feel 'intelligent' and forgiving, reducing user frustration from simple typing errors.

## 7.4.0.0 Accessibility

- N/A - No direct impact on accessibility beyond what is required for the base search feature.

## 7.5.0.0 Compatibility

- N/A - This is a backend logic change with no direct impact on browser compatibility.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Relevance Tuning: Balancing the weight of exact matches, fuzzy matches, and other signals (like connection degree) is complex and requires iterative testing.
- Performance Optimization: Fuzzy queries are more CPU-intensive. The OpenSearch queries must be constructed efficiently, and the cluster may need performance tuning.
- Configuration: Determining the optimal 'fuzziness' settings (e.g., edit distance, prefix length) in the OpenSearch query to provide good results without being overly broad.

## 8.3.0.0 Technical Risks

- Poor relevance ranking leading to user confusion.
- Performance degradation of the search API under load.
- Overly aggressive fuzzy matching returning nonsensical results for short or ambiguous search terms.

## 8.4.0.0 Integration Points

- The backend search service that constructs and sends queries to OpenSearch.
- The OpenSearch indexing schema and query templates.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance

## 9.2.0.0 Test Scenarios

- Verify search results for queries with single and multiple typos in names, companies, and skills.
- Verify that exact matches are ranked higher than fuzzy matches.
- Verify that searches with excessive typos do not return results.
- Verify search performance under load using queries designed to trigger fuzzy matching.
- Verify that privacy settings are respected for all fuzzy search results.

## 9.3.0.0 Test Data Needs

- A curated set of user profiles with names and attributes that are intentionally similar but distinct (e.g., 'John', 'Jon', 'Johnathan').
- User profiles with private visibility settings.
- A dataset large enough to be representative for performance testing.

## 9.4.0.0 Testing Tools

- Jest for unit tests on the query builder.
- A testing framework with Testcontainers for integration tests against a live OpenSearch instance.
- Cypress or Playwright for E2E tests.
- k6 or JMeter for performance testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% coverage for new code.
- Performance tests confirm that the P95 latency is below 200ms.
- Relevance tuning for fuzzy vs. exact matches has been reviewed and approved by the Product Owner.
- The OpenSearch query configuration (fuzziness settings) is documented.
- Story has been deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story should be scheduled after the basic search functionality (US-066) is completed.
- Allocate time within the sprint for iterative testing and tuning of the search relevance.
- Requires collaboration between backend developers and potentially a data/search specialist.

## 11.4.0.0 Release Impact

This is a significant UX improvement for a core platform feature. It should be highlighted in release notes as a major enhancement to search functionality.

