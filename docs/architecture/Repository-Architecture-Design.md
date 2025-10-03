# Professional Networking Platform - Enterprise Architecture Documentation

## Executive Summary

This document outlines the enterprise architecture for the Professional Networking Platform, a cloud-native solution designed to emulate the core functionalities of LinkedIn. The architecture is founded on a robust, scalable, and maintainable microservices model deployed on Amazon Web Services (AWS), leveraging containerization with Docker and orchestration with Kubernetes (EKS). The primary goal of this architecture is to support rapid, parallel development, ensure high availability (99.9% uptime), and provide a foundation for future feature expansion.

The system is built on a consistent TypeScript-centric technology stack, with a Next.js Single Page Application (SPA) for the frontend and NestJS for the backend services. Key architectural patterns include the API Gateway pattern for a unified client entry point, Command Query Responsibility Segregation (CQRS) for read-intensive features like the news feed and search, and an event-driven approach using a publish-subscribe model for decoupling services. Communication is handled through a mix of protocols tailored to specific needs: GraphQL for client-server interaction, high-performance gRPC for internal synchronous communication, and WebSockets for real-time features like messaging and notifications.

The strategic decomposition of monolithic repositories into a domain-aligned polyrepo structure enables team autonomy, independent deployment pipelines, and enforces strict, versioned contracts between services. This design directly addresses the platform's complex functional and non-functional requirements, delivering a solution that is secure, observable, and built for scale.

## Solution Architecture Overview

The solution is a cloud-native platform designed with a clear separation of concerns across multiple architectural layers. The technology stack was chosen for its strong TypeScript support, performance characteristics, and robust ecosystem for building scalable, distributed systems.

**Technology Stack:**
- **Frontend:** Next.js (React), TypeScript, MUI Component Library
- **Backend:** Node.js, NestJS, TypeScript
- **Databases & Caching:** PostgreSQL (AWS RDS), Redis (AWS ElastiCache), OpenSearch
- **Communication:** GraphQL (Client API), gRPC (Internal Services), WebSockets (Real-time), AWS SNS/SQS (Event Bus)
- **Infrastructure:** AWS (EKS, S3, SES), Docker, Kubernetes, Terraform
- **CI/CD & Observability:** GitHub Actions, Prometheus, Grafana, Loki, Jaeger

**Architectural Patterns:**
- **Microservices:** The backend is composed of single-responsibility services aligned with business domains (e.g., Identity, Profile, Connections).
- **API Gateway:** A single, federated GraphQL gateway provides a unified API for all client applications, handling authentication and rate limiting.
- **Publish-Subscribe:** An event-driven architecture is used for asynchronous communication, decoupling services and enabling scalable workflows like news feed generation.
- **CQRS (Command Query Responsibility Segregation):** Read-optimized models are used for performance-critical queries. The Feed Service (Redis-based) and Search Service (OpenSearch-based) are prime examples.
- **Database per Service:** Each microservice owns its own data, ensuring loose coupling and independent data model evolution.
- **Infrastructure as Code (IaC):** All cloud infrastructure is managed declaratively using Terraform for repeatability and version control.

## Repository Architecture Strategy

The project has been intentionally structured using a polyrepo approach, where each microservice, application, and shared library resides in its own version-controlled repository. This strategy is a direct result of decomposing initial monolithic structures (`platform-api`, `platform-web`) into components aligned with Domain-Driven Design (DDD) principles.

**Decomposition Rationale:**
- **Team Autonomy:** Enables small, focused teams to own the full lifecycle of their service(s) from development to deployment and operations.
- **Independent Deployability:** A change to one service (e.g., `platform-service-profile`) can be deployed without requiring the redeployment of any other service. This significantly increases deployment velocity and reduces the risk of release coordination failures.
- **Technology Flexibility:** While a consistent stack is used initially, this structure allows for a specific service to adopt a different technology in the future if its requirements dictate, without impacting the rest of the system.
- **Enforced Contracts:** All inter-service communication is governed by formal contracts defined in the `platform-contracts` repository. This prevents implicit or brittle integrations and forces deliberate, versioned changes to APIs and events.

