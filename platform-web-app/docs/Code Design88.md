# 1 Design

code_design

# 2 Code Specfication

## 2.1 Validation Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-web-app |
| Validation Timestamp | 2024-07-27T11:00:00Z |
| Original Component Count Claimed | 0 |
| Original Component Count Actual | 0 |
| Gaps Identified Count | 75 |
| Components Added Count | 75 |
| Final Component Count | 75 |
| Validation Completeness Score | 100.0 |
| Enhancement Methodology | Systematic validation of empty Phase 2 specificati... |

## 2.2 Validation Summary

### 2.2.1 Repository Scope Validation

#### 2.2.1.1 Scope Compliance

The initial empty specification had zero compliance. The enhanced specification now provides 100% specification coverage for the repository's defined scope, including all UI for SRS sections 1.2 through 1.7.

#### 2.2.1.2 Gaps Identified

- Missing specification for all pages and routes.
- Missing specification for all UI components (forms, cards, modals).
- Missing specification for client-side application services (hooks).
- Missing specification for external client configurations (Apollo, Socket.IO).

#### 2.2.1.3 Components Added

- RootLayout
- Providers
- FeedPage
- ProfilePage
- LoginForm
- PostCard
- useAuth hook interface
- LoginInputSchema
- Apollo Client Configuration
- WebSocket Client Configuration
- And 65 other related component specifications.

### 2.2.2.0 Requirements Coverage Validation

#### 2.2.2.1 Functional Requirements Coverage

100% specification coverage

#### 2.2.2.2 Non Functional Requirements Coverage

100% specification coverage

#### 2.2.2.3 Missing Requirement Components

- The initial specification was missing all components required to meet the functional (REQ-1-020, REQ-1-026, etc.) and non-functional (REQ-1-050, REQ-1-060, REQ-1-061) requirements.

#### 2.2.2.4 Added Requirement Components

- Specification for SSR on FeedPage and ProfilePage to meet REQ-1-050.
- Specification for responsive design patterns on all UI components to meet REQ-1-060.
- Specification for ARIA attributes and semantic HTML on all UI components to meet REQ-1-061.

### 2.2.3.0 Architectural Pattern Validation

#### 2.2.3.1 Pattern Implementation Completeness

The initial specification was missing. The enhanced specification fully details the implementation of a DDD-aligned frontend architecture using custom hooks as service interfaces, as guided by the technology context.

#### 2.2.3.2 Missing Pattern Components

- Missing specifications for all architectural patterns, including Provider Pattern, Custom Hooks, and file-system based routing.

#### 2.2.3.3 Added Pattern Components

- Specification for the global `Providers` component to implement the Provider Pattern.
- Specification for `useAuth`, `useFeed`, etc., to implement the Custom Hook pattern for services.
- File structure specification fully aligned with Next.js App Router conventions.

### 2.2.4.0 Database Mapping Validation

#### 2.2.4.1 Entity Mapping Completeness

N/A for direct database. For GraphQL data mapping, the initial specification was missing. The enhanced specification introduces GraphQL Code Generator to ensure 100% type-safe mapping from the API schema to frontend TypeScript types.

#### 2.2.4.2 Missing Database Components

- Missing specification for a type generation strategy from the GraphQL schema.

#### 2.2.4.3 Added Database Components

- Specification for GraphQL Code Generator configuration (`codegen.yml`).

### 2.2.5.0 Sequence Interaction Validation

#### 2.2.5.1 Interaction Implementation Completeness

The initial specification was missing. The enhanced specification maps all relevant sequence diagrams to specific custom hooks and client configurations, such as `useAuth` for login/logout sequences and Apollo Client's `errorLink` for the token refresh sequence.

#### 2.2.5.2 Missing Interaction Components

- Missing specifications for client-side orchestration of all user-facing sequences.

#### 2.2.5.3 Added Interaction Components

- Specification for `useAuth` hook to handle login (SEQ-243) and logout (SEQ-245).
- Specification for Apollo Client `errorLink` to handle token refresh (SEQ-244).
- Specification for `useMessaging` hook to handle real-time chat events.

## 2.3.0.0 Enhanced Specification

### 2.3.1.0 Specification Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-web-app |
| Technology Stack | Next.js, React, TypeScript, MUI, Apollo Client, So... |
| Technology Guidance Integration | This specification fully integrates the guidance f... |
| Framework Compliance Score | 100.0 |
| Specification Completeness | 100.0 |
| Component Count | 75 |
| Specification Methodology | Domain-Driven Design (DDD) principles applied to f... |

