# Platform Engagement Microservice

This microservice is dedicated to managing high-volume, lightweight user interactions with content, specifically reactions (likes), comments, and skill endorsements. Its purpose is to offload these frequent, high-throughput write operations from the main Posts and Profile services.

## Overview

Decomposed from a monorepo, it owns the `PostReaction`, `Comment`, and `SkillEndorsement` tables. It is designed to be highly scalable and resilient. It publishes events like `PostReacted` or `CommentAdded` which the Notifications service consumes to inform users of engagement with their content. This separation allows the core content services to remain stable while the engagement system can be scaled independently to handle potentially viral activity.

### Technology Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API Protocol**: [gRPC](https://grpc.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Containerization**: [Docker](https://www.docker.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- Access to a PostgreSQL database

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    cd platform-service-engagement
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Update the `.env` file with your database connection string and other required variables.

4.  Generate Prisma Client:
    ```bash
    npx prisma generate
    ```

### Running the Application (Local Development)

This service can be run locally for development and testing using Docker Compose, which will spin up the service and a dedicated PostgreSQL database.

1.  Start the services:
    ```bash
    docker-compose up --build
    ```

2.  The gRPC server will be running on `localhost:50053`.

3.  To apply database migrations:
    ```bash
    docker-compose exec engagement-service npx prisma migrate dev
    ```

### Running Tests

- **Unit Tests**:
  ```bash
  npm run test
  ```

- **E2E Tests**:
  ```bash
  npm run test:e2e
  ```

- **Test Coverage**:
  ```bash
  npm run test:cov
  ```

## API

This service exposes a gRPC API for internal communication. The service contract is defined in `proto/engagement.proto`. All client-side applications should interact with this service via the API Gateway.

## Architecture

The service follows Clean Architecture and Domain-Driven Design (DDD) principles. The code is organized into modules representing bounded contexts (`comments`, `reactions`, `endorsements`), with clear separation between:

- **Domain**: Core business logic and entities.
- **Application**: Use cases (Commands/Queries) that orchestrate the domain.
- **Infrastructure**: Concrete implementations of external concerns (e.g., Prisma repositories).
- **Presentation**: The API layer (gRPC controllers).