**Development Workflow:**
Teams work in parallel on their respective repositories. The shared libraries (`platform-contracts`, `platform-core-libs`, `platform-ui-components`) are published as versioned packages to a private registry. Services declare their dependency on specific versions of these libraries, ensuring that changes to shared code are adopted in a controlled manner.

## System Architecture Diagrams

### Repository Dependency Architecture

This diagram illustrates the complete repository structure, their dependencies, and the architectural layers of the system. It shows how applications, gateways, services, and libraries interact.


### Component Integration Patterns

This diagram illustrates the primary communication patterns for two key user flows: creating a post and sending a real-time message.

mermaid
sequenceDiagram
    participant User
    participant WebApp as Platform Web App (SPA)
    participant APIGW as API Gateway
    participant PostsSvc as Posts Service
    participant EventBus as SNS/SQS
    participant FeedSvc as Feed Service
    participant NotifySvc as Notifications Service
    participant MsgSvc as Messaging Service

    %% Flow 1: User Creates a Post
    Note over User, NotifySvc: Flow 1: Asynchronous Post Creation & Fan-Out
    User->>WebApp: 1. Create Post
    WebApp->>APIGW: 2. GraphQL Mutation (createPost)
    APIGW->>PostsSvc: 3. gRPC call (createPost)
    PostsSvc-->>APIGW: 4. gRPC Response
    APIGW-->>WebApp: 5. GraphQL Response
    WebApp-->>User: 6. Post appears in UI

    par Asynchronous Fan-out
        PostsSvc->>EventBus: 7. Publish `PostCreated` Event
    and
        EventBus-->>FeedSvc: 8a. Consume Event
        FeedSvc->>FeedSvc: 9a. Fan-out to Connections' Feeds (in Redis)
    and
        EventBus-->>NotifySvc: 8b. Consume Event (if mentions)
        NotifySvc->>NotifySvc: 9b. Generate Notifications
    end

    %% Flow 2: User Sends a Message
    Note over User, MsgSvc: Flow 2: Real-time Messaging
    User->>WebApp: 10. Type & Send Message
    WebApp->>MsgSvc: 11. WebSocket emit ('sendMessage')
    MsgSvc->>MsgSvc: 12. Persist Message & Authorize
    MsgSvc-->>WebApp: 13. WebSocket push ('newMessage') to Recipient


## Repository Catalog

The system is composed of 18 distinct repositories, each with a clearly defined responsibility:

