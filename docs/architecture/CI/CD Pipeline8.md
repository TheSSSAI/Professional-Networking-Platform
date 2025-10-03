# 1 Pipelines

## 1.1 pipeline-backend-svc-001

### 1.1.1 Id

pipeline-backend-svc-001

### 1.1.2 Name

Backend Microservice CI/CD Pipeline

### 1.1.3 Description

A reusable pipeline for building, testing, scanning, and deploying NestJS microservices as containerized applications to AWS EKS. This pipeline enforces quality and security gates before promoting to production. Rollback is achieved by re-running the deployment stage with a previous successful artifact version.

### 1.1.4 Stages

#### 1.1.4.1 CI & Static Analysis

##### 1.1.4.1.1 Name

CI & Static Analysis

##### 1.1.4.1.2 Steps

- npm ci
- npm run lint
- npm test -- --coverage
- sonar-scanner-run
- npm audit --audit-level=critical

##### 1.1.4.1.3 Environment

###### 1.1.4.1.3.1 Node Env

test

##### 1.1.4.1.4.0 Quality Gates

###### 1.1.4.1.4.1 Test Coverage Check

####### 1.1.4.1.4.1.1 Name

Test Coverage Check

####### 1.1.4.1.4.1.2 Criteria

- Test coverage meets or exceeds 80%

####### 1.1.4.1.4.1.3 Blocking

✅ Yes

###### 1.1.4.1.4.2.0 SCA Vulnerability Check

####### 1.1.4.1.4.2.1 Name

SCA Vulnerability Check

####### 1.1.4.1.4.2.2 Criteria

- Zero critical vulnerabilities in dependencies

####### 1.1.4.1.4.2.3 Blocking

✅ Yes

#### 1.1.4.2.0.0.0 Build & Push Container Image

##### 1.1.4.2.1.0.0 Name

Build & Push Container Image

##### 1.1.4.2.2.0.0 Steps

- docker build -t $ECR_REPO/$SERVICE_NAME:$GIT_SHA .
- trivy image --severity CRITICAL --exit-code 1 $ECR_REPO/$SERVICE_NAME:$GIT_SHA
- aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO
- docker push $ECR_REPO/$SERVICE_NAME:$GIT_SHA

##### 1.1.4.2.3.0.0 Environment

###### 1.1.4.2.3.1.0 Ecr Repo

123456789012.dkr.ecr.us-east-1.amazonaws.com

###### 1.1.4.2.3.2.0 Aws Region

us-east-1

##### 1.1.4.2.4.0.0 Quality Gates

- {'name': 'Container Image Scan', 'criteria': ['Zero CRITICAL vulnerabilities found in the container image'], 'blocking': True}

#### 1.1.4.3.0.0.0 Deploy to Staging

##### 1.1.4.3.1.0.0 Name

Deploy to Staging

##### 1.1.4.3.2.0.0 Steps

- sed -i 's/IMAGE_TAG/$GIT_SHA/' k8s/deployment.yaml
- kubectl apply -f k8s/ -n staging
- kubectl rollout status deployment/$SERVICE_NAME -n staging
- npm run smoke-test:staging

##### 1.1.4.3.3.0.0 Environment

###### 1.1.4.3.3.1.0 Kube Context

eks-staging-cluster

##### 1.1.4.3.4.0.0 Quality Gates

*No items available*

#### 1.1.4.4.0.0.0 E2E Testing

##### 1.1.4.4.1.0.0 Name

E2E Testing

##### 1.1.4.4.2.0.0 Steps

- npm run e2e-test:staging

##### 1.1.4.4.3.0.0 Environment

###### 1.1.4.4.3.1.0 Test Env

staging

##### 1.1.4.4.4.0.0 Quality Gates

- {'name': 'End-to-End Test Suite', 'criteria': ['All E2E tests pass successfully against the staging environment'], 'blocking': True}

