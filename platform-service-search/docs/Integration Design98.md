# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | REPO-SVC-SEARCH |
| Extraction Timestamp | 2024-05-22T10:00:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 100% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-030

#### 1.2.1.2 Requirement Text

The system shall provide a prominent search bar that allows users to search for other users on the platform. The search query must be executed against users' full name, job title, company, and skills fields.

#### 1.2.1.3 Validation Criteria

- Verify the presence of a search bar in the main application layout.
- Verify that entering a name and executing a search returns relevant user profiles.
- Verify that searching by a specific job title, company, or skill returns users matching that criteria.

#### 1.2.1.4 Implementation Implications

- The service must expose an endpoint (gRPC) to receive search queries from the API Gateway.
- The service must translate these queries into OpenSearch queries that target the specified fields in the user profile index.

#### 1.2.1.5 Extraction Reasoning

This is a core functional requirement that defines the primary purpose of the Search Service: to enable user search across specific profile fields.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-031

#### 1.2.2.2 Requirement Text

The user search functionality must be implemented using a dedicated search engine, specifically a managed OpenSearch service. All user profile data intended for searching must be indexed in OpenSearch to provide fast and advanced search capabilities.

#### 1.2.2.3 Validation Criteria

- Verify that user profile data is successfully indexed into an OpenSearch cluster upon creation and updates.
- Verify that search queries are executed against the OpenSearch service, not the primary PostgreSQL database.
- Verify that deleting a user removes their data from the search index.

#### 1.2.2.4 Implementation Implications

- The service must consume events (e.g., UserProfileUpdated) to trigger the indexing of data.
- The service must contain all logic for connecting to and interacting with the AWS OpenSearch cluster.
- This defines the service's architecture as the read-side of a CQRS pattern, with OpenSearch as its read model.

#### 1.2.2.5 Extraction Reasoning

This is the primary technical requirement mandating the existence of this service and its core technology (OpenSearch), separating it from the main transactional database.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-032

#### 1.2.3.2 Requirement Text

The search indexing process must respect user-defined privacy settings. For profiles set to 'Private', only the Name and Profile Picture URL shall be indexed for searching by non-connections. For 'Public' profiles, or when a search is performed by a first-degree connection, the full-text search shall apply to all indexed profile fields (e.g., headline, experience, skills).

#### 1.2.3.3 Validation Criteria

- Verify that when a non-connection searches for a user with a private profile, they can only find them by name.
- Verify that when a first-degree connection searches for a user with a private profile, they can find them by details like job title or skills.
- Verify that any user can search for a user with a public profile using any of their indexed profile details.

#### 1.2.3.4 Implementation Implications

- The service's search query logic must be dynamic, adding filters based on the searching user's relationship to the potential results.
- The event consumer logic for indexing must correctly transform and store profile data based on the profile's visibility setting, as detailed in the UserProfileIndex schema.

#### 1.2.3.5 Extraction Reasoning

This is a critical security and business logic requirement that must be implemented within the Search Service's query and indexing logic, as confirmed by sequence diagrams and the UserProfileIndex data model.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-033

#### 1.2.4.2 Requirement Text

The search engine implementation must support fuzzy matching to provide relevant results even when the user's search query contains typos or minor variations of the terms in the user profiles.

#### 1.2.4.3 Validation Criteria

- Verify that searching for 'Jhon Doe' returns the profile for 'John Doe'.
- Verify that searching for 'developr' returns profiles with the skill 'developer'.

#### 1.2.4.4 Implementation Implications

- The service must construct OpenSearch queries that utilize the fuzziness parameter on match queries.
- The relevance scoring may need to be tuned to ensure fuzzy matches do not outrank exact matches.

#### 1.2.4.5 Extraction Reasoning

This requirement defines a key feature of the search experience that is directly implemented by this service's OpenSearch query logic.

### 1.2.5.0 Requirement Id

#### 1.2.5.1 Requirement Id

REQ-1-034

#### 1.2.5.2 Requirement Text

The search results must be ranked based on relevance. The ranking algorithm must give higher priority to first-degree connections that match the search query over second-degree or other connections.

#### 1.2.5.3 Validation Criteria

- Given two users who match a search query equally well, verify that the user who is a first-degree connection appears higher in the results than the user who is not.

#### 1.2.5.4 Implementation Implications

- At query time, the service must make a synchronous gRPC call to the Connections Service to retrieve the searching user's first-degree connections.
- The service must use this list to construct an OpenSearch query with a function_score or boosting query to increase the relevance score of connected users.

#### 1.2.5.5 Extraction Reasoning

This requirement dictates a specific, complex relevance logic that necessitates this service's integration with the Connections Service.

### 1.2.6.0 Requirement Id

#### 1.2.6.1 Requirement Id

REQ-1-035

#### 1.2.6.2 Requirement Text