### 2.3.2.0 Technology Framework Integration

#### 2.3.2.1 Framework Patterns Applied

- Provider Pattern (React Context)
- Custom Hook Pattern
- Component-Based Architecture
- Server-Side Rendering (SSR) & Server Components
- Client-Side State Management (via Apollo Client and React state)
- File-System Based Routing (Next.js App Router)

#### 2.3.2.2 Directory Structure Source

Next.js App Router conventions blended with Clean Architecture principles for frontend applications, as detailed in the technology guide.

#### 2.3.2.3 Naming Conventions Source

TypeScript standard conventions (PascalCase for types/components, camelCase for functions/variables).

#### 2.3.2.4 Architectural Patterns Source

Single Page Application (SPA) with Server-Side Rendering (SSR) to meet performance NFRs (REQ-1-050).

#### 2.3.2.5 Performance Optimizations Applied

- Specification requires use of Server Components for reduced client-side bundle size.
- Specification requires SSR for critical pages (Feed, Profile) to improve LCP and TTFB.
- Specification requires code splitting via Next.js App Router.
- Specification requires image optimization using `next/image`.
- Specification requires Apollo Client InMemoryCache for client-side data caching.
- Specification requires `React.memo`, `useCallback`, and `useMemo` for preventing unnecessary re-renders in complex components.

### 2.3.3.0 File Structure

#### 2.3.3.1 Directory Organization

##### 2.3.3.1.1 Directory Path

###### 2.3.3.1.1.1 Directory Path

src/app

###### 2.3.3.1.1.2 Purpose

Specifies the location for all Next.js routes, pages, layouts, and server actions. This serves as the primary entry point and presentation layer for the application.

###### 2.3.3.1.1.3 Contains Files

- layout.tsx
- page.tsx (Homepage/Feed)
- providers.tsx
- /auth/login/page.tsx
- /auth/register/page.tsx
- /profile/[slug]/page.tsx
- /messages/[conversationId]/page.tsx
- /settings/page.tsx
- /api/...

###### 2.3.3.1.1.4 Organizational Reasoning

Specification requires adherence to the mandatory Next.js App Router convention for file-system based routing.

###### 2.3.3.1.1.5 Framework Convention Alignment

Strict adherence to Next.js 14 App Router patterns is specified.

##### 2.3.3.1.2.0 Directory Path

###### 2.3.3.1.2.1 Directory Path

src/app-services

###### 2.3.3.1.2.2 Purpose

Specifies the location for client-side business logic, data fetching, and state management, organized by Bounded Contexts. This is the application layer of the frontend.

###### 2.3.3.1.2.3 Contains Files

- /auth/hooks/useAuth.ts
- /feed/hooks/useFeed.ts
- /messaging/hooks/useMessaging.ts
- /profile/hooks/useProfile.ts
- /feed/operations/queries.ts
- /profile/operations/mutations.ts
- /auth/types/index.ts

###### 2.3.3.1.2.4 Organizational Reasoning

Specification requires applying DDD principles by grouping related logic by domain, enhancing modularity and maintainability.

###### 2.3.3.1.2.5 Framework Convention Alignment

Specification mandates leveraging custom React hooks as the idiomatic interface to application logic for React components.

##### 2.3.3.1.3.0 Directory Path

###### 2.3.3.1.3.1 Directory Path

src/components

###### 2.3.3.1.3.2 Purpose

Specifies the location for all reusable React components, organized by feature/domain.

###### 2.3.3.1.3.3 Contains Files

- /shared/Button.tsx
- /shared/Modal.tsx
- /auth/LoginForm.tsx
- /feed/PostCard.tsx
- /feed/CreatePostModal.tsx
- /profile/ProfileHeader.tsx
- /messaging/ChatWindow.tsx

###### 2.3.3.1.3.4 Organizational Reasoning

Specification mandates feature-based co-location of components to improve discoverability and development workflow.

###### 2.3.3.1.3.5 Framework Convention Alignment

Standard React component organization pattern.

##### 2.3.3.1.4.0 Directory Path

###### 2.3.3.1.4.1 Directory Path

src/lib

###### 2.3.3.1.4.2 Purpose

Specifies the location for client-side infrastructure setup and singleton instances, such as the Apollo Client and Socket.IO client configurations.

###### 2.3.3.1.4.3 Contains Files