#### 1.1.4.5.0.0.0 Production Approval Gate

##### 1.1.4.5.1.0.0 Name

Production Approval Gate

##### 1.1.4.5.2.0.0 Steps

- Manual approval required from Engineering Lead

##### 1.1.4.5.3.0.0 Environment

###### 1.1.4.5.3.1.0 Approvers

engineering-leads

##### 1.1.4.5.4.0.0 Quality Gates

*No items available*

#### 1.1.4.6.0.0.0 Deploy to Production

##### 1.1.4.6.1.0.0 Name

Deploy to Production

##### 1.1.4.6.2.0.0 Steps

- sed -i 's/IMAGE_TAG/$GIT_SHA/' k8s/deployment.yaml
- kubectl apply -f k8s/ -n production
- kubectl rollout status deployment/$SERVICE_NAME -n production
- npm run smoke-test:production

##### 1.1.4.6.3.0.0 Environment

###### 1.1.4.6.3.1.0 Kube Context

eks-production-cluster

##### 1.1.4.6.4.0.0 Quality Gates

*No items available*

## 1.2.0.0.0.0.0 pipeline-frontend-spa-002

### 1.2.1.0.0.0.0 Id

pipeline-frontend-spa-002

### 1.2.2.0.0.0.0 Name

Frontend Web App CI/CD Pipeline

### 1.2.3.0.0.0.0 Description

Builds, tests, and deploys the Next.js Single Page Application to AWS S3, served via Cloudflare CDN. The pipeline includes security scanning and requires manual approval for production releases.

### 1.2.4.0.0.0.0 Stages

#### 1.2.4.1.0.0.0 CI & Static Analysis

##### 1.2.4.1.1.0.0 Name

CI & Static Analysis

##### 1.2.4.1.2.0.0 Steps

- npm ci
- npm run lint
- npm test -- --coverage
- sonar-scanner-run
- npm audit --audit-level=critical

##### 1.2.4.1.3.0.0 Environment

###### 1.2.4.1.3.1.0 Node Env

test

##### 1.2.4.1.4.0.0 Quality Gates

- {'name': 'Test Coverage Check', 'criteria': ['Test coverage meets or exceeds 80%'], 'blocking': True}

#### 1.2.4.2.0.0.0 Build & Package Artifact

##### 1.2.4.2.1.0.0 Name

Build & Package Artifact

##### 1.2.4.2.2.0.0 Steps

- npm run build
- tar -czf build-$GIT_SHA.tar.gz .next
- aws s3 cp build-$GIT_SHA.tar.gz s3://$ARTIFACT_BUCKET/frontend/

##### 1.2.4.2.3.0.0 Environment

###### 1.2.4.2.3.1.0 Node Env

production

###### 1.2.4.2.3.2.0 Artifact Bucket

platform-build-artifacts

##### 1.2.4.2.4.0.0 Quality Gates

*No items available*

#### 1.2.4.3.0.0.0 Deploy to Staging

##### 1.2.4.3.1.0.0 Name

Deploy to Staging

##### 1.2.4.3.2.0.0 Steps

- aws s3 cp s3://$ARTIFACT_BUCKET/frontend/build-$GIT_SHA.tar.gz .
- tar -xzf build-$GIT_SHA.tar.gz
- aws s3 sync .next s3://$STAGING_BUCKET/
- cloudflare-cli cache purge --zone $CF_ZONE_ID_STAGING

##### 1.2.4.3.3.0.0 Environment

###### 1.2.4.3.3.1.0 Staging Bucket

platform-staging-web

##### 1.2.4.3.4.0.0 Quality Gates

*No items available*

#### 1.2.4.4.0.0.0 E2E Testing

##### 1.2.4.4.1.0.0 Name

E2E Testing

##### 1.2.4.4.2.0.0 Steps

- npm run e2e-test:staging

##### 1.2.4.4.3.0.0 Environment

