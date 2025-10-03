# 1 Components

## 1.1 Components

### 1.1.1 web-spa-001

#### 1.1.1.1 Id

web-spa-001

#### 1.1.1.2 Name

WebApp (Single Page Application)

#### 1.1.1.3 Description

The client-facing Single Page Application (SPA) built with Next.js. It handles all user interface rendering, client-side state management, and communication with the API Gateway.

#### 1.1.1.4 Type

🔹 ClientApplication

#### 1.1.1.5 Dependencies

- api-gateway-001

#### 1.1.1.6 Properties

| Property | Value |
|----------|-------|
| Framework | Next.js |
| Language | TypeScript |
| Ui Library | MUI |

#### 1.1.1.7 Interfaces

- User Interface (UI)
- GraphQL API Consumer
- WebSocket Client (Socket.IO)

#### 1.1.1.8 Technology

Next.js, React, TypeScript, MUI, Apollo Client, Socket.IO Client

#### 1.1.1.9 Resources

| Property | Value |
|----------|-------|
| Cpu | N/A (Client-Side) |
| Memory | N/A (Client-Side) |
| Storage | N/A (Client-Side) |
| Network | Standard HTTPS/WSS |

#### 1.1.1.10 Configuration

##### 1.1.1.10.1 Api Gateway Url

