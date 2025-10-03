# Platform Service: Notifications

This microservice is responsible for informing users of relevant activity on the platform, as defined in SRS section 1.7. It is an event-driven service that consumes events from various other microservices (e.g., `ConnectionAccepted`, `PostReacted`, `CommentAdded`). Upon receiving an event, it creates a notification, persists it to the database, and delivers it to the user in real-time via a WebSocket connection.

## Table of Contents

- [Architectural Overview](#architectural-overview)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [Testing](#testing)
- [API and Events](#api-and-events)
  - [Event Consumption](#event-consumption)
  - [WebSocket API](#websocket-api)
  - [gRPC API](#grpc-api)

## Architectural Overview

The Notifications service is a core component of the user engagement loop. Its primary responsibilities are:

1.  **Event Consumption**: Listens to an SQS queue for business events published by other services (e.g., Connections, Engagement).
2.  **Business Logic**: Processes events, checks user preferences (via a gRPC call to the User Profile service), and applies batching/aggregation logic to avoid notification spam.
3.  **Persistence**: Stores notifications in a PostgreSQL database to provide a historical view for the user's Notification Center.
4.  **Real-time Delivery**: Pushes new notifications to clients in real-time using WebSockets (Socket.IO).

To support horizontal scaling, the service is stateless. WebSocket connection state (mapping `userId` to `socketId`) is managed externally in a Redis cache, using the `socket.io-redis-adapter`. This allows any instance of the service to push a notification to any connected user.

## Technology Stack

-   **Framework**: [NestJS](https://nestjs.com/) v10
-   **Language**: TypeScript v5
-   **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
-   **Real-time Communication**: WebSockets with [Socket.IO](https://socket.io/)
-   **Inter-service Communication**: gRPC
-   **Caching/State**: Redis
-   **Event Consumption**: AWS SQS (assumed from architecture)
-   **Containerization**: Docker

## Getting Started

### Prerequisites

-   Node.js (version specified in `.nvmrc`)
-   NPM or Yarn
-   Docker and Docker Compose
-   Access to a running PostgreSQL and Redis instance.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd platform-service-notifications
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Configuration

1.  Create a `.env` file from the example:
    ```bash
    cp .env.example .env
    ```
2.  Update the `.env` file with your local or development environment configuration:
    -   `DATABASE_URL`: Connection string for your PostgreSQL database.
    -   `REDIS_URL`: Connection string for your Redis instance.
    -   `PORT`: The port the service will run on (e.g., 3004).
    -   `JWT_SECRET`: A secret key for validating WebSocket connection tokens.
    -   `USER_PROFILE_SERVICE_GRPC_URL`: The gRPC address of the User Profile service.
    -   `AWS_*` variables for connecting to SQS.

### Running the Application

1.  **Generate Prisma Client**:
    This is required after `npm install` and any changes to `schema.prisma`.
    ```bash
    npm run prisma:generate
    ```
2.  **Run Database Migrations**:
    Apply any pending database migrations.
    ```bash
    npm run prisma:migrate:dev
    ```
3.  **Start the service in development mode**:
    This will start the service with hot-reloading.
    ```bash
    npm run start:dev
    ```

The service will be running on the port specified in your `.env` file.

## Testing

-   **Run unit and integration tests**:
    ```bash
    npm test
    ```
-   **Run end-to-end tests**:
    ```bash
    npm run test:e2e
    ```
-   **Run tests with coverage**:
    ```bash
    npm run test:cov
    ```

## API and Events

### Event Consumption

The service listens for events from an SQS queue. Key events include:

-   `ConnectionRequestSent`
-   `ConnectionAccepted`
-   `PostReacted`
-   `CommentAdded`

### WebSocket API

The service exposes a WebSocket endpoint for real-time communication with clients. Clients must connect with a valid JWT.

-   **Event**: `new_notification`
    -   **Direction**: Server -> Client
    -   **Payload**: The full notification object.
-   **Event**: `unread_count_update`
    -   **Direction**: Server -> Client
    -   **Payload**: `{ count: number }`

### gRPC API

The service exposes a gRPC API for other backend services (like the API Gateway) to fetch historical data.

-   **Service**: `NotificationsService`
-   **Method**: `getNotifications(request)`: Fetches a paginated list of notifications for a user.
-   **Method**: `markNotificationsAsRead(request)`: Marks all notifications for a user as read.