###### 1.2.4.4.3.1.0 Test Env

staging

##### 1.2.4.4.4.0.0 Quality Gates

- {'name': 'End-to-End Test Suite', 'criteria': ['All E2E tests pass successfully against the staging environment'], 'blocking': True}

#### 1.2.4.5.0.0.0 Production Approval Gate

##### 1.2.4.5.1.0.0 Name

Production Approval Gate

##### 1.2.4.5.2.0.0 Steps

- Manual approval required from Product Owner

##### 1.2.4.5.3.0.0 Environment

###### 1.2.4.5.3.1.0 Approvers

product-owners

##### 1.2.4.5.4.0.0 Quality Gates

*No items available*

#### 1.2.4.6.0.0.0 Deploy to Production

##### 1.2.4.6.1.0.0 Name

Deploy to Production

##### 1.2.4.6.2.0.0 Steps

- aws s3 cp s3://$ARTIFACT_BUCKET/frontend/build-$GIT_SHA.tar.gz .
- tar -xzf build-$GIT_SHA.tar.gz
- aws s3 sync .next s3://$PRODUCTION_BUCKET/
- cloudflare-cli cache purge --zone $CF_ZONE_ID_PROD

##### 1.2.4.6.3.0.0 Environment

###### 1.2.4.6.3.1.0 Production Bucket

platform-production-web

##### 1.2.4.6.4.0.0 Quality Gates

*No items available*

## 1.3.0.0.0.0.0 pipeline-iac-terraform-003

### 1.3.1.0.0.0.0 Id

pipeline-iac-terraform-003

### 1.3.2.0.0.0.0 Name

Infrastructure (Terraform) CI/CD Pipeline

### 1.3.3.0.0.0.0 Description

Manages the deployment of AWS infrastructure using Terraform. A plan is generated for review on pull requests, and the apply step requires manual approval on the main branch.

### 1.3.4.0.0.0.0 Stages

#### 1.3.4.1.0.0.0 Validate & Plan (on Pull Request)

##### 1.3.4.1.1.0.0 Name

Validate & Plan (on Pull Request)

##### 1.3.4.1.2.0.0 Steps

- terraform init
- terraform validate
- terraform plan -out=tfplan
- post-plan-to-pr-comment

##### 1.3.4.1.3.0.0 Environment

###### 1.3.4.1.3.1.0 Tf Workspace

staging

##### 1.3.4.1.4.0.0 Quality Gates

- {'name': 'Terraform Plan Review', 'criteria': ['Plan must be reviewed and approved by a DevOps team member'], 'blocking': True}

#### 1.3.4.2.0.0.0 Apply Approval Gate (on Main Branch)

##### 1.3.4.2.1.0.0 Name

Apply Approval Gate (on Main Branch)

##### 1.3.4.2.2.0.0 Steps

- Manual approval required from DevOps Lead to apply changes

##### 1.3.4.2.3.0.0 Environment

###### 1.3.4.2.3.1.0 Approvers

devops-leads

##### 1.3.4.2.4.0.0 Quality Gates

*No items available*

#### 1.3.4.3.0.0.0 Apply Infrastructure Changes (on Main Branch)

##### 1.3.4.3.1.0.0 Name

Apply Infrastructure Changes (on Main Branch)

##### 1.3.4.3.2.0.0 Steps

- terraform init
- terraform apply -auto-approve tfplan

##### 1.3.4.3.3.0.0 Environment

###### 1.3.4.3.3.1.0 Tf Workspace

production

##### 1.3.4.3.4.0.0 Quality Gates

*No items available*

# 2.0.0.0.0.0.0 Configuration

| Property | Value |
|----------|-------|
| Artifact Repository | AWS ECR for container images, AWS S3 for frontend ... |
| Default Branch | main |
| Retention Policy | 30 days for build artifacts and images, except for... |
| Notification Channel | slack#engineering-deployments |

