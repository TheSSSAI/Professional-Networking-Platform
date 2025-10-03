# 1 System Overview

## 1.1 Analysis Date

2025-06-13

## 1.2 Technology Stack

- Next.js
- NestJS
- TypeScript
- Docker
- Kubernetes (AWS EKS)
- Terraform
- GitHub Actions

## 1.3 Architecture

Microservices

## 1.4 Environments

- Staging
- Production

## 1.5 Key Requirements

- REQ-1-078: CI/CD via GitHub Actions
- REQ-1-076: Services must be containerized with Docker
- REQ-1-077: Deployment to Kubernetes (EKS)
- REQ-1-075: Infrastructure managed by Terraform
- REQ-2.7.4: Mandatory SAST, SCA, and container image scanning
- REQ-2.5.2: Unit & integration tests with >80% coverage
- REQ-2.10.1: End-to-end (E2E) tests

# 2.0 Pipelines

## 2.1 backend-service-pipeline

### 2.1.1 Id

backend-service-pipeline

### 2.1.2 Name

Backend Microservice CI/CD Pipeline

### 2.1.3 Description

Standardized pipeline for building, testing, securing, and deploying all NestJS backend microservices.

### 2.1.4 Trigger

#### 2.1.4.1 Type

🔹 Git Push

#### 2.1.4.2 Branch

main

#### 2.1.4.3 Paths