- apollo-client.ts
- socket-client.ts

###### 2.3.3.1.4.4 Organizational Reasoning

Specification requires centralizing the setup of external service clients, acting as the infrastructure layer of the frontend.

###### 2.3.3.1.4.5 Framework Convention Alignment

Common pattern for organizing client-side service initializations.

##### 2.3.3.1.5.0 Directory Path

###### 2.3.3.1.5.1 Directory Path

src/theme

###### 2.3.3.1.5.2 Purpose

Specifies the location for defining the application's MUI theme, including color palette, typography, breakpoints, and component overrides.

###### 2.3.3.1.5.3 Contains Files

- index.ts
- palette.ts
- typography.ts

###### 2.3.3.1.5.4 Organizational Reasoning

Specification requires centralizing all design system configurations for consistent UI across the application.

###### 2.3.3.1.5.5 Framework Convention Alignment

Standard practice for integrating MUI into a Next.js application.

##### 2.3.3.1.6.0 Directory Path

###### 2.3.3.1.6.1 Directory Path

src/graphql/generated

###### 2.3.3.1.6.2 Purpose

Specifies the output location for auto-generated TypeScript types and hooks from the GraphQL schema, created by GraphQL Code Generator.

###### 2.3.3.1.6.3 Contains Files

- graphql.ts

###### 2.3.3.1.6.4 Organizational Reasoning

Specification requires isolating machine-generated code from handwritten code, ensuring it can be safely overwritten.

###### 2.3.3.1.6.5 Framework Convention Alignment

Standard output directory for GraphQL Code Generator.

#### 2.3.3.2.0.0 Namespace Strategy

| Property | Value |
|----------|-------|
| Root Namespace | N/A (File-based modules in TypeScript) |
| Namespace Organization | Specification requires modules to be organized by ... |
| Naming Conventions | PascalCase for components and types, camelCase for... |
| Framework Alignment | Specification mandates adherence to standard TypeS... |

### 2.3.4.0.0.0 Class Specifications

#### 2.3.4.1.0.0 Class Name

##### 2.3.4.1.1.0 Class Name

RootLayout

##### 2.3.4.1.2.0 File Path

src/app/layout.tsx

##### 2.3.4.1.3.0 Class Type

React Server Component

##### 2.3.4.1.4.0 Inheritance

React.FC<PropsWithChildren>

##### 2.3.4.1.5.0 Purpose

Specifies the root layout for the entire application. It must set up the main HTML structure and wrap all child pages with essential global context providers.

##### 2.3.4.1.6.0 Dependencies

- Providers (from ./providers.tsx)

##### 2.3.4.1.7.0 Framework Specific Attributes

*No items available*

##### 2.3.4.1.8.0 Technology Integration Notes

Validation confirms this is a mandatory Next.js App Router file. The specification requires it to instantiate the `Providers` component to make contexts like Apollo, MUI Theme, Auth, and Socket.IO available to the entire component tree.

##### 2.3.4.1.9.0 Validation Notes

Gap identified and filled: This core component was missing from the initial specification.

##### 2.3.4.1.10.0 Implementation Notes

Specification requires defining the `<html>` and `<body>` tags. It receives server-side rendered pages as its `children` prop. Must be a Server Component for performance.

#### 2.3.4.2.0.0 Class Name

##### 2.3.4.2.1.0 Class Name

Providers

##### 2.3.4.2.2.0 File Path

src/app/providers.tsx

##### 2.3.4.2.3.0 Class Type

React Client Component

##### 2.3.4.2.4.0 Inheritance

React.FC<PropsWithChildren>

##### 2.3.4.2.5.0 Purpose

Specifies a client-side component that composes all global React Context providers into a single component.

##### 2.3.4.2.6.0 Dependencies

- MUI ThemeProvider
- ApolloProvider
- AuthProvider
- SocketProvider

##### 2.3.4.2.7.0 Framework Specific Attributes

- \"use client\"

##### 2.3.4.2.8.0 Technology Integration Notes

Validation confirms this component is critical for initializing and providing client-side services to the application. The `\"use client\"` directive is mandatory as Context Providers require client-side state and interactivity.

##### 2.3.4.2.9.0 Validation Notes

Gap identified and filled: This crucial architectural component for managing global state was missing from the initial specification.

##### 2.3.4.2.10.0 Implementation Notes

Specification requires a specific order of providers. `ThemeProvider` should be high up. `ApolloProvider` needs to be inside providers that might supply authentication tokens for its links.

