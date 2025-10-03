# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | US-050 |
| Elaboration Date | 2025-01-18 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Create and Share a Post with an External Link and ... |
| As A User Story | As a content-sharing professional, I want the plat... |
| User Persona | Any active user creating a post who wants to share... |
| Business Value | Enhances user experience by making shared content ... |
| Functional Area | Content Sharing and Feed |
| Story Theme | Post Creation Experience |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Generate preview for a valid URL with full metadata

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A user is creating a new post and the post content is empty

### 3.1.5 When

the user pastes a valid, publicly accessible URL (e.g., 'https://www.example.com') that contains Open Graph metadata (title, description, image) into the post's text area

### 3.1.6 Then

an asynchronous request is triggered to fetch the URL's metadata, a loading indicator is displayed, and upon success, a preview card appears containing the fetched title, description, and image. The user can then publish the post with this preview.

### 3.1.7 Validation Notes

Verify the API call is made. Verify the loading state appears and is replaced by the preview card. Verify the card displays the correct title, description, and image. The final post in the feed must show the preview.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

User removes the generated preview before posting

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

a link preview card has been successfully generated in the post composer

### 3.2.5 When

the user clicks the 'remove' (e.g., 'X') icon on the preview card

### 3.2.6 Then

the preview card is removed from the composer, and the post can be published with only the text content (including the URL string).

### 3.2.7 Validation Notes

Test that the 'X' button is present and functional. Verify that after removal, publishing the post results in a post without a preview card.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

URL metadata is incomplete (e.g., missing image)

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given

a user pastes a valid URL into the post composer

### 3.3.5 When

the target page has metadata for title and description but is missing an Open Graph image tag

### 3.3.6 Then

a preview card is still generated, displaying the title and description, but without an image area.

### 3.3.7 Validation Notes

Use a test page with no `og:image` tag. Verify the preview card adapts its layout gracefully.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

URL metadata is missing (fallback to standard HTML tags)

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

a user pastes a valid URL into the post composer

### 3.4.5 When

the target page does not have Open Graph or Twitter Card metadata

### 3.4.6 Then

the system attempts to fall back and generate a preview using the page's `<title>` tag and `<meta name="description">` content.

### 3.4.7 Validation Notes

Use a test page with only basic HTML tags. Verify the system can extract and display this fallback data.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Pasting an invalid or malformed URL

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

a user is creating a post

### 3.5.5 When

the user types or pastes a malformed URL (e.g., 'htp://invalid-url' or 'www. no-protocol .com')

### 3.5.6 Then

no API call is triggered and no preview card or loading indicator is displayed.

### 3.5.7 Validation Notes

Test with various forms of invalid text that are not valid URLs. Ensure the URL detection logic is robust.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Target URL is unreachable or returns an error

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

a user pastes a validly formatted URL into the post composer

### 3.6.5 When

the metadata fetching service attempts to access the URL and it returns an HTTP error (e.g., 404 Not Found, 503 Service Unavailable) or times out

### 3.6.6 Then

the loading indicator disappears, and no preview card is generated. The process fails gracefully without showing an error to the user.

### 3.6.7 Validation Notes

Mock the API endpoint to simulate a 404 error and a request timeout. Verify the UI returns to its default state.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Pasting multiple URLs into a single post

### 3.7.3 Scenario Type

Edge_Case

### 3.7.4 Given

a user is creating a post

### 3.7.5 When

the user pastes two or more valid URLs into the text area

### 3.7.6 Then

the system generates a preview card for only the first valid URL found in the text.

### 3.7.7 Validation Notes

Paste text containing two distinct URLs. Verify only one preview card for the first link is generated.

## 3.8.0 Criteria Id

### 3.8.1 Criteria Id

AC-008

### 3.8.2 Scenario

Editing a post and adding a new URL

### 3.8.3 Scenario Type

Alternative_Flow

### 3.8.4 Given

a user is editing an existing post that does not contain a URL

### 3.8.5 When

the user pastes a valid URL into the text

### 3.8.6 Then

the link preview generation process is triggered, just as it would for a new post.

### 3.8.7 Validation Notes

Confirm this functionality works within the post-editing UI.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Post composer text area
- A skeleton loader or spinner component to indicate fetching is in progress
- A preview card component with placeholders for an image, title, and description
- A 'remove' icon (e.g., 'X') on the preview card

## 4.2.0 User Interactions

- URL detection should occur automatically as the user types or pastes text (with debouncing to prevent excessive API calls).
- Clicking the 'remove' icon instantly dismisses the preview card.
- On a published post, clicking anywhere on the preview card should open the external link in a new browser tab.

## 4.3.0 Display Requirements

- The preview card must be displayed below the text input area in the composer.
- Text in the title and description of the preview card must be truncated with an ellipsis if it exceeds a defined maximum length to maintain a consistent layout.

