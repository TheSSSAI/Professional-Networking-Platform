# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-046 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Sort Connections List by Date Connected |
| As A User Story | As a registered user viewing my network, I want to... |
| User Persona | Any registered user of the platform who is managin... |
| Business Value | Improves user experience by providing more control... |
| Functional Area | Connection Management |
| Story Theme | User Profile and Networking |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Sort connections by most recent

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in user on the 'My Connections' page, and the list is currently sorted alphabetically by name

### 3.1.5 When

I select the sort option for 'Date Connected'

### 3.1.6 Then

The connections list should asynchronously update, displaying my connections in descending order of connection date (most recent connection first).

### 3.1.7 Validation Notes

Verify the API call includes parameters for sorting by date in descending order. Check the rendered list to confirm the top item is the newest connection.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Toggle sort order to oldest first

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

I am on the 'My Connections' page, and the list is currently sorted by 'Date Connected' (most recent first)

### 3.2.5 When

I interact with the sort control to reverse the order

### 3.2.6 Then

The connections list should update to display my connections in ascending order of connection date (oldest connection first).

### 3.2.7 Validation Notes

Verify the UI control allows toggling the sort direction. Check the API call and the rendered list to confirm the order is now ascending.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

UI indicates the active sort state

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

I have sorted my connections list by 'Date Connected'

### 3.3.5 When

The list finishes loading

### 3.3.6 Then

The sort control UI element must visually indicate that 'Date Connected' is the active sort criteria and also show the current direction (e.g., an arrow pointing down for newest first, up for oldest first).

### 3.3.7 Validation Notes

Inspect the DOM to ensure the correct CSS classes or ARIA attributes are applied to the active sort control.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Sorting a list with connections made on the same day

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

I have multiple connections that were established on the same calendar date

### 3.4.5 When

I sort the list by 'Date Connected'

### 3.4.6 Then

The connections from the same day should be secondarily sorted alphabetically by name (A-Z) to ensure a consistent and predictable order.

### 3.4.7 Validation Notes

Requires test data with at least two connections having the same connection date. Verify their relative order is alphabetical.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Attempting to sort with no connections

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

I am a new user on the 'My Connections' page and I have zero connections

### 3.5.5 When

I view the page

### 3.5.6 Then

The sorting controls should be visible but disabled, or the page should display a message like 'You have no connections yet' instead of an empty list.

### 3.5.7 Validation Notes

Test with a user account that has no entries in the 'Connection' table.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

API fails during sort operation

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

I am on the 'My Connections' page

### 3.6.5 When

I attempt to sort by 'Date Connected' and the backend API returns an error

### 3.6.6 Then

A user-friendly error message (e.g., 'Could not sort connections. Please try again.') is displayed to me.

### 3.6.7 And

The list of connections remains in its previous state without crashing the application.

### 3.6.8 Validation Notes

Use browser developer tools or a proxy to mock a 500 server error from the connections API endpoint and observe the UI's response.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dropdown menu or a set of toggle buttons on the connections list page for selecting sort criteria ('Name', 'Date Connected').
- Visual indicators (e.g., icons like up/down arrows) next to the active sort criteria to show the current sort direction (ascending/descending).
- A loading indicator (e.g., a spinner) that displays while the sorted list is being fetched and rendered.

## 4.2.0 User Interactions

- Selecting a sort option triggers an asynchronous data fetch and re-renders the list without a full page reload.
- The sort state should be maintained for the duration of the user's session on the page.

## 4.3.0 Display Requirements

- Each connection in the list must display the user's name, profile picture, headline, and the date they connected.

## 4.4.0 Accessibility Needs

- The sort control must be fully keyboard accessible (navigable with Tab, selectable with Enter/Space).
- The control must use appropriate ARIA attributes, such as `aria-label` for the control group and `aria-sort` on the header if a table is used, to inform screen reader users of the current sort state.

# 5.0.0 Business Rules

- {'rule_id': 'BR-001', 'rule_description': 'The connection date is defined as the exact timestamp when the connection request was accepted, establishing the mutual connection.', 'enforcement_point': 'Backend data model (Connection entity).', 'violation_handling': 'N/A - System-enforced data point.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-044

#### 6.1.1.2 Dependency Reason

This story adds functionality to the connections list page, which must be created first by US-044.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-042

#### 6.1.2.2 Dependency Reason

The ability to accept a connection (US-042) is what creates the connection record and the associated timestamp that this story relies on for sorting.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

US-045

#### 6.1.3.2 Dependency Reason

This story is a peer to sorting by name. The UI for sorting should be designed to accommodate both options, so they should be considered together.

## 6.2.0.0 Technical Dependencies

- A backend API endpoint (GraphQL query) capable of accepting sort parameters (field and direction).
- A PostgreSQL database with a 'Connection' table that includes a `connected_at` timestamp column.
- An index on the `connected_at` column in the 'Connection' table to ensure performant sorting, especially for users with many connections.

## 6.3.0.0 Data Dependencies

- Requires existing connection data with varied connection timestamps for effective testing.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for fetching sorted connections must adhere to the system-wide P95 latency target of < 200ms under nominal load.
- The client-side re-rendering of the list for a standard page of connections (e.g., 50 items) should complete in under 200ms.

## 7.2.0.0 Security

- The API endpoint must be secured, ensuring a user can only request and view their own connections list.

## 7.3.0.0 Usability

- The sorting mechanism should be intuitive and follow common web design patterns.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Requires changes across the stack: frontend UI, backend API logic, and database query.
- The sorting logic must be correctly integrated with the existing pagination system to ensure users see a correctly sorted slice of their entire connections list on each page.

## 8.3.0.0 Technical Risks

- Potential for poor performance if the `connected_at` column in the database is not properly indexed, leading to slow queries for users with large networks.

## 8.4.0.0 Integration Points

- Frontend: Integrates with the existing 'My Connections' page component.
- Backend: Modifies the existing GraphQL resolver for fetching connections.
- Database: The query for fetching connections will be modified to include an `ORDER BY` clause.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify sorting by newest first.
- Verify toggling to oldest first.
- Verify secondary sorting by name for connections on the same day.
- Verify behavior for a user with 0 connections and 1 connection.
- Verify UI feedback (loading state, error message on API failure).
- Verify keyboard navigation and screen reader announcements for the sort control.

## 9.3.0.0 Test Data Needs

- A test user with 0 connections.
- A test user with 1 connection.
- A test user with 50+ connections with varying connection dates and times.
- A test user with at least 3 connections established on the same date but at different times.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- A backend testing framework (e.g., Jest with Supertest) for API integration tests.
- Cypress or Playwright for E2E testing.
- Lighthouse or Axe for accessibility audits.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other developer
- Unit and integration tests implemented with >80% code coverage for new logic
- E2E tests for the sorting functionality are passing
- User interface reviewed for consistency and usability
- Performance testing confirms API latency is within the 200ms P95 target
- Accessibility of the sort control is validated against WCAG 2.1 AA
- API documentation (GraphQL schema) is updated if necessary
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

2

## 11.2.0.0 Priority

🟡 Medium

## 11.3.0.0 Sprint Considerations

- This story should be prioritized after the core functionality of viewing the connections list (US-044) is complete.
- Can be worked on in parallel or sequentially with the 'Sort by Name' story (US-045) as they affect the same UI component.

## 11.4.0.0 Release Impact

Enhances the core networking feature. Its inclusion improves the overall quality and usability of the connection management functionality in a release.

