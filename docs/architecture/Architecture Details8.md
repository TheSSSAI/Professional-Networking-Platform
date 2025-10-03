# 1 Style

Microservices

# 2 Patterns

## 2.1 API Gateway

### 2.1.1 Name

API Gateway

### 2.1.2 Description

A single entry point for all client requests, routing them to the appropriate backend microservice. It handles cross-cutting concerns like authentication, rate limiting, and provides a unified GraphQL API.

### 2.1.3 Benefits

- Decouples clients from microservices.
- Simplifies the client application by providing a single endpoint.
- Centralizes cross-cutting concerns like authentication, logging, and rate limiting.
- Enables protocol translation between client-facing APIs (GraphQL) and internal protocols (gRPC).

### 2.1.4 Applicability

#### 2.1.4.1 Scenarios

- Providing a unified interface to a system of microservices.
- Securing and managing access to backend services.

## 2.2.0.0 Domain-Driven Design (DDD)

### 2.2.1.0 Name

Domain-Driven Design (DDD)

### 2.2.2.0 Description

An approach to software development that focuses on modeling the software to match a domain according to input from that domain's experts. Microservices are designed around bounded contexts representing business domains.

### 2.2.3.0 Benefits

- Creates a common, ubiquitous language between developers and domain experts.
- Leads to a more maintainable and scalable system by aligning service boundaries with business capabilities.
- Encapsulates complex business logic within well-defined domains.

### 2.2.4.0 Applicability

#### 2.2.4.1 Scenarios

- Complex systems with significant business logic.
- Decomposing a large system into smaller, more manageable microservices.

## 2.3.0.0 Command Query Responsibility Segregation (CQRS)

### 2.3.1.0 Name

Command Query Responsibility Segregation (CQRS)

### 2.3.2.0 Description

A pattern that separates read and write operations for a data store. Commands update data, and Queries read data. This allows for separate optimization of read and write workloads.

### 2.3.3.0 Benefits

- Allows for independent scaling of read and write models.
- Optimizes data models for queries, leading to better performance.
- Enhances security by separating update and read responsibilities.

### 2.3.4.0 Applicability

#### 2.3.4.1 Scenarios

- High-performance applications where read and write workloads have different characteristics.
- Systems using event sourcing.
- Applications where data is read from a different store than it is written to (e.g., OpenSearch for search queries).

## 2.4.0.0 Event-Driven Architecture

### 2.4.1.0 Name

Event-Driven Architecture

### 2.4.2.0 Description

A paradigm where services communicate asynchronously by producing and consuming events. This promotes loose coupling and improves scalability and resilience.

### 2.4.3.0 Benefits

- Decouples services, allowing them to evolve independently.
- Improves system resilience as the failure of one service does not immediately impact others.
- Enables asynchronous workflows and enhances scalability.
- Provides an audit trail of events.

### 2.4.4.0 Applicability

#### 2.4.4.1 Scenarios

- Asynchronous processing such as news feed fan-out and search indexing.
- Integrating disparate systems in a loosely coupled manner.
- Building reactive and scalable applications.

# 3.0.0.0 Layers

## 3.1.0.0 L1_PRESENTATION

### 3.1.1.0 Id

L1_PRESENTATION

### 3.1.2.0 Name

Presentation Layer (Client SPA)

### 3.1.3.0 Description

The client-facing Single Page Application (SPA) that users interact with. It is responsible for rendering the UI, managing client-side state, and communicating with the backend via the API Gateway.

### 3.1.4.0 Technologystack

Next.js 14, React 18, TypeScript 5, MUI Component Library

### 3.1.5.0 Language

TypeScript

### 3.1.6.0 Type

🔹 Presentation

### 3.1.7.0 Responsibilities

- Render user interface components based on application state.
- Handle all user input and interactions.
- Utilize Server-Side Rendering (SSR) for initial page loads to improve performance and SEO.
- Communicate with the API Gateway using GraphQL for data fetching and mutations.
- Manage real-time connections using the Socket.IO client for messaging and notifications.
- Implement client-side data validation for immediate user feedback.
- Manage user session tokens (Access and Refresh JWTs).
- Ensure the UI is responsive and meets WCAG 2.1 AA accessibility standards.

### 3.1.8.0 Components

- UI Component Library (Profile, Feed, Messaging, Search)
- State Management Client (e.g., Redux Toolkit, Zustand)
- GraphQL Client (e.g., Apollo Client)
- WebSocket Client (Socket.IO)
- Routing Module (Next.js Router)
- Authentication Module

### 3.1.9.0 Dependencies

- {'layerId': 'L2_APIGATEWAY', 'type': 'Required'}

## 3.2.0.0 L2_APIGATEWAY

### 3.2.1.0 Id

L2_APIGATEWAY

### 3.2.2.0 Name