## 4.4.0 Accessibility Needs

- The loading indicator must have appropriate ARIA roles for screen readers.
- The 'remove' button on the preview card must have a clear accessible name (e.g., 'aria-label="Remove link preview"').
- The final preview card on a post must be keyboard navigable.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-LINK-001

### 5.1.2 Rule Description

Only the first valid HTTP/HTTPS URL detected in a post's text will be used to generate a preview.

### 5.1.3 Enforcement Point

Backend metadata fetching service and Frontend URL detection logic.

### 5.1.4 Violation Handling

Subsequent URLs are ignored for preview generation.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-LINK-002

### 5.2.2 Rule Description

The metadata fetching service must have a request timeout of 5 seconds to prevent system delays from slow external sites.

### 5.2.3 Enforcement Point

Backend metadata fetching service.

### 5.2.4 Violation Handling

If a request times out, it is treated as a failure, and no preview is generated.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

US-048

#### 6.1.1.2 Dependency Reason

The basic functionality to create and share a text post must exist before it can be enhanced with link previews.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

US-051

#### 6.1.2.2 Dependency Reason

The link preview functionality should also be available when a user edits an existing post.

## 6.2.0.0 Technical Dependencies

- A backend service/endpoint for securely fetching and parsing external URL metadata.
- A frontend component library (MUI) for displaying the card and loading state.
- The primary PostgreSQL database to store post data, including a reference to the generated preview metadata.

## 6.3.0.0 Data Dependencies

*No items available*

## 6.4.0.0 External Dependencies

- The availability, performance, and metadata quality of third-party websites being linked to.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The URL detection logic on the client-side must not introduce noticeable input lag.
- The API endpoint for fetching metadata should have a P95 latency of under 2000ms, acknowledging the dependency on external network calls.
- The fetching process must be fully asynchronous and not block any UI rendering.

## 7.2.0.0 Security

- The backend service that fetches URL metadata MUST be architected to prevent Server-Side Request Forgery (SSRF). It must validate URLs and not follow redirects to internal/private IP ranges.
- All fetched metadata (title, description) MUST be sanitized before being stored or rendered in the UI to prevent Cross-Site Scripting (XSS) attacks.
- The service should use a generic, non-identifiable User-Agent string to respect privacy and avoid being easily blocked.

## 7.3.0.0 Usability

- The process of generating a preview should feel automatic and seamless to the user.
- The loading state must provide clear feedback that the system is working.

## 7.4.0.0 Accessibility

- Must adhere to WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Building a secure, sandboxed backend service for fetching external content is non-trivial and requires careful design to mitigate SSRF risks.
- Handling the variety of responses from external websites (slow responses, malformed HTML, missing metadata) requires robust error handling and fallback logic.
- Implementing a responsive and accessible preview card component on the frontend.

## 8.3.0.0 Technical Risks

- SSRF vulnerability if the fetching service is not properly secured.
- Poor user experience if external site timeouts are not handled gracefully.
- Inconsistent preview quality due to the lack of standardized metadata on many websites.

## 8.4.0.0 Integration Points

- Frontend Post Composer Component -> API Gateway -> Backend Link Preview Service
- Backend Link Preview Service -> External Websites
- Backend Post Service -> Primary Database (PostgreSQL)

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Performance

## 9.2.0.0 Test Scenarios

- Pasting a URL with complete OG tags.
- Pasting a URL with missing OG tags (fallback case).
- Pasting a URL that will time out.
- Pasting a URL that returns a 404/500 error.
- Pasting text with multiple URLs.
- Pasting a URL, removing the preview, and posting.
- Security scan specifically targeting SSRF and XSS vectors in the preview generation flow.

## 9.3.0.0 Test Data Needs

- A set of controlled web pages with different metadata configurations (full OG, partial OG, no OG, malicious content for sanitization testing).

## 9.4.0.0 Testing Tools

- Jest/Vitest for unit tests.
- Cypress or Playwright for E2E tests.
- OWASP ZAP or similar tool for security vulnerability scanning.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least two peers
- Unit and integration tests implemented with >80% coverage for new code
- E2E tests for the happy path and key error conditions are passing
- A formal security review of the metadata fetching service has been completed and any findings addressed
- Performance of the API endpoint is benchmarked and meets requirements
- UI component is responsive and meets WCAG 2.1 AA accessibility standards
- Documentation for the Link Preview API endpoint is created/updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- Requires both frontend and backend development, which should be coordinated.
- The security implications of the backend service warrant extra time for design, review, and testing.

## 11.4.0.0 Release Impact

This is a key feature for achieving a minimum viable product for content sharing. Its absence would be a noticeable gap compared to competitor platforms.