The system shall provide filtering options on the search results page to allow users to refine their search results. Filters must be available for Location, Current Company, and Connection Degree (1st, 2nd, etc.).

#### 1.2.6.3 Validation Criteria

- Verify that after performing a search, filter options for Location, Company, and Connection Degree are displayed.
- Verify that applying a 'Location' filter updates the results to show only users from that location.

#### 1.2.6.4 Implementation Implications

- The service's gRPC search endpoint must accept filter parameters.
- The service must translate these filters into filter clauses within an OpenSearch bool query to efficiently narrow down results.

#### 1.2.6.5 Extraction Reasoning

This requirement specifies advanced search capabilities that are implemented by this service's query-building logic.

## 1.3.0.0 Relevant Components

- {'component_name': 'Search Service', 'component_specification': 'A dedicated microservice responsible for all user search functionality. It acts as the read-side of a CQRS pattern, consuming profile update events, indexing denormalized data into an OpenSearch cluster, and exposing a gRPC API to execute complex search queries with filtering and relevance ranking.', 'implementation_requirements': ['Must be built using NestJS and TypeScript.', 'Must use the official OpenSearch client library for all interactions with the search cluster.', "Must implement an SQS consumer to handle 'UserProfileUpdated' events.", 'Must implement a gRPC server to expose the searchUsers method.'], 'architectural_context': 'Belongs to the Application Services Layer (L3). It is a core domain service that encapsulates the specialized logic for search, decoupled from the main transactional services.', 'extraction_reasoning': "This is the canonical component that the platform-service-search repository is tasked with implementing. Its responsibilities directly align with the repository's definition."}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Application Services Layer (Backend Microservices)', 'layer_responsibilities': 'This layer contains independent, business-capability-oriented microservices. Each service manages its own data (or read-model) and communicates with other services via gRPC for synchronous calls and an event bus for asynchronous updates. The Search Service is a key component of this layer.', 'layer_constraints': ['All services must be developed using NestJS and TypeScript.', 'Services must be packaged as Docker containers.', 'Inter-service communication must use gRPC.'], 'implementation_patterns': ['Domain-Driven Design (DDD)', 'Command Query Responsibility Segregation (CQRS)', 'Event-Driven Architecture'], 'extraction_reasoning': 'The Search Service is explicitly defined as a microservice within this layer, adhering to its technology stack, communication protocols, and architectural patterns (CQRS, Event-Driven).'}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

UserProfileUpdated Event

#### 1.5.1.2 Source Repository

REPO-SVC-PRF

#### 1.5.1.3 Method Contracts

- {'method_name': 'OnUserProfileUpdated', 'method_signature': 'EventPayload: { userId: string }', 'method_purpose': "To trigger the re-indexing of a user's profile in OpenSearch when their data changes in the primary database.", 'integration_context': 'This is an asynchronous consumer. Upon receiving the event, it must make a gRPC call to the Profile Service to fetch the complete, updated profile data for indexing. It must be idempotent and use a Dead Letter Queue (DLQ) for failed messages.'}

#### 1.5.1.4 Integration Pattern

Event-Driven (Pub/Sub)

#### 1.5.1.5 Communication Protocol

AWS SNS/SQS

#### 1.5.1.6 Extraction Reasoning

This asynchronous dependency is the primary mechanism for keeping the search index eventually consistent with the source-of-truth profile data, forming the core of the CQRS pattern for this service as shown in SEQ-246.

### 1.5.2.0 Interface Name

#### 1.5.2.1 Interface Name

IProfileService

#### 1.5.2.2 Source Repository

REPO-SVC-PRF

#### 1.5.2.3 Method Contracts

- {'method_name': 'getFullProfileForIndexing', 'method_signature': 'getFullProfileForIndexing(request: { userId: string }): Promise<FullProfileDto>', 'method_purpose': 'To retrieve the complete, denormalized user profile data required for creating a search index document.', 'integration_context': "Called synchronously by the Search Service's event consumer after receiving a 'UserProfileUpdated' event to ensure the most current data is indexed."}

#### 1.5.2.4 Integration Pattern

Synchronous Request/Response

#### 1.5.2.5 Communication Protocol

gRPC

#### 1.5.2.6 Extraction Reasoning

The CQRS sync sequence (SEQ-246) mandates that upon receiving a lightweight update event, the service must make a synchronous call to the authoritative source (Profile Service) to fetch the full data for indexing, ensuring data consistency.

### 1.5.3.0 Interface Name

#### 1.5.3.1 Interface Name

IConnectionsService

#### 1.5.3.2 Source Repository

REPO-SVC-CONN

#### 1.5.3.3 Method Contracts

- {'method_name': 'getFirstDegreeConnectionIds', 'method_signature': 'getFirstDegreeConnectionIds(request: { userId: string }): Promise<{ connectionIds: string[] }>', 'method_purpose': "To retrieve a list of a user's first-degree connection IDs.", 'integration_context': 'Called synchronously at search query time to fetch the connection list of the searching user. This data is used to boost the relevance score of connected users in the search results, as required by REQ-1-034. The results of this call must be cached in Redis to meet performance NFRs.'}

