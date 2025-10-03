# Platform Contracts

This repository is the foundational, versioned library that serves as the single source of truth for all data contracts and communication interfaces used across the entire platform. Its responsibility is to define the 'language' that all services and applications use to communicate, ensuring type safety and consistency.

## Overview

This is a non-runtime library; it only contains definitions for:

-   **gRPC Services (`.proto`)**: For high-performance, internal, service-to-service communication. Located in `src/grpc`.
-   **GraphQL Schema (`.graphql`)**: For the client-facing API exposed by the API Gateway. Located in `src/graphql`.
-   **Event Payloads (`.ts`)**: TypeScript interfaces for asynchronous event payloads communicated via the event bus. Located in `src/events`.
-   **Validation Schemas (`.ts`)**: Shared Zod schemas for validating data contracts on both client and server. Located in `src/validation`.

## Contract-First Development

This repository enforces a contract-first development approach. Any change to a public API, internal service communication, or event structure must be defined here first.

The CI/CD pipeline ensures that all contracts are well-formed, adhere to style guides, and are backward-compatible where required.

## Usage

All other repositories (microservices, frontend applications) consume this library as a versioned npm package from a private registry.

### Installation

```bash
npm install @platform/contracts
```

### Using Generated Types

After installation, you can import the generated types in your TypeScript projects.

**gRPC Types:**

```typescript
import { UserProfileServiceClient } from '@platform/contracts/grpc/v1/ts/users/user';
```

**GraphQL Types:**

```typescript
import { User, CreatePostInput } from '@platform/contracts/graphql/generated/graphql';
```

**Event Payloads:**

```typescript
import { UserRegisteredEventV1 } from '@platform/contracts/events/v1/user.events';
```

## Development

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20.x or later)
-   [npm](https://www.npmjs.com/) (v9.x or later)
-   [Buf CLI](https://buf.build/docs/installation)

### Installation

```bash
npm install
```

### Available Scripts

-   `npm run build`: Generates all TypeScript types from `.proto` and `.graphql` files and compiles the library to the `dist` folder.
-   `npm run lint`: Runs all linters (ESLint, Prettier, Buf, GraphQL Linter).
-   `npm run format`: Formats all code using Prettier.
-   `npm test`: Runs the test suite.

## Versioning and Releasing

This repository uses [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) to automate versioning and package publishing.

Commits to the `main` branch that follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification will automatically trigger a new release.

-   **`fix:`** commits trigger a `PATCH` release.
-   **`feat:`** commits trigger a `MINOR` release.
-   **`BREAKING CHANGE:`** in the commit body triggers a `MAJOR` release.

The release process is handled by the `.github/workflows/release.yml` GitHub Action. It will:
1.  Analyze commits since the last release.
2.  Determine the next version number.
3.  Update `package.json` and `CHANGELOG.md`.
4.  Create a new Git tag and GitHub Release.
5.  Publish the new version of the `@platform/contracts` package to the private registry.