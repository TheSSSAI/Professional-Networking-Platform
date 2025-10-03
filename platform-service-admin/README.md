# Platform Admin Service

This microservice provides the backend functionality for the administrative dashboard, as specified in SRS section 1.8. It is a highly privileged service responsible for content moderation, user management, and system configuration.

## Overview

The Admin Service is a critical, security-sensitive hub for system governance. Its design is command-oriented, acting as an orchestrator that consumes events and issues synchronous gRPC commands to enforce administrative decisions. Its most vital internal responsibility is the creation of an immutable audit trail for all administrative actions.

### Core Responsibilities

-   **Content Moderation**: Consumes `ContentReported` events, manages a moderation queue, and orchestrates actions like dismissing reports or removing content.
-   **User Management**: Provides administrative capabilities to search for users, view details, and trigger support actions like password resets.
-   **System Configuration**: Manages system-wide settings, such as feature flags.
-   **Immutable Auditing**: Records every administrative action into a secure, append-only audit log.

## Technology Stack

-   **Framework**: [NestJS](https://nestjs.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Communication**: [gRPC](https://grpc.io/) for inter-service communication
-   **Containerization**: [Docker](https://www.docker.com/)

## Getting Started

### Prerequisites

-   Node.js (v20 or later)
-   npm (v10 or later)
-   Docker and Docker Compose
-   A `.env` file created from `.env.example` with the appropriate values.

### Local Development

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Set up the Database**:
    Run the services defined in `docker-compose.yml` to start the PostgreSQL database.
    ```bash
    docker-compose up -d postgres-admin
    ```

3.  **Run Database Migrations**:
    Apply the database schema using Prisma Migrate.
    ```bash
    npx prisma migrate dev
    ```

4.  **Generate gRPC Typings and Prisma Client**:
    ```bash
    npm run proto:generate
    npm run prisma:generate
    ```

5.  **Run the Application**:
    ```bash
    npm run start:dev
    ```
    The service will be running on `localhost:5001`.

## API

The service exposes its functionality via a gRPC API, defined in `proto/admin.proto`. It is consumed by a dedicated API Gateway for the admin frontend.

### Key Services

-   `AdminService`:
    -   `GetModerationQueue`: Fetches pending content reports.
    -   `TakeModerationAction`: Executes a moderation decision.
    -   `GetAuditLogs`: Retrieves the administrative action log.
    -   `GetFeatureFlags`/`UpdateFeatureFlag`: Manages feature flags.
    -   `SearchUsersAdmin`/`TriggerPasswordReset`: User management functions.

## Testing

-   **Unit Tests**:
    ```bash
    npm run test
    ```
-   **End-to-End Tests**:
    ```bash
    npm run test:e2e
    ```

## CI/CD

This repository uses GitHub Actions for its CI/CD pipeline, defined in `.github/workflows/ci.yml`. The pipeline includes the following stages:
1.  **Lint & Test**: Enforces code quality and runs all automated tests.
2.  **Security Scans**: Includes stages for Static Application Security Testing (SAST) and Software Composition Analysis (SCA).
3.  **Build & Push**: Builds a Docker image and pushes it to a container registry (e.g., AWS ECR).