- services/**

### 2.1.5.0 Stages

#### 2.1.5.1 Checkout & Setup

##### 2.1.5.1.1 Name

Checkout & Setup

##### 2.1.5.1.2 Steps

- Checkout source code from the repository.
- Setup Node.js environment (version from .nvmrc).
- Install dependencies using 'npm ci' for reproducible builds.

#### 2.1.5.2.0 Code Quality & Static Analysis

##### 2.1.5.2.1 Name

Code Quality & Static Analysis

##### 2.1.5.2.2 Steps

- Run ESLint to enforce code style (REQ-2.5.1).
- Execute Static Application Security Testing (SAST) using a tool like SonarScanner. (REQ-2.7.4)

#### 2.1.5.3.0 Test & Coverage

##### 2.1.5.3.1 Name

Test & Coverage

##### 2.1.5.3.2 Steps

- Run unit and integration tests using Jest. (REQ-2.5.2)
- Generate code coverage report.
- Quality Gate: Fail build if code coverage is below 80%. (REQ-2.5.2)

#### 2.1.5.4.0 Security Scans

##### 2.1.5.4.1 Name

Security Scans

##### 2.1.5.4.2 Steps

- Perform Software Composition Analysis (SCA) for dependency vulnerabilities using 'npm audit --audit-level=high'. (REQ-2.7.4)
- Quality Gate: Fail build on critical vulnerabilities.

#### 2.1.5.5.0 Build & Package Artifact

##### 2.1.5.5.1 Name

Build & Package Artifact

##### 2.1.5.5.2 Steps

- Build TypeScript project into JavaScript artifacts.
- Build Docker image with a unique tag (e.g., git commit SHA). (REQ-1-076)
- Push Docker image to AWS Elastic Container Registry (ECR).

##### 2.1.5.5.3 Outputs

- Tagged Docker Image in ECR

#### 2.1.5.6.0 Scan Container Image

##### 2.1.5.6.1 Name

Scan Container Image

##### 2.1.5.6.2 Steps

- Scan the pushed Docker image for OS and library vulnerabilities using AWS ECR Scan or Trivy. (REQ-2.7.4)
- Quality Gate: Fail build on critical or high-severity vulnerabilities.

#### 2.1.5.7.0 Deploy to Staging

##### 2.1.5.7.1 Name

Deploy to Staging

##### 2.1.5.7.2 Steps

- Update Kubernetes manifest (or Helm chart values) with the new Docker image tag.
- Apply the configuration to the Staging EKS cluster using 'kubectl apply' or 'helm upgrade'. (REQ-1-077, REQ-2.10.2)
- Wait for the deployment rollout to complete successfully.

#### 2.1.5.8.0 Validate Staging Deployment

##### 2.1.5.8.1 Name

Validate Staging Deployment

##### 2.1.5.8.2 Steps

- Run automated End-to-End (E2E) tests against the Staging environment. (REQ-2.10.1)

#### 2.1.5.9.0 Manual Approval for Production

##### 2.1.5.9.1 Name

Manual Approval for Production

##### 2.1.5.9.2 Steps

- Pause the pipeline and require manual approval from a designated approver (e.g., Team Lead, SRE).
- Quality Gate: Proceed only upon explicit approval in the GitHub Actions UI.

#### 2.1.5.10.0 Deploy to Production

##### 2.1.5.10.1 Name

Deploy to Production

##### 2.1.5.10.2 Steps

- Update Kubernetes manifest (or Helm chart values) with the approved Docker image tag.
- Apply the configuration to the Production EKS cluster using a rolling update strategy.

### 2.1.6.0.0 Artifact Management

| Property | Value |
|----------|-------|
| Repository | AWS ECR |
| Versioning Strategy | Git Commit SHA |
| Retention Policy | Retain last 20 images per service, delete untagged... |

### 2.1.7.0.0 Rollback Strategy

| Property | Value |
|----------|-------|
| Method | Re-deploy Previous Artifact |
| Trigger | Manual trigger via GitHub Actions UI or on critica... |
| Procedure | The pipeline can be re-run with a specific, previo... |

## 2.2.0.0.0 frontend-app-pipeline

### 2.2.1.0.0 Id

frontend-app-pipeline

### 2.2.2.0.0 Name

Frontend WebApp CI/CD Pipeline

### 2.2.3.0.0 Description

Pipeline for building, testing, securing, and deploying the Next.js Single Page Application.

### 2.2.4.0.0 Trigger

#### 2.2.4.1.0 Type

🔹 Git Push

#### 2.2.4.2.0 Branch

main

#### 2.2.4.3.0 Paths

- apps/web-app/**

### 2.2.5.0.0 Stages

#### 2.2.5.1.0 Checkout & Setup

##### 2.2.5.1.1 Name

Checkout & Setup

##### 2.2.5.1.2 Steps

- Checkout source code from the repository.
- Setup Node.js environment.
- Install dependencies using 'npm ci'.

#### 2.2.5.2.0 Code Quality & Static Analysis

##### 2.2.5.2.1 Name

Code Quality & Static Analysis

##### 2.2.5.2.2 Steps

- Run ESLint and Prettier checks.
- Execute Static Application Security Testing (SAST). (REQ-2.7.4)

#### 2.2.5.3.0 Test & Coverage

##### 2.2.5.3.1 Name

Test & Coverage

##### 2.2.5.3.2 Steps

- Run unit and component tests using Jest. (REQ-2.5.2)
- Generate code coverage report.
- Quality Gate: Fail build if coverage is below 80%.

#### 2.2.5.4.0 Security Scans

##### 2.2.5.4.1 Name

Security Scans

##### 2.2.5.4.2 Steps

- Perform Software Composition Analysis (SCA) for dependency vulnerabilities. (REQ-2.7.4)
- Quality Gate: Fail build on critical vulnerabilities.

#### 2.2.5.5.0 Build & Package Artifact

##### 2.2.5.5.1 Name

Build & Package Artifact

##### 2.2.5.5.2 Steps

- Build the Next.js application for production using 'npm run build'.
- Build Docker image containing the standalone Next.js server. (REQ-1-076)
- Push Docker image to AWS ECR.

##### 2.2.5.5.3 Outputs

- Tagged Docker Image in ECR

#### 2.2.5.6.0 Scan Container Image

##### 2.2.5.6.1 Name

Scan Container Image

##### 2.2.5.6.2 Steps

- Scan the pushed Docker image for vulnerabilities. (REQ-2.7.4)
- Quality Gate: Fail build on critical or high-severity vulnerabilities.

#### 2.2.5.7.0 Deploy to Staging

##### 2.2.5.7.1 Name

Deploy to Staging

##### 2.2.5.7.2 Steps

- Update Kubernetes deployment with the new Docker image tag for the Staging environment. (REQ-2.10.2)

#### 2.2.5.8.0 Validate Staging Deployment

##### 2.2.5.8.1 Name

Validate Staging Deployment

##### 2.2.5.8.2 Steps

- Run automated End-to-End (E2E) tests using Cypress or Playwright against the Staging UI. (REQ-2.10.1)

#### 2.2.5.9.0 Manual Approval for Production

##### 2.2.5.9.1 Name

Manual Approval for Production

##### 2.2.5.9.2 Steps

- Pause pipeline and require manual approval.

#### 2.2.5.10.0 Deploy to Production

##### 2.2.5.10.1 Name

Deploy to Production

##### 2.2.5.10.2 Steps

- Update Kubernetes deployment with the new Docker image tag for the Production environment.
- Invalidate CDN cache (Cloudflare) for relevant assets. (REQ-3.3.2)

### 2.2.6.0.0 Artifact Management

| Property | Value |
|----------|-------|
| Repository | AWS ECR |
| Versioning Strategy | Git Commit SHA |
| Retention Policy | Retain last 20 images. |

### 2.2.7.0.0 Rollback Strategy

| Property | Value |
|----------|-------|
| Method | Re-deploy Previous Artifact |
| Trigger | Manual trigger via GitHub Actions UI. |
| Procedure | Re-run the pipeline with a previous stable commit ... |

## 2.3.0.0.0 infrastructure-iac-pipeline

### 2.3.1.0.0 Id

infrastructure-iac-pipeline

### 2.3.2.0.0 Name

Infrastructure (Terraform) CI/CD Pipeline

### 2.3.3.0.0 Description

Manages the provisioning and updating of all AWS cloud infrastructure using Terraform.

### 2.3.4.0.0 Trigger

#### 2.3.4.1.0 Type

🔹 Git Push

#### 2.3.4.2.0 Branch

main

#### 2.3.4.3.0 Paths

- infrastructure/**

### 2.3.5.0.0 Stages

#### 2.3.5.1.0 Checkout & Setup

##### 2.3.5.1.1 Name

Checkout & Setup

##### 2.3.5.1.2 Steps

- Checkout infrastructure code from the repository.
- Setup Terraform CLI environment.
- Configure AWS credentials for Terraform.

#### 2.3.5.2.0 Static Analysis & Validation

##### 2.3.5.2.1 Name

Static Analysis & Validation

##### 2.3.5.2.2 Steps

- Initialize Terraform backend using 'terraform init'.
- Validate Terraform configuration syntax using 'terraform validate'.
- Perform static analysis on Terraform code for security best practices using a tool like 'tfsec' or 'checkov'.

#### 2.3.5.3.0 Generate Plan

##### 2.3.5.3.1 Name

Generate Plan

##### 2.3.5.3.2 Steps

- Generate a Terraform execution plan using 'terraform plan' for the target environment (Staging/Production).
- Save the plan to an artifact for review and application.

##### 2.3.5.3.3 Outputs

- Terraform Plan File

#### 2.3.5.4.0 Manual Approval of Plan

##### 2.3.5.4.1 Name

Manual Approval of Plan

##### 2.3.5.4.2 Steps

- Post the Terraform plan as a comment on the commit/PR for review.
- Pause the pipeline and require manual approval from a designated infrastructure owner.
- Quality Gate: This is a critical safety step to prevent unintended infrastructure changes.

#### 2.3.5.5.0 Apply Infrastructure Changes

##### 2.3.5.5.1 Name

Apply Infrastructure Changes

##### 2.3.5.5.2 Steps

- Apply the approved Terraform plan using 'terraform apply <plan_file>'. (REQ-1-075)

### 2.3.6.0.0 Artifact Management

| Property | Value |
|----------|-------|
| Repository | GitHub Actions Artifacts / S3 |
| Versioning Strategy | Timestamp and Commit SHA for plan files |
| Retention Policy | Plan files retained for 7 days. |

### 2.3.7.0.0 Rollback Strategy

| Property | Value |
|----------|-------|
| Method | Git Revert & Re-apply |
| Trigger | Manual |
| Procedure | In case of a faulty infrastructure change, revert ... |