API Gateway

### 3.2.3.0 Description

A managed service that acts as the single entry point for all client API calls. It forwards requests to the appropriate microservices and handles cross-cutting concerns.

### 3.2.4.0 Technologystack

AWS API Gateway

### 3.2.5.0 Type

🔹 APIGateway

### 3.2.6.0 Responsibilities

- Expose a single, versioned GraphQL endpoint to client applications.
- Route incoming GraphQL queries and mutations to the correct downstream microservices.
- Authenticate all incoming requests by validating the JWT access token.
- Enforce rate limiting and throttling policies to prevent abuse.
- Aggregate responses from multiple microservices for a single client request.
- Provide a layer of abstraction between the client and the internal microservice architecture.

### 3.2.7.0 Dependencies

- {'layerId': 'L3_APPLICATION_SERVICES', 'type': 'Required'}

## 3.3.0.0 L3_APPLICATION_SERVICES

### 3.3.1.0 Id

L3_APPLICATION_SERVICES

### 3.3.2.0 Name

Application Services Layer (Backend Microservices)

### 3.3.3.0 Description

A collection of independent, business-capability-oriented microservices. Each service has its own codebase, manages its own data, and communicates with other services via gRPC and an event bus.

### 3.3.4.0 Technologystack

Node.js 20 (LTS), NestJS 10, TypeScript 5, gRPC, Docker, Kubernetes (AWS EKS)

### 3.3.5.0 Language

TypeScript

### 3.3.6.0 Type

🔹 ApplicationServices

### 3.3.7.0 Responsibilities

- Implement the core business logic of the application within distinct service boundaries (e.g., User Profiles, Connections, Posts).
- Expose gRPC endpoints for synchronous, internal request/response communication.
- Publish events to a message bus for asynchronous communication and to notify other services of state changes.
- Consume events from other services to react to changes in the system.
- Perform authoritative server-side data validation and sanitization.
- Interact with data stores (PostgreSQL, Redis, OpenSearch) to persist and retrieve domain data.
- Manage application secrets and configuration.
- Be packaged as Docker containers and orchestrated by Kubernetes.

### 3.3.8.0 Components

- Identity & Access Service
- User Profile Service
- Connections Service
- Posts Service
- Engagement Service
- Feed Service
- Messaging Service
- Search Service
- Notifications Service
- Admin Service

### 3.3.9.0 Dependencies

#### 3.3.9.1 Required

##### 3.3.9.1.1 Layer Id

L4_INFRASTRUCTURE

##### 3.3.9.1.2 Type

🔹 Required

#### 3.3.9.2.0 Required

##### 3.3.9.2.1 Layer Id

L5_CROSS_CUTTING

##### 3.3.9.2.2 Type

🔹 Required

## 3.4.0.0.0 L4_INFRASTRUCTURE

### 3.4.1.0.0 Id

L4_INFRASTRUCTURE

### 3.4.2.0.0 Name

Infrastructure Layer (Data & Cloud Services)

### 3.4.3.0.0 Description

The persistence and external services layer. It consists of managed cloud services for databases, caching, storage, email, and content delivery.

### 3.4.4.0.0 Technologystack

AWS RDS (PostgreSQL 16), AWS ElastiCache (Redis 7), AWS OpenSearch, AWS S3, AWS SES, Cloudflare CDN

### 3.4.5.0.0 Type

🔹 Infrastructure

### 3.4.6.0.0 Responsibilities

- Provide durable, relational data storage for core application entities (PostgreSQL).
- Provide a high-performance, in-memory cache for frequently accessed data and session management (Redis).
- Provide a dedicated, managed search engine for complex text search capabilities (OpenSearch).
- Provide scalable and secure object storage for user-uploaded media (S3).
- Provide a reliable service for sending transactional emails (SES).
- Provide global, low-latency content delivery and security services (Cloudflare).

## 3.5.0.0.0 L5_CROSS_CUTTING

### 3.5.1.0.0 Id

L5_CROSS_CUTTING

### 3.5.2.0.0 Name

Cross-Cutting Concerns

### 3.5.3.0.0 Description

Concerns that span multiple layers and services, implemented as shared libraries, middleware, or sidecar containers.

### 3.5.4.0.0 Technologystack

OpenTelemetry, Prometheus, Grafana, Loki, Jaeger, PagerDuty, GitHub Actions, Terraform

### 3.5.5.0.0 Type

🔹 CrossCutting

### 3.5.6.0.0 Responsibilities

- Provide a unified observability stack for metrics, logging, and distributed tracing.
- Implement CI/CD pipelines for automated building, testing, security scanning, and deployment.
- Define and manage all cloud infrastructure as code.
- Handle alerting and on-call notifications for critical system events.
- Provide shared utilities for security, configuration management, and exception handling.

