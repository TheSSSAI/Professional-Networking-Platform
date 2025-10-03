# 1 Id

REPO-APP-WEB

# 2 Name

platform-web-app

# 3 Description

This repository contains the primary user-facing Single Page Application (SPA) for the Professional Networking Platform. It is responsible for all aspects of the end-user experience, including rendering the news feed, user profiles, connection management views, and the messaging interface. Extracted from the original 'platform-web' repository to separate it from the administrative UI, this component focuses exclusively on the public-facing features. It communicates with the backend via a single GraphQL endpoint exposed by the API Gateway and establishes WebSocket connections for real-time updates. Its architecture is based on Next.js and React, ensuring a high-performance, server-rendered application that meets the stringent performance requirements for LCP and TTFB (REQ-1-050). The separation allows its development lifecycle, feature prioritization, and release cadence to be completely independent of internal tooling.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.WebApp

# 6 Output Path

apps/platform-web-app

# 7 Framework

Next.js

# 8 Language

TypeScript

# 9 Technology

Next.js, React, TypeScript, MUI, Apollo Client, Socket.IO Client

# 10 Thirdparty Libraries

- react
- next
- @apollo/client
- @mui/material
- socket.io-client

# 11 Layer Ids

- presentation-layer

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-UI

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-060

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-061

## 13.3.0 Requirement Id

### 13.3.1 Requirement Id

REQ-1-062

## 13.4.0 Requirement Id

### 13.4.1 Requirement Id

REQ-1-066

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Single Page Application (SPA) with SSR

# 17.0.0 Architecture Map

- web-client-spa-001

# 18.0.0 Components Map

- web-spa-001

# 19.0.0 Requirements Map

- REQ-1-060

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-01-WEB

## 20.3.0 Decomposition Reasoning

The original 'platform-web' repository implicitly contained two applications: the main user platform and the admin dashboard. This component was extracted to isolate the user-facing application, allowing its development and release cycle to be optimized for public feature delivery without being coupled to the development of internal admin tools.

## 20.4.0 Extracted Responsibilities

- User-facing UI and experience
- Client-side state management for public features
- Communication with the public API Gateway

## 20.5.0 Reusability Scope

- This is a top-level application and is not intended for reuse.

## 20.6.0 Development Benefits

- Enables a dedicated frontend team to focus solely on the user experience.
- Decouples public feature releases from internal tool updates.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Gw-Api

### 21.1.1 Required Interfaces

- {'interface': 'GraphQL API', 'methods': ['query GetUserProfile { ... }', 'mutation CreatePost { ... }'], 'events': [], 'properties': []}

### 21.1.2 Integration Pattern

Client-Server Request-Response via GraphQL.

### 21.1.3 Communication Protocol

HTTPS

## 21.2.0 Repo-Svc-Msg

### 21.2.1 Required Interfaces

- {'interface': 'WebSocket Events', 'methods': [], 'events': ["on('newMessage', MessageData)", "on('typingIndicator', TypingData)"], 'properties': []}

### 21.2.2 Integration Pattern

Real-time, bidirectional communication.

### 21.2.3 Communication Protocol

WSS (WebSocket Secure)

# 22.0.0 Exposed Contracts

*No data available*

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | N/A (Frontend Application) |
| Event Communication | Subscribes to real-time events from Messaging and ... |
| Data Flow | Fetches and mutates data via GraphQL API; receives... |
| Error Handling | Client-side error boundaries, global error handler... |
| Async Patterns | React Query / Apollo Client for managing asynchron... |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Leverage Next.js features like Server Components a... |
| Performance Considerations | Strictly adhere to Core Web Vitals targets (LCP < ... |
| Security Considerations | Implement secure handling of JWTs (e.g., in httpOn... |
| Testing Approach | Component tests with Jest/React Testing Library, E... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- All features defined in the SRS sections 1.2 through 1.7.

## 25.2.0 Must Not Implement

- Administrative functions (content moderation, user management).
- Direct database access or any backend business logic.

## 25.3.0 Extension Points

- Theming system for brand customization.
- Plugin architecture for new content types in the feed.

## 25.4.0 Validation Rules

- Client-side input validation for immediate user feedback on all forms.