🔗 [https://api.platform.com/graphql](https://api.platform.com/graphql)

##### 1.1.1.10.2 Web Socket Url

🔗 [wss://ws.platform.com](wss://ws.platform.com)

#### 1.1.1.11.0 Health Check

*Not specified*

#### 1.1.1.12.0 Responsible Features

- REQ-1-060
- REQ-1-061
- REQ-1-062
- REQ-1-066

#### 1.1.1.13.0 Security

##### 1.1.1.13.1 Requires Authentication

❌ No

##### 1.1.1.13.2 Requires Authorization

❌ No

##### 1.1.1.13.3 Allowed Roles

*No items available*

##### 1.1.1.13.4 Notes

Handles secure storage of JWT access and refresh tokens on the client. Implements client-side validation as a first line of defense.

### 1.1.2.0.0 api-gateway-001

#### 1.1.2.1.0 Id

api-gateway-001

#### 1.1.2.2.0 Name

API Gateway

#### 1.1.2.3.0 Description

A managed AWS API Gateway that serves as the single, unified entry point for the WebApp client. It exposes a GraphQL API and routes requests to the appropriate downstream microservices.

#### 1.1.2.4.0 Type

🔹 APIGateway

#### 1.1.2.5.0 Dependencies

- identity-access-service-001
- user-profile-service-002
- connections-service-003
- posts-service-004
- engagement-service-005
- feed-service-006
- messaging-service-007
- search-service-008
- notifications-service-009

#### 1.1.2.6.0 Properties

| Property | Value |
|----------|-------|
| Provider | AWS API Gateway |

#### 1.1.2.7.0 Interfaces

- GraphQL API (versioned)

#### 1.1.2.8.0 Technology

AWS API Gateway

#### 1.1.2.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | N/A (Managed Service) |
| Memory | N/A (Managed Service) |
| Storage | N/A (Managed Service) |
| Network | Managed by AWS |

#### 1.1.2.10.0 Configuration

| Property | Value |
|----------|-------|
| Rate Limit | 100 requests/second/IP |
| Burst Limit | 200 requests/second/IP |
| Authentication | JWT Authorizer |

#### 1.1.2.11.0 Health Check

*Not specified*

#### 1.1.2.12.0 Responsible Features

- REQ-1-065
- REQ-1-086
- REQ-1-087

#### 1.1.2.13.0 Security

##### 1.1.2.13.1 Requires Authentication

✅ Yes

##### 1.1.2.13.2 Requires Authorization

✅ Yes

##### 1.1.2.13.3 Allowed Roles

*No items available*

##### 1.1.2.13.4 Notes

Performs authentication for all requests by validating the JWT access token. Enforces rate limiting and throttling policies.

### 1.1.3.0.0 identity-access-service-001

#### 1.1.3.1.0 Id

identity-access-service-001

#### 1.1.3.2.0 Name

Identity & Access Service

#### 1.1.3.3.0 Description

Manages core user identity, authentication, and authorization. Handles user registration, login, password management, session tokens (JWT), and MFA.

#### 1.1.3.4.0 Type

🔹 Service

#### 1.1.3.5.0 Dependencies

- PostgreSQL (User, UserToken, Role tables)
- Redis (Token Blocklist)
- AWS SES (Transactional Emails)

#### 1.1.3.6.0 Properties

| Property | Value |
|----------|-------|
| Domain | Identity and Access Management |

#### 1.1.3.7.0 Interfaces

- gRPC: AuthService (Login, Register, RefreshToken, Logout, ResetPassword)
- GraphQL Resolvers (via API Gateway)
- Event Publisher: UserRegistered, PasswordChanged, MfaStatusChanged

#### 1.1.3.8.0 Technology

Node.js, NestJS, TypeScript, gRPC

#### 1.1.3.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | 1 vCPU |
| Memory | 2GB |
| Storage | 1GB |

#### 1.1.3.10.0 Configuration

| Property | Value |
|----------|-------|
| Jwt.access Token Secret | env_var |
| Jwt.refresh Token Secret | env_var |
| Jwt.access Token Lifetime | 15m |
| Jwt.refresh Token Lifetime | 7d |
| Bcrypt.salt Rounds | 12 |

#### 1.1.3.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.3.12.0 Responsible Features

- REQ-1-001
- REQ-1-002
- REQ-1-003
- REQ-1-004
- REQ-1-005
- REQ-1-055
- REQ-1-092

#### 1.1.3.13.0 Security

##### 1.1.3.13.1 Requires Authentication

❌ No

##### 1.1.3.13.2 Requires Authorization

❌ No

##### 1.1.3.13.3 Allowed Roles

*No items available*

##### 1.1.3.13.4 Notes

The authoritative source for authentication. Manages password hashes, MFA secrets, and JWT generation/validation logic.

### 1.1.4.0.0 user-profile-service-002

#### 1.1.4.1.0 Id

user-profile-service-002

#### 1.1.4.2.0 Name

User Profile Service

#### 1.1.4.3.0 Description

Manages all user profile data, including basic info, work experience, education, skills, and images. Handles profile visibility and custom URLs.

#### 1.1.4.4.0 Type

🔹 Service

#### 1.1.4.5.0 Dependencies

- PostgreSQL (UserProfile, WorkExperience, Education, Skill tables)
- Redis (Profile Cache)
- AWS S3 (Profile/Banner Images)

#### 1.1.4.6.0 Properties

| Property | Value |
|----------|-------|
| Domain | User Profile |

#### 1.1.4.7.0 Interfaces

- gRPC: UserProfileService (GetProfile, UpdateProfile, GetMultipleProfiles)
- GraphQL Resolvers (via API Gateway)
- Event Publisher: ProfileUpdated, AccountDeactivated, AccountDeleted
- Event Consumer: UserRegistered

#### 1.1.4.8.0 Technology

Node.js, NestJS, TypeScript, gRPC

#### 1.1.4.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | 1 vCPU |
| Memory | 2GB |
| Storage | 1GB |

#### 1.1.4.10.0 Configuration

##### 1.1.4.10.1 S3.bucket Name

user-profile-media

##### 1.1.4.10.2 Redis.cache Ttl

3600s

#### 1.1.4.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.4.12.0 Responsible Features

- REQ-1-006
- REQ-1-007
- REQ-1-008
- REQ-1-009
- REQ-1-010
- REQ-1-012
- REQ-1-013
- REQ-1-014
- REQ-1-056
- REQ-1-057

#### 1.1.4.13.0 Security

##### 1.1.4.13.1 Requires Authentication

✅ Yes

##### 1.1.4.13.2 Requires Authorization

✅ Yes

##### 1.1.4.13.3 Allowed Roles

- USER

##### 1.1.4.13.4 Notes

Enforces authorization rules to ensure users can only edit their own profiles. Enforces visibility settings on data retrieval.

### 1.1.5.0.0 connections-service-003

#### 1.1.5.1.0 Id

connections-service-003

#### 1.1.5.2.0 Name

Connections Service

#### 1.1.5.3.0 Description

Manages the social graph of the platform. Handles sending, accepting, declining, and removing connections.

#### 1.1.5.4.0 Type

🔹 Service

#### 1.1.5.5.0 Dependencies

- PostgreSQL (Connection table)
- Redis (Connection Set Cache)

#### 1.1.5.6.0 Properties

| Property | Value |
|----------|-------|
| Domain | Social Graph |

#### 1.1.5.7.0 Interfaces

- gRPC: ConnectionsService (SendRequest, AcceptRequest, GetConnections, IsConnected)
- GraphQL Resolvers (via API Gateway)
- Event Publisher: ConnectionRequestSent, ConnectionAccepted

#### 1.1.5.8.0 Technology

Node.js, NestJS, TypeScript, gRPC

#### 1.1.5.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | 1 vCPU |
| Memory | 2GB |
| Storage | 1GB |

#### 1.1.5.10.0 Configuration

##### 1.1.5.10.1 Redis.cache Key Prefix

connections:

#### 1.1.5.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.5.12.0 Responsible Features

- REQ-1-015
- REQ-1-016
- REQ-1-017
- REQ-1-018
- REQ-1-090

#### 1.1.5.13.0 Security

##### 1.1.5.13.1 Requires Authentication

✅ Yes

##### 1.1.5.13.2 Requires Authorization

✅ Yes

##### 1.1.5.13.3 Allowed Roles

- USER

##### 1.1.5.13.4 Notes

Ensures users can only manage their own connection requests and lists.

### 1.1.6.0.0 posts-service-004

#### 1.1.6.1.0 Id

posts-service-004

#### 1.1.6.2.0 Name

Posts Service

#### 1.1.6.3.0 Description

Handles the creation, editing, deletion, and retrieval of user posts. Manages post content, attached media, and link previews.

#### 1.1.6.4.0 Type

🔹 Service

#### 1.1.6.5.0 Dependencies

- PostgreSQL (Post, Media, PostMedia tables)
- AWS S3 (Post Images)

#### 1.1.6.6.0 Properties

| Property | Value |
|----------|-------|
| Domain | User Content |

#### 1.1.6.7.0 Interfaces

- gRPC: PostsService (CreatePost, GetPost, GetUserPosts, DeletePost)
- GraphQL Resolvers (via API Gateway)
- Event Publisher: PostCreated, PostDeleted, PostReported

#### 1.1.6.8.0 Technology

Node.js, NestJS, TypeScript, gRPC

#### 1.1.6.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | 1 vCPU |
| Memory | 2GB |
| Storage | 1GB |

#### 1.1.6.10.0 Configuration

| Property | Value |
|----------|-------|
| S3.bucket Name | user-post-media |
| Post.max Chars | 3000 |
| Post.max Images | 4 |

#### 1.1.6.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.6.12.0 Responsible Features

- REQ-1-019
- REQ-1-023
- REQ-1-024
- REQ-1-091

#### 1.1.6.13.0 Security

##### 1.1.6.13.1 Requires Authentication

✅ Yes

##### 1.1.6.13.2 Requires Authorization

✅ Yes

##### 1.1.6.13.3 Allowed Roles

- USER

##### 1.1.6.13.4 Notes

Validates that a user can only edit or delete their own posts. Checks connection status and profile visibility before returning post data.

### 1.1.7.0.0 engagement-service-005

#### 1.1.7.1.0 Id

engagement-service-005

#### 1.1.7.2.0 Name

Engagement Service

#### 1.1.7.3.0 Description

Manages user interactions with content, such as reactions (likes), comments, and skill endorsements. Designed to handle high-volume write operations.

#### 1.1.7.4.0 Type

🔹 Service

#### 1.1.7.5.0 Dependencies

- PostgreSQL (PostReaction, Comment, SkillEndorsement tables)
- posts-service-004
- user-profile-service-002

#### 1.1.7.6.0 Properties

| Property | Value |
|----------|-------|
| Domain | User Engagement |

#### 1.1.7.7.0 Interfaces

- gRPC: EngagementService (AddReaction, AddComment, AddEndorsement)
- GraphQL Resolvers (via API Gateway)
- Event Publisher: PostReacted, CommentAdded, SkillEndorsed
- Event Consumer: PostDeleted

#### 1.1.7.8.0 Technology

Node.js, NestJS, TypeScript, gRPC

#### 1.1.7.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | 1 vCPU |
| Memory | 2GB |
| Storage | 1GB |

#### 1.1.7.10.0 Configuration

##### 1.1.7.10.1 Comment.max Chars

1500

#### 1.1.7.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.7.12.0 Responsible Features

- REQ-1-011
- REQ-1-021
- REQ-1-022
- REQ-1-025
- REQ-1-028

#### 1.1.7.13.0 Security

##### 1.1.7.13.1 Requires Authentication

✅ Yes

##### 1.1.7.13.2 Requires Authorization

✅ Yes

##### 1.1.7.13.3 Allowed Roles

- USER

##### 1.1.7.13.4 Notes

Validates user permissions before allowing actions (e.g., must be a 1st-degree connection to endorse a skill).

### 1.1.8.0.0 feed-service-006

#### 1.1.8.1.0 Id

feed-service-006

#### 1.1.8.2.0 Name

Feed Service

#### 1.1.8.3.0 Description

Generates and serves personalized news feeds for users. Implements the fan-out-on-write pattern for high read performance.

#### 1.1.8.4.0 Type

🔹 Service

#### 1.1.8.5.0 Dependencies

- Redis (User Feed Lists)
- posts-service-004
- connections-service-003

#### 1.1.8.6.0 Properties

| Property | Value |
|----------|-------|
| Pattern | Fan-out-on-write |

#### 1.1.8.7.0 Interfaces

- gRPC: FeedService (GetFeed)
- GraphQL Resolvers (via API Gateway)
- Event Consumer: PostCreated, ConnectionAccepted, ConnectionRemoved

#### 1.1.8.8.0 Technology

Node.js, NestJS, TypeScript, gRPC

#### 1.1.8.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | 2 vCPU |
| Memory | 4GB |
| Storage | 1GB |

#### 1.1.8.10.0 Configuration

##### 1.1.8.10.1 Feed.max Length

500

##### 1.1.8.10.2 Redis.feed Key Prefix

feed:

#### 1.1.8.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.8.12.0 Responsible Features

- REQ-1-020

#### 1.1.8.13.0 Security

##### 1.1.8.13.1 Requires Authentication

✅ Yes

##### 1.1.8.13.2 Requires Authorization

✅ Yes

##### 1.1.8.13.3 Allowed Roles

- USER

##### 1.1.8.13.4 Notes

Ensures a user can only retrieve their own news feed.

### 1.1.9.0.0 messaging-service-007

#### 1.1.9.1.0 Id

messaging-service-007

#### 1.1.9.2.0 Name

Messaging Service

#### 1.1.9.3.0 Description

Manages real-time, one-on-one direct messaging between connected users. Maintains WebSocket connections and message history.

#### 1.1.9.4.0 Type

🔹 Service

#### 1.1.9.5.0 Dependencies

- PostgreSQL (Conversation, Message tables)
- Redis (WebSocket connection state)
- connections-service-003

#### 1.1.9.6.0 Properties

| Property | Value |
|----------|-------|
| Protocol | WebSocket (Socket.IO) |

#### 1.1.9.7.0 Interfaces

- WebSocket API (SendMessage, MarkAsRead, TypingIndicator)
- gRPC: MessagingService (GetMessageHistory)
- GraphQL Resolvers (via API Gateway)

#### 1.1.9.8.0 Technology

Node.js, NestJS, TypeScript, Socket.IO

#### 1.1.9.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | 2 vCPU |
| Memory | 4GB |
| Storage | 1GB |

#### 1.1.9.10.0 Configuration

##### 1.1.9.10.1 Max Connections

10000

#### 1.1.9.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.9.12.0 Responsible Features

- REQ-1-026
- REQ-1-027
- REQ-1-028
- REQ-1-029

#### 1.1.9.13.0 Security

##### 1.1.9.13.1 Requires Authentication

✅ Yes

##### 1.1.9.13.2 Requires Authorization

✅ Yes

##### 1.1.9.13.3 Allowed Roles

- USER

##### 1.1.9.13.4 Notes

Authenticates WebSocket connections. Enforces that only first-degree connections can message each other by calling the Connections Service.

### 1.1.10.0.0 search-service-008

#### 1.1.10.1.0 Id

search-service-008

#### 1.1.10.2.0 Name

Search Service

#### 1.1.10.3.0 Description

Provides advanced user search capabilities, acting as a facade for the OpenSearch cluster. Handles indexing of user profile data and constructs complex search queries.

#### 1.1.10.4.0 Type

🔹 Service

#### 1.1.10.5.0 Dependencies

- AWS OpenSearch
- connections-service-003

#### 1.1.10.6.0 Properties

| Property | Value |
|----------|-------|
| Engine | OpenSearch |

#### 1.1.10.7.0 Interfaces

- gRPC: SearchService (SearchUsers)
- GraphQL Resolvers (via API Gateway)
- Event Consumer: ProfileUpdated, AccountDeactivated, AccountDeleted

#### 1.1.10.8.0 Technology

Node.js, NestJS, TypeScript, gRPC

#### 1.1.10.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | 1 vCPU |
| Memory | 2GB |
| Storage | 1GB |

#### 1.1.10.10.0 Configuration

##### 1.1.10.10.1 Opensearch.index Name

user_profiles

##### 1.1.10.10.2 Opensearch.fuzzy Distance

AUTO

#### 1.1.10.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.10.12.0 Responsible Features

- REQ-1-030
- REQ-1-031
- REQ-1-032
- REQ-1-033
- REQ-1-034
- REQ-1-035

#### 1.1.10.13.0 Security

##### 1.1.10.13.1 Requires Authentication

✅ Yes

##### 1.1.10.13.2 Requires Authorization

❌ No

##### 1.1.10.13.3 Allowed Roles

*No items available*

##### 1.1.10.13.4 Notes

Implements search logic that respects user privacy settings (public vs. private profiles) at query time.

### 1.1.11.0.0 notifications-service-009

#### 1.1.11.1.0 Id

notifications-service-009

#### 1.1.11.2.0 Name

Notifications Service

#### 1.1.11.3.0 Description

Manages the creation, aggregation, and delivery of user notifications for events like new connections, reactions, and comments.

#### 1.1.11.4.0 Type

🔹 Service

#### 1.1.11.5.0 Dependencies

- PostgreSQL (Notification table)
- messaging-service-007 (for WebSocket delivery)
- AWS SES (for email delivery)

#### 1.1.11.6.0 Properties

| Property | Value |
|----------|-------|
| Features | ['Real-time delivery', 'Batching/Aggregation'] |

#### 1.1.11.7.0 Interfaces

- gRPC: NotificationsService (GetNotifications, MarkAsRead)
- GraphQL Resolvers (via API Gateway)
- Event Consumer: ConnectionRequestSent, ConnectionAccepted, PostReacted, CommentAdded

#### 1.1.11.8.0 Technology

Node.js, NestJS, TypeScript, gRPC

#### 1.1.11.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | 1 vCPU |
| Memory | 2GB |
| Storage | 1GB |

#### 1.1.11.10.0 Configuration

##### 1.1.11.10.1 Batching.window

5m

#### 1.1.11.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.11.12.0 Responsible Features

- REQ-1-036
- REQ-1-037
- REQ-1-038
- REQ-1-039

#### 1.1.11.13.0 Security

##### 1.1.11.13.1 Requires Authentication

✅ Yes

##### 1.1.11.13.2 Requires Authorization

✅ Yes

##### 1.1.11.13.3 Allowed Roles

- USER

##### 1.1.11.13.4 Notes

Ensures users can only access their own notifications.

### 1.1.12.0.0 admin-service-010

#### 1.1.12.1.0 Id

admin-service-010

#### 1.1.12.2.0 Name

Admin Service

#### 1.1.12.3.0 Description

A Backend-for-Frontend (BFF) service that powers the Admin Dashboard. It provides APIs for content moderation, user management, and viewing audit logs.

#### 1.1.12.4.0 Type

🔹 Service

#### 1.1.12.5.0 Dependencies

- PostgreSQL (ContentReport, AdminAuditLog tables)
- identity-access-service-001
- user-profile-service-002
- posts-service-004
- engagement-service-005

#### 1.1.12.6.0 Properties

| Property | Value |
|----------|-------|
| Client | Admin Dashboard |

#### 1.1.12.7.0 Interfaces

- gRPC: AdminService (ModerateContent, ManageUser, GetAuditLogs)
- GraphQL Resolvers (via API Gateway, restricted to Admins)
- Event Consumer: PostReported

#### 1.1.12.8.0 Technology

Node.js, NestJS, TypeScript, gRPC

#### 1.1.12.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | 1 vCPU |
| Memory | 2GB |
| Storage | 1GB |

#### 1.1.12.10.0 Configuration

*No data available*

#### 1.1.12.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.12.12.0 Responsible Features

- REQ-1-040
- REQ-1-041
- REQ-1-042
- REQ-1-043
- REQ-1-044
- REQ-1-045

#### 1.1.12.13.0 Security

##### 1.1.12.13.1 Requires Authentication

✅ Yes

##### 1.1.12.13.2 Requires Authorization

✅ Yes

##### 1.1.12.13.3 Allowed Roles

- ADMINISTRATOR

##### 1.1.12.13.4 Notes

Strictly enforces 'Administrator' role-based access control (RBAC) on all its endpoints. Creates an immutable audit log for every action taken.

## 1.2.0.0.0 Configuration

| Property | Value |
|----------|-------|
| Environment | production |
| Logging Level | INFO |
| Communication Protocol | gRPC (internal), GraphQL (external) |
| Observability Stack | OpenTelemetry, Prometheus, Grafana, Loki, Jaeger |

# 2.0.0.0.0 Component Relations

## 2.1.0.0.0 Architecture

### 2.1.1.0.0 Components

#### 2.1.1.1.0 web-client-spa-001

##### 2.1.1.1.1 Id

web-client-spa-001

##### 2.1.1.1.2 Name

Web Client (SPA)

##### 2.1.1.1.3 Description

The user-facing Single Page Application responsible for rendering the UI, managing client-side state, and communicating with the backend. It leverages Server-Side Rendering (SSR) for performance and SEO.

##### 2.1.1.1.4 Type

🔹 Client Application

##### 2.1.1.1.5 Dependencies

- api-gateway-001

##### 2.1.1.1.6 Properties

*No data available*

##### 2.1.1.1.7 Interfaces

- GraphQL over HTTP/S
- WebSocket (Socket.IO)

##### 2.1.1.1.8 Technology

Next.js 14, React 18, TypeScript, MUI

##### 2.1.1.1.9 Resources

###### 2.1.1.1.9.1 Cpu

N/A (Client-side)

###### 2.1.1.1.9.2 Memory

N/A (Client-side)

##### 2.1.1.1.10.0 Configuration

###### 2.1.1.1.10.1 Api Endpoint

🔗 [https://api.platform.com/graphql](https://api.platform.com/graphql)

###### 2.1.1.1.10.2 Websocket Url

🔗 [wss://ws.platform.com](wss://ws.platform.com)

##### 2.1.1.1.11.0 Health Check

*Not specified*

##### 2.1.1.1.12.0 Responsible Features

- REQ-1-001
- REQ-1-002
- REQ-1-008
- REQ-1-015
- REQ-1-019
- REQ-1-030
- REQ-1-038
- REQ-1-060
- REQ-1-061

##### 2.1.1.1.13.0 Observability

###### 2.1.1.1.13.1 Logging

User interaction events, client-side errors, performance metrics (Web Vitals).

###### 2.1.1.1.13.2 Metrics

Page load times (LCP), Time to Interactive (TTI), API call latencies.

##### 2.1.1.1.14.0 Data Owned

*No items available*

#### 2.1.1.2.0.0 api-gateway-001

##### 2.1.1.2.1.0 Id

api-gateway-001

##### 2.1.1.2.2.0 Name

API Gateway

##### 2.1.1.2.3.0 Description

The single, unified entry point for all client applications. It exposes a GraphQL API, federating requests to the appropriate downstream microservices and handling cross-cutting concerns.

##### 2.1.1.2.4.0 Type

🔹 API Gateway

##### 2.1.1.2.5.0 Dependencies

- identity-access-service-002
- user-profile-service-003
- connections-service-004
- posts-service-005
- engagement-service-006
- feed-service-007
- messaging-service-008
- search-service-009
- notifications-service-010

##### 2.1.1.2.6.0 Properties

| Property | Value |
|----------|-------|
| Version | v1 |

##### 2.1.1.2.7.0 Interfaces

- GraphQL (Public)
- gRPC (Internal)

##### 2.1.1.2.8.0 Technology

AWS API Gateway

##### 2.1.1.2.9.0 Resources

###### 2.1.1.2.9.1 Cpu

N/A (Managed Service)

###### 2.1.1.2.9.2 Memory

N/A (Managed Service)

##### 2.1.1.2.10.0 Configuration

###### 2.1.1.2.10.1 Rate Limit

100 requests/sec/user

###### 2.1.1.2.10.2 Burst Limit

200 requests/sec/user

##### 2.1.1.2.11.0 Health Check

*Not specified*

##### 2.1.1.2.12.0 Responsible Features

- REQ-1-065
- REQ-1-086
- REQ-1-087

##### 2.1.1.2.13.0 Observability

###### 2.1.1.2.13.1 Logging

All incoming requests, response statuses, latencies, authentication successes/failures.

###### 2.1.1.2.13.2 Metrics

Request count, error rate (4xx, 5xx), P95 latency, cache hit/miss ratio.

##### 2.1.1.2.14.0 Data Owned

*No items available*

#### 2.1.1.3.0.0 identity-access-service-002

##### 2.1.1.3.1.0 Id

identity-access-service-002

##### 2.1.1.3.2.0 Name

Identity & Access Service

##### 2.1.1.3.3.0 Description

Authoritative service for user identity. Manages the complete user account lifecycle, including registration, authentication, authorization, session management, and security settings.

##### 2.1.1.3.4.0 Type

🔹 Microservice

##### 2.1.1.3.5.0 Dependencies

- PostgreSQL Database
- Redis Cache
- email-service-012

##### 2.1.1.3.6.0 Properties

*No data available*

##### 2.1.1.3.7.0 Interfaces

- gRPC
- Event Publisher

##### 2.1.1.3.8.0 Technology

Node.js, NestJS, TypeScript

##### 2.1.1.3.9.0 Resources

###### 2.1.1.3.9.1 Cpu

1 vCPU

###### 2.1.1.3.9.2 Memory

2 GiB

##### 2.1.1.3.10.0 Configuration

| Property | Value |
|----------|-------|
| Jwt Secret Key | from-secret-manager |
| Access Token Ttl | 15m |
| Refresh Token Ttl | 7d |

##### 2.1.1.3.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.3.12.0 Responsible Features

- REQ-1-001
- REQ-1-002
- REQ-1-003
- REQ-1-004
- REQ-1-005
- REQ-1-006
- REQ-1-007
- REQ-1-055
- REQ-1-059
- REQ-1-092

##### 2.1.1.3.13.0 Observability

###### 2.1.1.3.13.1 Logging

User sign-ups, successful/failed logins, password changes, MFA status changes, account deletions.

###### 2.1.1.3.13.2 Metrics

Registrations/min, Active Sessions, Token Validation Latency, Login Success Rate.

##### 2.1.1.3.14.0 Data Owned

- User
- UserRole
- Role
- UserToken
- AccountDeletionRequest
- UserSecurityAuditLog

#### 2.1.1.4.0.0 user-profile-service-003

##### 2.1.1.4.1.0 Id

user-profile-service-003

##### 2.1.1.4.2.0 Name

User Profile Service

##### 2.1.1.4.3.0 Description

Manages all user profile data, including basic information, work experience, education, skills, and visibility settings. Acts as the source of truth for a user's professional identity.

##### 2.1.1.4.4.0 Type

🔹 Microservice

##### 2.1.1.4.5.0 Dependencies

- PostgreSQL Database
- Redis Cache
- media-service-013

##### 2.1.1.4.6.0 Properties

*No data available*

##### 2.1.1.4.7.0 Interfaces

- gRPC
- Event Publisher

##### 2.1.1.4.8.0 Technology

Node.js, NestJS, TypeScript

##### 2.1.1.4.9.0 Resources

###### 2.1.1.4.9.1 Cpu

1 vCPU

###### 2.1.1.4.9.2 Memory

2 GiB

##### 2.1.1.4.10.0 Configuration

###### 2.1.1.4.10.1 Profile Cache Ttl

3600s

##### 2.1.1.4.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.4.12.0 Responsible Features

- REQ-1-008
- REQ-1-009
- REQ-1-010
- REQ-1-011
- REQ-1-012
- REQ-1-013
- REQ-1-014

##### 2.1.1.4.13.0 Observability

###### 2.1.1.4.13.1 Logging

Profile creation, updates to any profile section (experience, education, skills).

###### 2.1.1.4.13.2 Metrics

Profile Update Rate, Profile View Latency (cache hit/miss), Number of profiles.

##### 2.1.1.4.14.0 Data Owned

- UserProfile
- WorkExperience
- Education
- Skill
- UserProfileSkill

#### 2.1.1.5.0.0 connections-service-004

##### 2.1.1.5.1.0 Id

connections-service-004

##### 2.1.1.5.2.0 Name

Connections Service

##### 2.1.1.5.3.0 Description

Manages the social graph of the platform. Handles all logic related to sending, accepting, declining, and removing connections between users.

##### 2.1.1.5.4.0 Type

🔹 Microservice

##### 2.1.1.5.5.0 Dependencies

- PostgreSQL Database
- Redis Cache

##### 2.1.1.5.6.0 Properties

*No data available*

##### 2.1.1.5.7.0 Interfaces

- gRPC
- Event Publisher

##### 2.1.1.5.8.0 Technology

Node.js, NestJS, TypeScript

##### 2.1.1.5.9.0 Resources

###### 2.1.1.5.9.1 Cpu

0.5 vCPU

###### 2.1.1.5.9.2 Memory

1 GiB

##### 2.1.1.5.10.0 Configuration

###### 2.1.1.5.10.1 Connections Cache Ttl

6h

##### 2.1.1.5.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.5.12.0 Responsible Features

- REQ-1-015
- REQ-1-016
- REQ-1-017
- REQ-1-018
- REQ-1-090

##### 2.1.1.5.13.0 Observability

###### 2.1.1.5.13.1 Logging

Connection requests sent, accepted, declined, and removed.

###### 2.1.1.5.13.2 Metrics

Connection Request Rate, Connection Acceptance Rate, Avg Connections per User.

##### 2.1.1.5.14.0 Data Owned

- Connection

#### 2.1.1.6.0.0 posts-service-005

##### 2.1.1.6.1.0 Id

posts-service-005

##### 2.1.1.6.2.0 Name

Posts Service

##### 2.1.1.6.3.0 Description

Responsible for the lifecycle of core user-generated content: posts and comments. Handles creation, editing, deletion, and retrieval of this content.

##### 2.1.1.6.4.0 Type

🔹 Microservice

##### 2.1.1.6.5.0 Dependencies

- PostgreSQL Database
- media-service-013

##### 2.1.1.6.6.0 Properties

*No data available*

##### 2.1.1.6.7.0 Interfaces

- gRPC
- Event Publisher

##### 2.1.1.6.8.0 Technology

Node.js, NestJS, TypeScript

##### 2.1.1.6.9.0 Resources

###### 2.1.1.6.9.1 Cpu

1.5 vCPU

###### 2.1.1.6.9.2 Memory

3 GiB

##### 2.1.1.6.10.0 Configuration

###### 2.1.1.6.10.1 Max Post Length

3,000

###### 2.1.1.6.10.2 Max Comment Length

1,500

##### 2.1.1.6.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.6.12.0 Responsible Features

- REQ-1-019
- REQ-1-022
- REQ-1-024
- REQ-1-025

##### 2.1.1.6.13.0 Observability

###### 2.1.1.6.13.1 Logging

Post/comment creation, edits, deletions.

###### 2.1.1.6.13.2 Metrics

Posts created/sec, Comments created/sec, Post/Comment retrieval latency.

##### 2.1.1.6.14.0 Data Owned

- Post
- Comment
- PostMedia

#### 2.1.1.7.0.0 engagement-service-006

##### 2.1.1.7.1.0 Id

engagement-service-006

##### 2.1.1.7.2.0 Name

Engagement Service

##### 2.1.1.7.3.0 Description

Manages high-volume, lightweight user interactions such as reactions (likes) on posts and endorsements on skills. Decoupled for independent scaling.

##### 2.1.1.7.4.0 Type

🔹 Microservice

##### 2.1.1.7.5.0 Dependencies

- PostgreSQL Database

##### 2.1.1.7.6.0 Properties

*No data available*

##### 2.1.1.7.7.0 Interfaces

- gRPC
- Event Publisher

##### 2.1.1.7.8.0 Technology

Node.js, NestJS, TypeScript

##### 2.1.1.7.9.0 Resources

###### 2.1.1.7.9.1 Cpu

1 vCPU

###### 2.1.1.7.9.2 Memory

1 GiB

##### 2.1.1.7.10.0 Configuration

*No data available*

##### 2.1.1.7.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.7.12.0 Responsible Features

- REQ-1-021
- REQ-1-011

##### 2.1.1.7.13.0 Observability

###### 2.1.1.7.13.1 Logging

Post reactions, skill endorsements.

###### 2.1.1.7.13.2 Metrics

Reactions/sec, Endorsements/sec.

##### 2.1.1.7.14.0 Data Owned

- PostReaction
- SkillEndorsement

#### 2.1.1.8.0.0 feed-service-007

##### 2.1.1.8.1.0 Id

feed-service-007

##### 2.1.1.8.2.0 Name

Feed Service

##### 2.1.1.8.3.0 Description

A CQRS read-model service that constructs and serves personalized news feeds. It consumes events to maintain a denormalized, 'ready-to-read' feed for each user in a fast data store.

##### 2.1.1.8.4.0 Type

🔹 Microservice

##### 2.1.1.8.5.0 Dependencies

- Redis Cache

##### 2.1.1.8.6.0 Properties

*No data available*

##### 2.1.1.8.7.0 Interfaces

- gRPC (Read-only)
- Event Consumer

##### 2.1.1.8.8.0 Technology

Node.js, NestJS, TypeScript

##### 2.1.1.8.9.0 Resources

###### 2.1.1.8.9.1 Cpu

1 vCPU

###### 2.1.1.8.9.2 Memory

4 GiB

##### 2.1.1.8.10.0 Configuration

###### 2.1.1.8.10.1 Feed Length

$100

##### 2.1.1.8.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.8.12.0 Responsible Features

- REQ-1-020

##### 2.1.1.8.13.0 Observability

###### 2.1.1.8.13.1 Logging

Feed generation events (fan-out on write), feed read requests.

###### 2.1.1.8.13.2 Metrics

Feed Generation Latency, Feed Read Latency, Feed Cache Hit/Miss Ratio.

##### 2.1.1.8.14.0 Data Owned

*No items available*

#### 2.1.1.9.0.0 messaging-service-008

##### 2.1.1.9.1.0 Id

messaging-service-008

##### 2.1.1.9.2.0 Name

Messaging Service

##### 2.1.1.9.3.0 Description

Manages all real-time private conversations. Handles WebSocket connections, message persistence, and delivery status tracking (delivered/read).

##### 2.1.1.9.4.0 Type

🔹 Microservice

##### 2.1.1.9.5.0 Dependencies

- PostgreSQL Database

##### 2.1.1.9.6.0 Properties

| Property | Value |
|----------|-------|
| Is Stateful | ✅ |

##### 2.1.1.9.7.0 Interfaces

- gRPC
- WebSocket (Socket.IO)

##### 2.1.1.9.8.0 Technology

Node.js, NestJS, TypeScript, Socket.IO

##### 2.1.1.9.9.0 Resources

###### 2.1.1.9.9.1 Cpu

2 vCPU

###### 2.1.1.9.9.2 Memory

4 GiB

##### 2.1.1.9.10.0 Configuration

###### 2.1.1.9.10.1 Max Message History Load

100

##### 2.1.1.9.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.9.12.0 Responsible Features

- REQ-1-026
- REQ-1-027
- REQ-1-028
- REQ-1-029

##### 2.1.1.9.13.0 Observability

###### 2.1.1.9.13.1 Logging

Conversation creation, messages sent, delivery/read status updates.

###### 2.1.1.9.13.2 Metrics

Active WebSocket Connections, Messages Sent/sec, Message Delivery Latency.

##### 2.1.1.9.14.0 Data Owned

- Conversation
- ConversationParticipant
- Message
- MessageStatus

#### 2.1.1.10.0.0 search-service-009

##### 2.1.1.10.1.0 Id

search-service-009

##### 2.1.1.10.2.0 Name

Search Service

##### 2.1.1.10.3.0 Description

A CQRS read-model service providing user search capabilities. It consumes profile update events to maintain a search index in OpenSearch and handles complex search queries.

##### 2.1.1.10.4.0 Type

🔹 Microservice

##### 2.1.1.10.5.0 Dependencies

- OpenSearch Cluster

##### 2.1.1.10.6.0 Properties

*No data available*

##### 2.1.1.10.7.0 Interfaces

- gRPC (Read-only)
- Event Consumer

##### 2.1.1.10.8.0 Technology

Node.js, NestJS, TypeScript

##### 2.1.1.10.9.0 Resources

###### 2.1.1.10.9.1 Cpu

1 vCPU

###### 2.1.1.10.9.2 Memory

2 GiB

##### 2.1.1.10.10.0 Configuration

###### 2.1.1.10.10.1 Index Name

user-profiles

##### 2.1.1.10.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.10.12.0 Responsible Features

- REQ-1-030
- REQ-1-031
- REQ-1-032
- REQ-1-033
- REQ-1-034
- REQ-1-035

##### 2.1.1.10.13.0 Observability

###### 2.1.1.10.13.1 Logging

Indexing operations, search queries performed, zero-result searches.

###### 2.1.1.10.13.2 Metrics

Search Query Latency (P95), Indexing Lag, Search Query Rate.

##### 2.1.1.10.14.0 Data Owned

*No items available*

#### 2.1.1.11.0.0 notifications-service-010

##### 2.1.1.11.1.0 Id

notifications-service-010

##### 2.1.1.11.2.0 Name

Notifications Service

##### 2.1.1.11.3.0 Description

Generates and delivers notifications to users across multiple channels (in-app, email). It consumes events from various services to trigger relevant, timely notifications.

##### 2.1.1.11.4.0 Type

🔹 Microservice

##### 2.1.1.11.5.0 Dependencies

- PostgreSQL Database
- email-service-012

##### 2.1.1.11.6.0 Properties

*No data available*

##### 2.1.1.11.7.0 Interfaces

- gRPC
- WebSocket (Socket.IO)
- Event Consumer

##### 2.1.1.11.8.0 Technology

Node.js, NestJS, TypeScript, Socket.IO

##### 2.1.1.11.9.0 Resources

###### 2.1.1.11.9.1 Cpu

1 vCPU

###### 2.1.1.11.9.2 Memory

2 GiB

##### 2.1.1.11.10.0 Configuration

###### 2.1.1.11.10.1 Batching Window

5m

##### 2.1.1.11.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.11.12.0 Responsible Features

- REQ-1-036
- REQ-1-037
- REQ-1-038
- REQ-1-039

##### 2.1.1.11.13.0 Observability

###### 2.1.1.11.13.1 Logging

Notifications generated, sent (in-app, email), read.

###### 2.1.1.11.13.2 Metrics

Notifications Generated/sec, Delivery Latency, Notification Read Rate.

##### 2.1.1.11.14.0 Data Owned

- Notification
- UserNotificationSetting

#### 2.1.1.12.0.0 admin-service-011

##### 2.1.1.12.1.0 Id

admin-service-011

##### 2.1.1.12.2.0 Name

Admin Service

##### 2.1.1.12.3.0 Description

Provides the backend functionality for the administrative dashboard. Handles content moderation queues, user management actions, and maintains an immutable audit log of all admin activities.

##### 2.1.1.12.4.0 Type

🔹 Microservice

##### 2.1.1.12.5.0 Dependencies

- PostgreSQL Database
- gRPC Clients to other services

##### 2.1.1.12.6.0 Properties

*No data available*

##### 2.1.1.12.7.0 Interfaces

- gRPC

##### 2.1.1.12.8.0 Technology

Node.js, NestJS, TypeScript

##### 2.1.1.12.9.0 Resources

###### 2.1.1.12.9.1 Cpu

0.5 vCPU

###### 2.1.1.12.9.2 Memory

1 GiB

##### 2.1.1.12.10.0 Configuration

*No data available*

##### 2.1.1.12.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.12.12.0 Responsible Features

- REQ-1-023
- REQ-1-041
- REQ-1-042
- REQ-1-043
- REQ-1-044
- REQ-1-045

##### 2.1.1.12.13.0 Observability

###### 2.1.1.12.13.1 Logging

All administrative actions (content removal, user suspension, etc.), content reports received.

###### 2.1.1.12.13.2 Metrics

Content Reports Pending, Avg. Time to Resolve Report, Admin Actions/hour.

##### 2.1.1.12.14.0 Data Owned

- ContentReport
- AdminAuditLog

#### 2.1.1.13.0.0 email-service-012

##### 2.1.1.13.1.0 Id

email-service-012

##### 2.1.1.13.2.0 Name

Email Service

##### 2.1.1.13.3.0 Description

A small, dedicated utility service that handles the sending of all transactional emails by integrating with AWS SES. It consumes events that require an email to be sent.

##### 2.1.1.13.4.0 Type

🔹 Microservice

##### 2.1.1.13.5.0 Dependencies

- AWS SES

##### 2.1.1.13.6.0 Properties

*No data available*

##### 2.1.1.13.7.0 Interfaces

- Event Consumer

##### 2.1.1.13.8.0 Technology

Node.js, NestJS, TypeScript

##### 2.1.1.13.9.0 Resources

###### 2.1.1.13.9.1 Cpu

0.25 vCPU

###### 2.1.1.13.9.2 Memory

0.5 GiB

##### 2.1.1.13.10.0 Configuration

###### 2.1.1.13.10.1 Sender Address

no-reply@platform.com

##### 2.1.1.13.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 60 |
| Timeout | 10 |

##### 2.1.1.13.12.0 Responsible Features

- REQ-1-073

##### 2.1.1.13.13.0 Observability

###### 2.1.1.13.13.1 Logging

Emails sent, delivery successes, bounces, and complaints.

###### 2.1.1.13.13.2 Metrics

Emails Sent/min, AWS SES API Error Rate, Email Bounce Rate.

##### 2.1.1.13.14.0 Data Owned

*No items available*

#### 2.1.1.14.0.0 media-service-013

##### 2.1.1.14.1.0 Id

media-service-013

##### 2.1.1.14.2.0 Name

Media Service

##### 2.1.1.14.3.0 Description

Handles the uploading, validation, and storage of user-provided media files like images. It provides a secure interface between the application and the object storage service (AWS S3).

##### 2.1.1.14.4.0 Type

🔹 Microservice

##### 2.1.1.14.5.0 Dependencies

- AWS S3
- PostgreSQL Database

##### 2.1.1.14.6.0 Properties

*No data available*

##### 2.1.1.14.7.0 Interfaces

- gRPC

##### 2.1.1.14.8.0 Technology

Node.js, NestJS, TypeScript

##### 2.1.1.14.9.0 Resources

###### 2.1.1.14.9.1 Cpu

0.5 vCPU

###### 2.1.1.14.9.2 Memory

1 GiB

##### 2.1.1.14.10.0 Configuration

###### 2.1.1.14.10.1 Max File Size

5MB

###### 2.1.1.14.10.2 Allowed Mime Types

image/jpeg, image/png

##### 2.1.1.14.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.14.12.0 Responsible Features

- REQ-1-012
- REQ-1-019
- REQ-1-072

##### 2.1.1.14.13.0 Observability

###### 2.1.1.14.13.1 Logging

File uploads (success/failure), file deletions.

###### 2.1.1.14.13.2 Metrics

Uploads/sec, Avg. File Size, S3 API Error Rate.

##### 2.1.1.14.14.0 Data Owned

- Media

### 2.1.2.0.0.0 Configuration

| Property | Value |
|----------|-------|
| Environment | production |
| Logging Level | INFO |
| Message Bus Url | nats://message-bus:4222 |
| Cache Ttl | 3600 |
| Max Threads | N/A (Node.js) |