| ID                 | Repository Name               | Type                  | Description                                                                                             |
|--------------------|-------------------------------|-----------------------|---------------------------------------------------------------------------------------------------------|
| **REPO-APP-WEB**   | `platform-web-app`            | Application Services  | The primary user-facing Next.js Single Page Application.                                                |
| **REPO-APP-ADMIN** | `platform-admin-ui`           | Application Services  | The internal-facing Next.js application for the Admin Dashboard.                                        |
| **REPO-GW-API**    | `platform-api-gateway`        | Infrastructure        | AWS API Gateway configuration, providing a federated GraphQL endpoint.                                  |
| **REPO-SVC-IDT**   | `platform-service-identity`   | Business Logic        | Manages user accounts, authentication, authorization, and JWTs.                                         |
| **REPO-SVC-PRF**   | `platform-service-profile`    | Business Logic        | Manages all user profile data, including experience, education, and skills.                             |
| **REPO-SVC-CONN**  | `platform-service-connections`  | Business Logic        | Manages the social graph and connection requests between users.                                         |
| **REPO-SVC-POSTS** | `platform-service-posts`      | Business Logic        | Manages the lifecycle of user-generated posts and associated media.                                     |
| **REPO-SVC-ENGAGE**| `platform-service-engagement` | Business Logic        | Manages high-volume interactions like comments, reactions, and endorsements.                            |
| **REPO-SVC-FEED**  | `platform-service-feed`       | Application Services  | A read-optimized service that generates and serves news feeds using a fan-out-on-write model.         |
| **REPO-SVC-MSG**   | `platform-service-messaging`  | Application Services  | A stateful service that manages real-time messaging via WebSockets.                                     |
| **REPO-SVC-SEARCH**| `platform-service-search`     | Application Services  | A read-optimized service that powers user search via an OpenSearch index.                               |
| **REPO-SVC-NOTIFY**| `platform-service-notifications`| Application Services  | Consumes events to generate and deliver real-time notifications to users.                               |
| **REPO-SVC-ADMIN** | `platform-service-admin`      | Business Logic        | Provides backend functionality for the Admin Dashboard, including moderation and audit logging.       |
| **REPO-LIB-CONTRACTS**| `platform-contracts`          | Cross-Cutting Library | Defines all data contracts: GraphQL schemas, gRPC protos, and event payloads.                           |
| **REPO-LIB-CORE**  | `platform-core-libs`          | Cross-Cutting Library | Contains shared backend code for logging, observability, and other cross-cutting concerns.            |
| **REPO-LIB-UI**    | `platform-ui-components`      | Cross-Cutting Library | A shared React component library (built with MUI and Storybook) for frontend consistency.               |
| **REPO-INFRA**     | `platform-infra`              | Infrastructure        | Contains all Terraform code for provisioning AWS infrastructure.                                        |
| **REPO-OBS**       | `platform-observability`      | Infrastructure        | Contains configuration for monitoring, including Prometheus alerts and Grafana dashboards.              |

## Integration Architecture

System integration is managed through well-defined patterns and contracts to ensure decoupling and maintainability.

- **Client-to-Backend (GraphQL):** All client applications communicate with the backend via a single, versioned GraphQL API exposed by the API Gateway. This allows clients to fetch exactly the data they need in a single request, reducing network overhead. The schema is defined in the `platform-contracts` repo.

- **Internal Synchronous (gRPC):** For low-latency, request-response communication between microservices, gRPC is used. This is ideal for scenarios where a service requires immediate data from another to fulfill a request (e.g., the API Gateway calling the Profile Service). All gRPC service definitions (.proto files) are centralized in `platform-contracts`.

- **Internal Asynchronous (Event Bus):** To decouple services and handle workflows that do not require an immediate response, an event-driven pattern is used with AWS SNS (for topics) and SQS (for queues). Services publish domain events (e.g., `PostCreated`) which are consumed by other interested services. This is critical for scalability and resilience. Event payload schemas are defined in `platform-contracts`.

- **Real-time Client Updates (WebSockets):** For features requiring instant updates to the client, such as messaging and notifications, a persistent WebSocket connection is maintained between the client and the relevant backend services (`Messaging` and `Notifications`).

## Technology Implementation Framework

Implementation is standardized across services to ensure consistency and leverage the full potential of the chosen technology stack.

- **Backend Services (NestJS):** All backend services are built with NestJS, utilizing its modular architecture and dependency injection system. Data access is standardized using Prisma, a next-generation ORM that provides full type safety. Authentication logic is implemented using Passport.js with a JWT strategy.

- **Frontend Applications (Next.js):** Frontend applications leverage Next.js for its performance benefits, including Server-Side Rendering (SSR) and static generation. The MUI component library is used to accelerate development and ensure accessibility compliance, with shared components managed in the `platform-ui-components` library.

- **Shared Libraries:** Cross-cutting concerns are managed in shared, versioned libraries. `platform-core-libs` provides standardized modules for observability (logging, tracing) and security (guards) for all NestJS services.

## Performance & Scalability Architecture

The architecture is explicitly designed to meet stringent performance and scalability requirements.

- **Performance:** Key NFRs include a 95th percentile (P95) API latency of less than 200ms (REQ-1-051) and a Largest Contentful Paint (LCP) of under 2.5 seconds (REQ-1-050). These are achieved through:
    - **Low-Latency Communication:** Using gRPC for internal service calls.
    - **Optimized Read Paths:** Implementing the CQRS pattern with Redis for the news feed and OpenSearch for user search.
    - **Caching:** Caching frequently accessed data like user profiles in Redis to reduce database load.
    - **Efficient Frontend:** Using Next.js SSR and a CDN (Cloudflare) to serve assets quickly.

