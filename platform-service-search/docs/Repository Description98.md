# 1 Id

REPO-SVC-SEARCH

# 2 Name

platform-service-search

# 3 Description

This microservice provides the platform's user search functionality, as detailed in SRS section 1.6. It is a read-optimized service that acts as a facade for the OpenSearch cluster. Its responsibilities include consuming 'UserProfileUpdated' events, transforming the profile data into a denormalized search document, and indexing it in OpenSearch. It also exposes a gRPC endpoint that translates user search queries into complex OpenSearch queries, supporting features like full-text search, fuzzy matching, and filtering. Decomposed from the 'platform-api' monorepo, its separation allows the resource-intensive indexing and querying operations to be scaled independently, preventing them from impacting the performance of the primary transactional database.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Services.Search

# 6 Output Path

services/search

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, TypeScript, gRPC, OpenSearch

# 10 Thirdparty Libraries

- @nestjs/microservices
- @opensearch-project/opensearch

# 11 Layer Ids

- application-service-layer

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-CORE

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-030

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-031

## 13.3.0 Requirement Id

### 13.3.1 Requirement Id

REQ-1-032

## 13.4.0 Requirement Id

### 13.4.1 Requirement Id

REQ-1-033

## 13.5.0 Requirement Id

### 13.5.1 Requirement Id

REQ-1-034

## 13.6.0 Requirement Id

### 13.6.1 Requirement Id

REQ-1-035

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservice (CQRS Read-Side)

# 17.0.0 Architecture Map

- search-service-009

# 18.0.0 Components Map

- search-service-008

# 19.0.0 Requirements Map

- REQ-1-030

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-02-API

## 20.3.0 Decomposition Reasoning

Search is a specialized concern that requires a dedicated search engine (OpenSearch) and a different data model (denormalized documents). Isolating this in a separate service is a classic CQRS pattern that allows the search infrastructure to be managed, scaled, and optimized independently from the primary OLTP databases, ensuring high performance for both write and search operations.

## 20.4.0 Extracted Responsibilities

- Indexing user profile data into OpenSearch
- Translating API search requests into OpenSearch queries
- Implementing relevance ranking and filtering
- Respecting user privacy settings in search results

## 20.5.0 Reusability Scope

- The service can be extended to index other types of content, such as posts or comments.

## 20.6.0 Development Benefits

- Allows a team to become experts in search technology (OpenSearch).
- Prevents complex search queries from impacting the primary PostgreSQL database.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Svc-Prf

### 21.1.1 Required Interfaces

*No items available*

### 21.1.2 Integration Pattern

Consumes 'UserProfileUpdated' events to stay synchronized.

### 21.1.3 Communication Protocol

Event Bus (SNS/SQS)

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'SearchService (gRPC)', 'methods': ['searchUsers(SearchRequest) : SearchResponse'], 'events': [], 'properties': [], 'consumers': ['REPO-GW-API']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Consumes profile update events to trigger re-index... |
| Data Flow | Reads events from the bus and writes denormalized ... |
| Error Handling | Handles OpenSearch connection errors gracefully. U... |
| Async Patterns | Indexing is fully asynchronous and event-driven. |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Use the official OpenSearch client library for Nod... |
| Performance Considerations | Define an optimized index mapping in OpenSearch fo... |
| Security Considerations | The search query logic must dynamically add filter... |
| Testing Approach | Integration testing is key to verify that profile ... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- Search by name, title, company, skills.
- Fuzzy matching for typos.
- Filtering by location, company, connection degree.

## 25.2.0 Must Not Implement

- Storing the canonical user profile data (source of truth).
- Search for content other than users (in this phase).

## 25.3.0 Extension Points

- Adding search for posts, comments, or company pages.
- Implementing more advanced relevance and machine learning models for ranking.

## 25.4.0 Validation Rules

*No items available*

