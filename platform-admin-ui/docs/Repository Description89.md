# 1 Id

REPO-APP-ADMIN

# 2 Name

platform-admin-ui

# 3 Description

This repository provides the frontend for the Admin Dashboard, a secure, internal-facing application. Its single responsibility is to provide administrative and moderation staff with the tools to manage the platform effectively, as specified in SRS section 1.8. This includes viewing the content moderation queue, taking action on reported content, managing user accounts, and viewing audit logs. Extracted from the original 'platform-web' repository, this separation ensures that the development and security posture of this critical internal tool are managed independently of the public-facing application. It interacts with a dedicated, role-protected set of GraphQL endpoints exposed by the API Gateway and is built using the same frontend stack (Next.js, React, MUI) for consistency and to leverage shared UI components.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.AdminUI

# 6 Output Path

apps/platform-admin-ui

# 7 Framework

Next.js

# 8 Language

TypeScript

# 9 Technology

Next.js, React, TypeScript, MUI, Apollo Client

# 10 Thirdparty Libraries

- react
- next
- @apollo/client
- @mui/material

# 11 Layer Ids

- presentation-layer

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-UI

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-040

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-041

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Single Page Application (SPA)

# 17.0.0 Architecture Map

*No items available*

# 18.0.0 Components Map

*No items available*

# 19.0.0 Requirements Map

- REQ-1-040

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-01-WEB

## 20.3.0 Decomposition Reasoning

Separating the Admin UI from the main application provides significant benefits in security, development velocity, and stability. It allows for stricter access controls, a separate deployment pipeline, and prevents changes to internal tools from accidentally impacting the public user experience.

## 20.4.0 Extracted Responsibilities

- Content moderation interface
- User account management tools
- System configuration and audit log viewing

## 20.5.0 Reusability Scope

- This is a top-level application and is not intended for reuse.

## 20.6.0 Development Benefits

- Allows a dedicated team to focus on internal tooling without blocking public feature development.
- Enables a more stringent security review and deployment process for this sensitive application.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Gw-Api

### 21.1.1 Required Interfaces

- {'interface': 'Admin GraphQL API', 'methods': ['query GetModerationQueue { ... }', 'mutation BanUser { ... }'], 'events': [], 'properties': []}

### 21.1.2 Integration Pattern

Client-Server Request-Response via GraphQL.

### 21.1.3 Communication Protocol

HTTPS

# 22.0.0 Exposed Contracts

*No data available*

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | N/A (Frontend Application) |
| Event Communication | N/A |
| Data Flow | Fetches and mutates data via a dedicated, admin-sc... |
| Error Handling | Global error handlers for API calls, with detailed... |
| Async Patterns | Apollo Client for managing data fetching state. |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | The application should be secured behind a separat... |
| Performance Considerations | While not as critical as the public site, the UI s... |
| Security Considerations | Strict session management policies. All actions mu... |
| Testing Approach | Focus on integration tests that validate interacti... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- All features defined in SRS section 1.8 (Administrative Functions).

## 25.2.0 Must Not Implement

- Any public-facing user features like posting, messaging, or profile editing.

## 25.3.0 Extension Points

- Dashboard widget system for adding new metrics or system status views.

## 25.4.0 Validation Rules

- Client-side validation for all forms (e.g., reason for banning a user).

