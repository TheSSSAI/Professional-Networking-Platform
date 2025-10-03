# Deployment Strategy for API Gateway

This document outlines the deployment process for the `platform-api-gateway` service. The entire infrastructure is managed as code using the **Serverless Framework**, which abstracts AWS CloudFormation.

## 1. Overview

The gateway is a serverless application consisting of:
-   An **AWS API Gateway** (HTTP API)
-   An **AWS Lambda Function** running the Apollo Federation Gateway
-   A **Lambda Custom Authorizer** for JWT validation (defined in the Identity Service)
-   **API Gateway Usage Plans** for rate limiting

Deployment is automated via a CI/CD pipeline defined in GitHub Actions.

## 2. Prerequisites

-   Node.js v20.x or later
-   NPM
-   AWS CLI configured with appropriate credentials
-   Serverless Framework CLI: `npm install -g serverless`

## 3. Local Development

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment**:
    -   Copy `.env.example` to a new file named `.env`.
    -   Populate `.env` with the necessary local or development environment variables. This typically involves pointing to development instances of downstream services.

3.  **Run Offline**:
    -   The `serverless-offline` plugin is used to simulate the API Gateway and Lambda environment locally.
    ```bash
    serverless offline start
    ```
    -   The gateway will be available at `http://localhost:3000`.

## 4. CI/CD Pipeline

The deployment pipeline is defined in `.github/workflows/deploy.yml` and is triggered by pushes to specific branches.

### 4.1. Branching Strategy

-   `develop`: Pushes to this branch trigger a deployment to the **`dev`** environment.
-   `main`: Pushes to this branch (typically via a Pull Request merge) trigger a deployment to the **`prod`** environment.

### 4.2. Pipeline Stages

The pipeline consists of the following key stages for each deployment:

1.  **Setup Environment**:
    -   Checks out the code.
    -   Sets up Node.js.
    -   Configures AWS credentials using GitHub Secrets.

2.  **Install & Build**:
    -   Installs NPM dependencies: `npm ci`
    -   Lints the code: `npm run lint`
    -   Runs unit tests: `npm test`
    -   Builds the TypeScript project into JavaScript using Webpack: `npm run build`

3.  **Deploy to AWS**:
    -   The Serverless Framework CLI is used to deploy the infrastructure.
    -   The command specifies the stage (`dev` or `prod`), which determines which configuration file from `/config` is used.

    **Example Deployment Command (for `dev` stage):**
    ```bash
    serverless deploy --stage dev
    ```

## 5. Environment Configuration

-   The `serverless.yml` file is templated to use variables.
-   These variables are sourced from `config/env.<stage>.json` (e.g., `config/env.dev.json` or `config/env.prod.json`).
-   This pattern ensures that service URLs, ARNs, rate limits, and other stage-specific settings are externalized from the core IaC definition.

**Sensitive values** (e.g., production database passwords for downstream services, if ever needed here) should not be stored in these JSON files. They should be injected into the environment at deploy time from a secure store like AWS Secrets Manager, referenced within `serverless.yml` using `${ssm:...}` syntax.

## 6. Rollback Strategy

The Serverless Framework maintains a versioned history of deployments. In case of a critical failure:
-   A rollback can be performed via the Serverless Framework CLI:
    ```bash
    serverless rollback --timestamp <timestamp_of_previous_deployment>
    ```
-   This will revert the AWS CloudFormation stack to the specified previous version, effectively rolling back the API Gateway and Lambda configuration. This procedure should be part of the standard operating procedure for the on-call team.