- **Scalability:** The architecture is designed to scale horizontally to support millions of users (REQ-1-052).
    - **Container Orchestration:** All services are containerized with Docker and deployed on Kubernetes (EKS), allowing for automated scaling based on CPU or memory load.
    - **Stateless Services:** Most services are stateless, making them trivial to scale horizontally.
    - **Decoupled Workflows:** Asynchronous, event-driven workflows allow components like the feed generation system to scale independently based on the number of incoming events in their SQS queue.
    - **Managed Services:** Leveraging scalable managed AWS services (RDS, ElastiCache, OpenSearch) reduces operational overhead.

## Development & Deployment Strategy

- **Team Organization:** Development teams are structured around business domains, with each team owning one or more microservice repositories. This fosters expertise and clear accountability.
- **CI/CD:** Each repository has an independent CI/CD pipeline configured in GitHub Actions (REQ-1-078). A typical pipeline includes stages for linting, unit/integration testing, security scanning (SAST, SCA), building a Docker image, and deploying to Kubernetes environments (Dev, Staging, Prod).
- **Infrastructure Management:** All infrastructure is provisioned via Terraform from the `platform-infra` repository. Changes to infrastructure follow a GitOps workflow with pull requests and automated plans.
- **Observability:** Monitoring configurations, including Prometheus alerts and Grafana dashboards, are managed as code in the `platform-observability` repository, ensuring consistency across environments.

## Architecture Decision Records

### ADR-001: Choice of Microservices over Monolith
- **Status:** Accepted
- **Context:** The platform has complex, distinct domains (identity, content, social graph) with different scaling and data storage needs. A monolithic architecture would lead to tight coupling, deployment bottlenecks, and difficulty scaling individual components.
- **Decision:** Adopt a microservices architecture where each service is aligned with a business domain. This provides scalability, technological flexibility, and enables autonomous teams.
- **Consequences:** Increased operational complexity (deployment, monitoring, networking). This is mitigated by using Kubernetes, a service mesh, and a robust observability stack as defined in the requirements.

### ADR-002: Adoption of a Polyrepo Strategy
- **Status:** Accepted
- **Context:** With a microservices architecture, code needs to be organized. A monorepo could contain all services, but can lead to complex tooling and large checkout sizes. A polyrepo structure gives each service its own repository.
- **Decision:** Adopt a polyrepo strategy. Each application, service, and shared library will have its own repository.
- **Consequences:** Potential for dependency management challenges and code duplication. This is mitigated by publishing shared libraries (`contracts`, `core-libs`, `ui-components`) as versioned packages and using robust dependency management tools.

### ADR-003: Selection of gRPC for Internal Communication
- **Status:** Accepted
- **Context:** Internal services require low-latency, high-performance synchronous communication. Standard REST over HTTP/JSON introduces serialization overhead.
- **Decision:** Use gRPC for all synchronous, internal service-to-service communication. It uses protocol buffers for efficient serialization and is built on HTTP/2.
- **Consequences:** Less human-readable than REST/JSON. Requires a shared contract repository for `.proto` files, which is already part of the architecture (`platform-contracts`).

### ADR-004: Implementation of Fan-out-on-write for News Feed
- **Status:** Accepted
- **Context:** The news feed must be delivered to users with very low latency (REQ-1-020). Calculating the feed at read time (fan-out-on-read) for a user with many connections would be slow and computationally expensive.
- **Decision:** Implement a fan-out-on-write (push) model. When a user posts, an asynchronous process pushes the post's ID to the feed-list of every connection. Feeds are stored pre-computed in Redis.
- **Consequences:** Higher write amplification (one post can cause hundreds of writes to Redis). The system must be resilient to partial failures during fan-out. Data may have eventual consistency. This trade-off is acceptable for the massive gain in read performance. 