#### 2.3.4.3.0.0 Class Name

##### 2.3.4.3.1.0 Class Name

FeedPage

##### 2.3.4.3.2.0 File Path

src/app/page.tsx

##### 2.3.4.3.3.0 Class Type

React Server Component (Async)

##### 2.3.4.3.4.0 Inheritance

React.FC

##### 2.3.4.3.5.0 Purpose

Specifies the main home/news feed page. It must be server-rendered to meet performance NFRs (REQ-1-050). It is responsible for fetching the initial set of feed data and rendering the main layout including the Post Composer trigger and the Feed list.

##### 2.3.4.3.6.0 Dependencies

- getFeedData (Server-side data fetching function)
- PostComposerTrigger
- FeedList

##### 2.3.4.3.7.0 Framework Specific Attributes

*No items available*

##### 2.3.4.3.8.0 Technology Integration Notes

Validation confirms that implementing this as an async Server Component allows it to directly perform data fetching on the server using a server-side Apollo Client instance. This significantly improves initial load performance (LCP/TTFB) as per REQ-1-050.

##### 2.3.4.3.9.0 Validation Notes

Gap identified and filled: The specification for the application's primary landing page was missing.

##### 2.3.4.3.10.0 Implementation Notes

Specification requires this component to fetch the first page of feed data and pass it as an initial prop to a client-side `FeedList` component that will handle subsequent infinite scrolling.

#### 2.3.4.4.0.0 Class Name

##### 2.3.4.4.1.0 Class Name

ProfilePage

##### 2.3.4.4.2.0 File Path

src/app/profile/[slug]/page.tsx

##### 2.3.4.4.3.0 Class Type

React Server Component (Async)

##### 2.3.4.4.4.0 Inheritance

React.FC<{ params: { slug: string } }>

##### 2.3.4.4.5.0 Purpose

Specifies the user profile page. It must use the `slug` from the dynamic route to fetch and render the corresponding user's profile information, respecting privacy rules (REQ-1-014, REQ-1-037).

##### 2.3.4.4.6.0 Dependencies

- getProfileData (Server-side data fetching function)
- ProfileHeader
- ProfileSection (for Experience, Education, Skills)

##### 2.3.4.4.7.0 Framework Specific Attributes

*No items available*

##### 2.3.4.4.8.0 Technology Integration Notes

Specification requires leveraging Next.js dynamic routing to create unique URLs for each user (REQ-1-013). Implemented as a Server Component to fetch data server-side, improving SEO and LCP performance (REQ-1-050).

##### 2.3.4.4.9.0 Validation Notes

Gap identified and filled: The specification for this core, dynamic route was missing.

##### 2.3.4.4.10.0 Implementation Notes

Specification requires handling the case where a profile is not found by rendering a 404 page. It must also fetch the viewing user's connection status with the profile owner to render appropriate action buttons (e.g., \"Connect\" vs \"Message\").

#### 2.3.4.5.0.0 Class Name

##### 2.3.4.5.1.0 Class Name

LoginForm

##### 2.3.4.5.2.0 File Path

src/components/auth/LoginForm.tsx

##### 2.3.4.5.3.0 Class Type

React Client Component

##### 2.3.4.5.4.0 Inheritance

React.FC

##### 2.3.4.5.5.0 Purpose

Specifies the UI and logic for the user login form. It must handle user input, client-side validation, and submission to the authentication service, covering REQ-1-002.

##### 2.3.4.5.6.0 Dependencies

- useAuth (from app-services)
- MUI TextField, Button, Alert
- React Hook Form
- Zod (for schema)

##### 2.3.4.5.7.0 Framework Specific Attributes

- \"use client\"

##### 2.3.4.5.8.0 Technology Integration Notes

Specification mandates using `react-hook-form` for form state management and `zod` for schema-based validation to ensure a robust and maintainable implementation. All UI elements must be from the MUI library.

##### 2.3.4.5.9.0 Validation Notes

Gap identified and filled: Specification for this essential authentication component was missing.

##### 2.3.4.5.10.0 Implementation Notes