#### 1.5.3.4 Integration Pattern

Synchronous Request/Response

#### 1.5.3.5 Communication Protocol

gRPC

#### 1.5.3.6 Extraction Reasoning

This synchronous dependency is necessary to fulfill the relevance ranking requirement (REQ-1-034). The existence of this call is explicitly validated by the User Search sequence diagram (SEQ-256) and identified as a performance bottleneck requiring a caching mitigation.

### 1.5.4.0 Interface Name

#### 1.5.4.1 Interface Name

IOpenSearchClient

#### 1.5.4.2 Source Repository

REPO-INFRA

#### 1.5.4.3 Method Contracts

##### 1.5.4.3.1 Method Name

###### 1.5.4.3.1.1 Method Name

index

###### 1.5.4.3.1.2 Method Signature

index(document: UserProfileIndex): Promise<void>

###### 1.5.4.3.1.3 Method Purpose

To add or update a denormalized user profile document in the OpenSearch index.

###### 1.5.4.3.1.4 Integration Context

Called by the event consumer after transforming the data from a 'UserProfileUpdated' event.

##### 1.5.4.3.2.0 Method Name

###### 1.5.4.3.2.1 Method Name

search

###### 1.5.4.3.2.2 Method Signature

search(query: OpenSearchDSL): Promise<SearchResults>

###### 1.5.4.3.2.3 Method Purpose

To execute a search query against the user profile index.

###### 1.5.4.3.2.4 Integration Context

Called by the gRPC searchUsers method implementation to find and rank users based on the constructed query.

##### 1.5.4.3.3.0 Method Name

###### 1.5.4.3.3.1 Method Name

delete

###### 1.5.4.3.3.2 Method Signature

delete(documentId: string): Promise<void>

###### 1.5.4.3.3.3 Method Purpose

To remove a user's document from the search index.

###### 1.5.4.3.3.4 Integration Context

Called by an event consumer listening for 'UserDeleted' or 'UserDeactivated' events to ensure search results remain consistent with the platform's user base.

#### 1.5.4.4.0.0 Integration Pattern

Client-Service

#### 1.5.4.5.0.0 Communication Protocol

HTTPS via @opensearch-project/opensearch client library

#### 1.5.4.6.0.0 Extraction Reasoning

This is the primary infrastructure dependency. The service is a facade for OpenSearch, and these are the fundamental operations it needs to perform.

## 1.6.0.0.0.0 Exposed Interfaces

- {'interface_name': 'ISearchService', 'consumer_repositories': ['REPO-GW-API'], 'method_contracts': [{'method_name': 'searchUsers', 'method_signature': 'searchUsers(request: SearchRequest): Promise<SearchResponse>', 'method_purpose': 'Receives a search query, filters, and the ID of the searching user. It constructs and executes an OpenSearch query, applies relevance ranking and privacy rules, and returns a paginated list of user search results.', 'implementation_requirements': 'The SearchRequest object must include query: string, searchingUserId: string, and optional filters: { location?: string, company?: string, connectionDegree?: number[] }. The SearchResponse must contain a list of user summaries, pre-filtered according to the privacy rules defined in REQ-1-032.'}], 'service_level_requirements': ['P95 latency must be less than 200ms under nominal load.'], 'implementation_constraints': ['The interface must be defined as a gRPC service in a .proto file managed by REPO-LIB-CONTRACTS.', 'The implementation must be stateless to allow for horizontal scaling.'], 'extraction_reasoning': 'This is the sole public contract exposed by the Search Service. It is consumed by the API Gateway to fulfill client-side search requests, as validated by the architecture and sequence diagram SEQ-256.'}

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The service must be built using the NestJS framework on Node.js, with TypeScript as the primary language.

### 1.7.2.0.0.0 Integration Technologies

- gRPC
- AWS SNS/SQS
- OpenSearch
- Redis

### 1.7.3.0.0.0 Performance Constraints

The service must meet a P95 latency of <200ms for search queries. This requires optimized OpenSearch queries, an efficient index mapping, and aggressive caching of frequently accessed data from other services, such as connection lists.

### 1.7.4.0.0.0 Security Requirements

The service's most critical security responsibility is to enforce user privacy settings (REQ-1-032) at the query level, ensuring that data from private profiles is not exposed to non-connections in search results. This must be implemented server-side and cannot be bypassed.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | All specified requirements (REQ-1-030 to REQ-1-035... |
| Cross Reference Validation | The service's role and interactions are fully cons... |
| Implementation Readiness Assessment | The context is highly sufficient for implementatio... |
| Quality Assurance Confirmation | Systematic analysis confirms that all provided con... |