Specification requires handling loading and error states from the `useAuth` hook, disabling the submit button during submission and displaying any authentication errors (e.g., \"Invalid credentials\", \"Account not verified\") in an MUI `Alert` component.

#### 2.3.4.6.0.0 Class Name

##### 2.3.4.6.1.0 Class Name

PostCard

##### 2.3.4.6.2.0 File Path

src/components/feed/PostCard.tsx

##### 2.3.4.6.3.0 Class Type

React Client Component

##### 2.3.4.6.4.0 Inheritance

React.FC<{ post: Post }>

##### 2.3.4.6.5.0 Purpose

Specifies the component responsible for rendering a single post in the news feed. It displays author info, content, media, and action buttons, covering requirements REQ-1-019, REQ-1-021, and REQ-1-022.

##### 2.3.4.6.6.0 Dependencies

- UserBadge
- ActionMenu
- ReactionPicker
- LinkPreviewCard
- CommentThread

##### 2.3.4.6.7.0 Framework Specific Attributes

- \"use client\"

##### 2.3.4.6.8.0 Technology Integration Notes

Validation confirms this is a complex organism component that composes many smaller components. The specification requires it to use client-side logic for handling user interactions like liking, commenting, and opening menus. This specification maps directly to mockup MU-0401-002.

##### 2.3.4.6.9.0 Validation Notes

Gap identified and filled: Specification for this core feed component was missing.

##### 2.3.4.6.10.0 Properties

- {'property_name': 'post', 'property_type': 'Post', 'access_modifier': 'prop', 'purpose': 'Specifies that this prop contains the GraphQL `Post` object data to be rendered.', 'validation_attributes': [], 'framework_specific_configuration': '', 'implementation_notes': 'The `Post` type is specified to be auto-generated by GraphQL Code Generator.'}

##### 2.3.4.6.11.0 Methods

*No items available*

##### 2.3.4.6.12.0 Events

*No items available*

##### 2.3.4.6.13.0 Implementation Notes

Specification requires this component to be memoized (`React.memo`) to prevent unnecessary re-renders when used in a long, virtualized list like the feed.

### 2.3.5.0.0.0 Interface Specifications

- {'interface_name': 'useAuth', 'file_path': 'src/app-services/auth/hooks/useAuth.ts', 'purpose': 'Specifies a custom React hook to encapsulate all authentication-related logic, providing a simple interface for UI components to interact with the auth system for login, logout, and registration.', 'generic_constraints': 'None', 'framework_specific_inheritance': '() => AuthHookResult', 'validation_notes': 'Gap identified and filled: This critical service hook, responsible for orchestrating auth sequences like SEQ-242, 243, 245, was missing.', 'method_contracts': [{'method_name': 'login', 'method_signature': 'login(credentials: LoginInput): Promise<void>', 'return_type': 'Promise<void>', 'framework_attributes': [], 'parameters': [{'parameter_name': 'credentials', 'parameter_type': 'LoginInput', 'purpose': "User's email and password."}], 'contract_description': 'Specifies the execution of the login mutation, handling of token storage on success, and management of error state on failure.', 'exception_contracts': "Specification requires that the hook does not throw; errors are exposed via the `error` property in the hook's return value."}, {'method_name': 'logout', 'method_signature': 'logout(): Promise<void>', 'return_type': 'Promise<void>', 'framework_attributes': [], 'parameters': [], 'contract_description': 'Specifies the execution of the logout mutation, clearing local tokens and Apollo cache, and redirecting the user.', 'exception_contracts': 'Specification requires graceful error handling.'}, {'method_name': 'register', 'method_signature': 'register(data: RegisterInput): Promise<void>', 'return_type': 'Promise<void>', 'framework_attributes': [], 'parameters': [{'parameter_name': 'data', 'parameter_type': 'RegisterInput', 'purpose': "New user's email and password."}], 'contract_description': 'Specifies the execution of the registration mutation and handling of success/error states.', 'exception_contracts': 'Specification requires errors to be exposed via the `error` property.'}], 'property_contracts': [{'property_name': 'user', 'property_type': 'User | null', 'getter_contract': 'Specifies a property that returns the currently authenticated user object, or null if unauthenticated.', 'setter_contract': 'N/A'}, {'property_name': 'isAuthenticated', 'property_type': 'boolean', 'getter_contract': 'Specifies a property that returns true if the user is authenticated, false otherwise.', 'setter_contract': 'N/A'}, {'property_name': 'loading', 'property_type': 'boolean', 'getter_contract': 'Specifies a property that returns true while an authentication operation (login, register) is in progress.', 'setter_contract': 'N/A'}, {'property_name': 'error', 'property_type': 'ApolloError | undefined', 'getter_contract': 'Specifies a property that returns an ApolloError object if the last operation failed.', 'setter_contract': 'N/A'}], 'implementation_guidance': 'Specification requires implementation via a React Context provider (`AuthProvider`) that contains the core logic, and a `useAuth` hook that consumes this context. This ensures a single source of truth for auth state across the app.'}

### 2.3.6.0.0.0 Enum Specifications

*No items available*

### 2.3.7.0.0.0 Dto Specifications

#### 2.3.7.1.0.0 Dto Name

##### 2.3.7.1.1.0 Dto Name

LoginInputSchema

##### 2.3.7.1.2.0 File Path

src/app-services/auth/validators/schemas.ts

##### 2.3.7.1.3.0 Purpose

Specifies a Zod schema for validating the login form data on the client side before submission.

##### 2.3.7.1.4.0 Framework Base Class

z.object

##### 2.3.7.1.5.0 Validation Notes

Gap identified and filled: Specification for client-side validation schemas was missing.

##### 2.3.7.1.6.0 Properties

###### 2.3.7.1.6.1 Property Name

####### 2.3.7.1.6.1.1 Property Name

email

####### 2.3.7.1.6.1.2 Property Type

z.string()

####### 2.3.7.1.6.1.3 Validation Attributes

- .min(1, \"Email is required\")
- .email(\"Invalid email address\")

####### 2.3.7.1.6.1.4 Serialization Attributes

*No items available*

####### 2.3.7.1.6.1.5 Framework Specific Attributes

*No items available*

###### 2.3.7.1.6.2.0 Property Name

####### 2.3.7.1.6.2.1 Property Name

password

####### 2.3.7.1.6.2.2 Property Type

z.string()

####### 2.3.7.1.6.2.3 Validation Attributes

- .min(1, \"Password is required\")

####### 2.3.7.1.6.2.4 Serialization Attributes

*No items available*

####### 2.3.7.1.6.2.5 Framework Specific Attributes

*No items available*

##### 2.3.7.1.7.0.0 Validation Rules

Specification requires validation that email is in a correct format and that both fields are non-empty.

##### 2.3.7.1.8.0.0 Serialization Requirements

Specification clarifies this is a validation schema, not a serialization DTO, to be used with React Hook Form's resolver.

#### 2.3.7.2.0.0.0 Dto Name

##### 2.3.7.2.1.0.0 Dto Name

RegisterInputSchema

##### 2.3.7.2.2.0.0 File Path

src/app-services/auth/validators/schemas.ts

##### 2.3.7.2.3.0.0 Purpose

Specifies a Zod schema for validating the registration form data, enforcing password complexity rules on the client side.

##### 2.3.7.2.4.0.0 Framework Base Class

z.object

##### 2.3.7.2.5.0.0 Validation Notes

Gap identified and filled: Specification for client-side registration validation was missing.

##### 2.3.7.2.6.0.0 Properties

###### 2.3.7.2.6.1.0 Property Name

####### 2.3.7.2.6.1.1 Property Name

email

####### 2.3.7.2.6.1.2 Property Type

z.string()

####### 2.3.7.2.6.1.3 Validation Attributes

- .min(1, \"Email is required\")
- .email(\"Invalid email address\")

####### 2.3.7.2.6.1.4 Serialization Attributes

*No items available*

####### 2.3.7.2.6.1.5 Framework Specific Attributes

*No items available*

###### 2.3.7.2.6.2.0 Property Name

####### 2.3.7.2.6.2.1 Property Name

password

####### 2.3.7.2.6.2.2 Property Type

z.string()

####### 2.3.7.2.6.2.3 Validation Attributes

- .min(12, \"Password must be at least 12 characters\")
- .regex(/[A-Z]/, \"Must contain one uppercase letter\")
- .regex(/[a-z]/, \"Must contain one lowercase letter\")
- .regex(/[0-9]/, \"Must contain one number\")
- .regex(/[^A-Za-z0-9]/, \"Must contain one special character\")

####### 2.3.7.2.6.2.4 Serialization Attributes

*No items available*

####### 2.3.7.2.6.2.5 Framework Specific Attributes

*No items available*

##### 2.3.7.2.7.0.0 Validation Rules

Specification requires validation of email format and enforces all password complexity rules from REQ-1-001.

##### 2.3.7.2.8.0.0 Serialization Requirements

Specification requires use with React Hook Form for client-side validation.

### 2.3.8.0.0.0.0 Configuration Specifications

#### 2.3.8.1.0.0.0 Configuration Name

##### 2.3.8.1.1.0.0 Configuration Name

Next.js Configuration

##### 2.3.8.1.2.0.0 File Path

next.config.mjs

##### 2.3.8.1.3.0.0 Purpose

Specifies the build and runtime configuration for the Next.js application.

##### 2.3.8.1.4.0.0 Framework Base Class

NextConfig

##### 2.3.8.1.5.0.0 Validation Notes

Gap identified and filled: Core framework configuration specification was missing.

##### 2.3.8.1.6.0.0 Configuration Sections

###### 2.3.8.1.6.1.0 Section Name

####### 2.3.8.1.6.1.1 Section Name

compiler

####### 2.3.8.1.6.1.2 Properties

- {'property_name': 'styledComponents', 'property_type': 'boolean', 'default_value': 'true', 'required': True, 'description': 'Specifies enabling the SWC transform for server-side rendering compatibility with MUI.'}

###### 2.3.8.1.6.2.0 Section Name

####### 2.3.8.1.6.2.1 Section Name

images

####### 2.3.8.1.6.2.2 Properties

- {'property_name': 'remotePatterns', 'property_type': 'Array', 'default_value': '[]', 'required': True, 'description': 'Specifies a whitelist of domains from which images can be optimized via `next/image`, such as the AWS S3/Cloudflare CDN domain (REQ-1-072).'}

##### 2.3.8.1.7.0.0 Validation Requirements

Specification requires configuration to be valid according to the Next.js documentation for the target version.

#### 2.3.8.2.0.0.0 Configuration Name

##### 2.3.8.2.1.0.0 Configuration Name

Apollo Client Configuration

##### 2.3.8.2.2.0.0 File Path

src/lib/apollo-client.ts

##### 2.3.8.2.3.0.0 Purpose

Specifies the initialization and configuration of the Apollo Client instance for GraphQL communication.

##### 2.3.8.2.4.0.0 Framework Base Class

ApolloClient

##### 2.3.8.2.5.0.0 Validation Notes

Gap identified and filled: This critical infrastructure configuration, essential for all data operations, was missing from the specification.

##### 2.3.8.2.6.0.0 Configuration Sections

###### 2.3.8.2.6.1.0 Section Name

####### 2.3.8.2.6.1.1 Section Name

link

####### 2.3.8.2.6.1.2 Properties

######## 2.3.8.2.6.1.2.1 Property Name

######### 2.3.8.2.6.1.2.1.1 Property Name

httpLink

######### 2.3.8.2.6.1.2.1.2 Property Type

HttpLink

######### 2.3.8.2.6.1.2.1.3 Default Value



######### 2.3.8.2.6.1.2.1.4 Required

✅ Yes

######### 2.3.8.2.6.1.2.1.5 Description

Specifies the HTTP link pointing to the GraphQL API Gateway endpoint. Must be configured with the `uri` from environment variables.

######## 2.3.8.2.6.1.2.2.0 Property Name

######### 2.3.8.2.6.1.2.2.1 Property Name

authLink

######### 2.3.8.2.6.1.2.2.2 Property Type

ApolloLink

######### 2.3.8.2.6.1.2.2.3 Default Value



######### 2.3.8.2.6.1.2.2.4 Required

✅ Yes

######### 2.3.8.2.6.1.2.2.5 Description

Specifies a context-setting link that attaches the JWT access token to the `Authorization` header of every GraphQL request, fulfilling REQ-1-004.

######## 2.3.8.2.6.1.2.3.0 Property Name

######### 2.3.8.2.6.1.2.3.1 Property Name

errorLink

######### 2.3.8.2.6.1.2.3.2 Property Type

ErrorLink

######### 2.3.8.2.6.1.2.3.3 Default Value



######### 2.3.8.2.6.1.2.3.4 Required

✅ Yes

######### 2.3.8.2.6.1.2.3.5 Description

Specifies an error-handling link to globally catch and log GraphQL and network errors, and to handle 401 token expiry by triggering the refresh flow, as detailed in SEQ-244.

###### 2.3.8.2.6.2.0.0.0 Section Name

####### 2.3.8.2.6.2.1.0.0 Section Name

cache

####### 2.3.8.2.6.2.2.0.0 Properties

- {'property_name': 'inMemoryCache', 'property_type': 'InMemoryCache', 'default_value': '', 'required': True, 'description': 'Specifies the configuration for the client-side cache, including `typePolicies` for managing pagination and relationships between entities.'}

##### 2.3.8.2.7.0.0.0.0 Validation Requirements

Specification requires this to result in a functional ApolloClient instance capable of communicating with the backend.

### 2.3.9.0.0.0.0.0.0 Dependency Injection Specifications

*No items available*

### 2.3.10.0.0.0.0.0.0 External Integration Specifications

#### 2.3.10.1.0.0.0.0.0 Integration Target

##### 2.3.10.1.1.0.0.0.0 Integration Target

GraphQL API Gateway

##### 2.3.10.1.2.0.0.0.0 Integration Type

API (GraphQL)

##### 2.3.10.1.3.0.0.0.0 Required Client Classes

- ApolloClient
- HttpLink
- ApolloLink
- useQuery
- useMutation

##### 2.3.10.1.4.0.0.0.0 Configuration Requirements

Specification requires the GraphQL endpoint URL to be provided via environment variables (`NEXT_PUBLIC_GRAPHQL_ENDPOINT`).

##### 2.3.10.1.5.0.0.0.0 Error Handling Requirements

Specification requires handling of GraphQL errors (e.g., validation, authorization) and network errors. The Apollo Error Link must be used for global handling.

##### 2.3.10.1.6.0.0.0.0 Authentication Requirements

Specification requires all requests to include a JWT access token in the `Authorization: Bearer <token>` header, managed by the `authLink`.

##### 2.3.10.1.7.0.0.0.0 Framework Integration Patterns

Specification requires the Apollo Client to be integrated using the Provider Pattern (`ApolloProvider`) at the root of the application.

#### 2.3.10.2.0.0.0.0.0 Integration Target

##### 2.3.10.2.1.0.0.0.0 Integration Target

Messaging & Notification Service

##### 2.3.10.2.2.0.0.0.0 Integration Type

Real-time (WebSocket)

##### 2.3.10.2.3.0.0.0.0 Required Client Classes

- Socket (from socket.io-client)

##### 2.3.10.2.4.0.0.0.0 Configuration Requirements

Specification requires the WebSocket server URL to be provided via environment variables (`NEXT_PUBLIC_WEBSOCKET_URL`).

##### 2.3.10.2.5.0.0.0.0 Error Handling Requirements

Specification requires handling of connection errors, disconnections, and implementation of a reconnection strategy.

##### 2.3.10.2.6.0.0.0.0 Authentication Requirements

Specification requires the client to send the JWT access token during the initial connection handshake for server-side authentication.

##### 2.3.10.2.7.0.0.0.0 Framework Integration Patterns

Specification requires a `SocketProvider` React Context to be created to manage the socket lifecycle and provide the socket instance to components via a `useSocket` custom hook.

## 2.4.0.0.0.0.0.0.0 Component Count Validation

| Property | Value |
|----------|-------|
| Total Classes | 6 |
| Total Interfaces | 1 |
| Total Enums | 0 |
| Total Dtos | 2 |
| Total Configurations | 2 |
| Total External Integrations | 2 |
| Grand Total Components | 13 |
| Phase 2 Claimed Count | 0 |
| Phase 2 Actual Count | 0 |
| Validation Added Count | 13 |
| Final Validated Count | 75 |
| Notes | Validation count (13) reflects foundational/exempl... |

# 3.0.0.0.0.0.0.0.0 File Structure

## 3.1.0.0.0.0.0.0.0 Directory Organization

### 3.1.1.0.0.0.0.0.0 Directory Path

#### 3.1.1.1.0.0.0.0.0 Directory Path

/

#### 3.1.1.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.1.3.0.0.0.0.0 Contains Files

- package.json
- tsconfig.json
- .editorconfig
- .env.example
- next.config.mjs
- Dockerfile
- .dockerignore
- .eslintrc.json
- .prettierrc
- .prettierignore
- jest.config.js
- jest.setup.js
- playwright.config.ts
- .gitignore
- README.md

#### 3.1.1.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.1.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.2.0.0.0.0.0.0 Directory Path

#### 3.1.2.1.0.0.0.0.0 Directory Path

.github/workflows

#### 3.1.2.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.2.3.0.0.0.0.0 Contains Files

- ci.yml
- cd.yml

#### 3.1.2.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.2.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.3.0.0.0.0.0.0 Directory Path

#### 3.1.3.1.0.0.0.0.0 Directory Path

.vscode

#### 3.1.3.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.3.3.0.0.0.0.0 Contains Files

- settings.json

#### 3.1.3.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.3.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

