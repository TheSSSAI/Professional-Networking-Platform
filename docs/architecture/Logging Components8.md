# 1 System Overview

## 1.1 Analysis Date

2025-06-13

## 1.2 Technology Stack

- Node.js
- NestJS
- TypeScript
- Kubernetes (AWS EKS)
- PostgreSQL
- OpenTelemetry
- Loki
- Prometheus
- Jaeger

## 1.3 Monitoring Requirements

- REQ-1-083: Implement a comprehensive observability stack (Prometheus, Grafana, Loki, Jaeger) using OpenTelemetry.
- REQ-1-044: Log all administrator actions in an immutable audit trail.
- REQ-1-059: Maintain an audit trail of security-sensitive user actions.
- REQ-1-093: Retain system audit logs for a minimum of 12 months.

## 1.4 System Architecture

Microservices

## 1.5 Environment

production

# 2.0 Log Level And Category Strategy

## 2.1 Default Log Level

INFO

## 2.2 Environment Specific Levels

### 2.2.1 Environment

#### 2.2.1.1 Environment

development

#### 2.2.1.2 Log Level

DEBUG

#### 2.2.1.3 Justification

Provides detailed diagnostic information for developers during feature development and troubleshooting.

### 2.2.2.0 Environment

#### 2.2.2.1 Environment

staging

#### 2.2.2.2 Log Level

DEBUG

#### 2.2.2.3 Justification

Enables thorough debugging and validation during pre-production testing cycles.

## 2.3.0.0 Component Categories

### 2.3.1.0 Component

#### 2.3.1.1 Component

All Microservices

#### 2.3.1.2 Category

🔹 application

#### 2.3.1.3 Log Level

INFO

#### 2.3.1.4 Verbose Logging

❌ No

#### 2.3.1.5 Justification

General application lifecycle and business logic events.

### 2.3.2.0 Component

#### 2.3.2.1 Component

All Microservices

#### 2.3.2.2 Category

🔹 grpc

#### 2.3.2.3 Log Level

INFO

#### 2.3.2.4 Verbose Logging

❌ No

#### 2.3.2.5 Justification

Logs incoming and outgoing gRPC requests and their outcomes.

### 2.3.3.0 Component

#### 2.3.3.1 Component

Identity & Access Service

#### 2.3.3.2 Category

🔹 security

#### 2.3.3.3 Log Level

INFO

#### 2.3.3.4 Verbose Logging

❌ No

#### 2.3.3.5 Justification

Required for REQ-1-059. Logs security-sensitive events like successful logins and password changes. Failed attempts are logged at WARN level.

### 2.3.4.0 Component

#### 2.3.4.1 Component

Admin Service

#### 2.3.4.2 Category

🔹 audit

#### 2.3.4.3 Log Level

INFO

#### 2.3.4.4 Verbose Logging

❌ No

#### 2.3.4.5 Justification

Required for REQ-1-044. Logs all administrative actions for accountability.

## 2.4.0.0 Sampling Strategies

- {'component': 'API Gateway', 'samplingRate': '100%', 'condition': 'HTTP status code >= 400', 'reason': 'Ensure all client-facing errors are logged for debugging and alerting, while successful requests can be sampled if volume becomes an issue.'}

## 2.5.0.0 Logging Approach

### 2.5.1.0 Structured

✅ Yes

### 2.5.2.0 Format

JSON

### 2.5.3.0 Standard Fields

- timestamp
- level
- message
- service.name
- traceId
- spanId
- k8s.pod.name
- k8s.namespace.name

### 2.5.4.0 Custom Fields

- userId
- correlationId
- error.stack_trace

# 3.0.0.0 Log Aggregation Architecture

## 3.1.0.0 Collection Mechanism

### 3.1.1.0 Type

🔹 agent

### 3.1.2.0 Technology

OpenTelemetry Collector

### 3.1.3.0 Configuration

#### 3.1.3.1 Deployment Mode

DaemonSet

#### 3.1.3.2 Receivers

- otlp

#### 3.1.3.3 Processors

- batch
- memory_limiter
- attributes

#### 3.1.3.4 Exporters

- loki

### 3.1.4.0 Justification

As per REQ-1-083, OpenTelemetry is the standard. A DaemonSet deployment is efficient for collecting logs from all service pods on a Kubernetes node.

## 3.2.0.0 Strategy

| Property | Value |
|----------|-------|
| Approach | centralized |
| Reasoning | Explicitly required by REQ-1-083 for centralized l... |
| Local Retention | None. Logs are immediately forwarded by the collec... |

## 3.3.0.0 Shipping Methods

- {'protocol': 'HTTP', 'destination': 'Loki Distributor', 'reliability': 'at-least-once', 'compression': True}

## 3.4.0.0 Buffering And Batching

| Property | Value |
|----------|-------|
| Buffer Size | 512kB |
| Batch Size | 1000 |
| Flush Interval | 1s |
| Backpressure Handling | Handled by the OpenTelemetry Collector's memory li... |

## 3.5.0.0 Transformation And Enrichment

- {'transformation': 'Add Kubernetes Metadata', 'purpose': 'Enrich logs with pod name, namespace, and node name for precise troubleshooting.', 'stage': 'collection'}

## 3.6.0.0 High Availability

| Property | Value |
|----------|-------|
| Required | ✅ |
| Redundancy | Loki deployed in a multi-replica configuration. |
| Failover Strategy | The OpenTelemetry Collector will buffer and retry ... |

# 4.0.0.0 Retention Policy Design

## 4.1.0.0 Retention Periods

### 4.1.1.0 Log Type

#### 4.1.1.1 Log Type

Application Logs (INFO, DEBUG, WARN)

#### 4.1.1.2 Retention Period

30 days

#### 4.1.1.3 Justification

Provides a sufficient window for operational troubleshooting while managing storage costs.

#### 4.1.1.4 Compliance Requirement

None

### 4.1.2.0 Log Type

#### 4.1.2.1 Log Type

Security Audit Logs (UserSecurityAuditLog)

#### 4.1.2.2 Retention Period

12 months

#### 4.1.2.3 Justification

Directly satisfies the minimum retention period defined in REQ-1-093.

#### 4.1.2.4 Compliance Requirement

REQ-1-093

### 4.1.3.0 Log Type

#### 4.1.3.1 Log Type

Admin Audit Logs (AdminAuditLog)

#### 4.1.3.2 Retention Period

12 months

#### 4.1.3.3 Justification

Directly satisfies the minimum retention period defined in REQ-1-093.

#### 4.1.3.4 Compliance Requirement

REQ-1-093

## 4.2.0.0 Compliance Requirements

- {'regulation': 'GDPR/CCPA', 'applicableLogTypes': ['Application Logs'], 'minimumRetention': 'N/A', 'specialHandling': 'PII must be masked or excluded from logs. See Sensitive Data Handling section.'}

## 4.3.0.0 Volume Impact Analysis

| Property | Value |
|----------|-------|
| Estimated Daily Volume | 100-200 GB |
| Storage Cost Projection | Based on Loki's use of AWS S3 for storage, costs a... |
| Compression Ratio | 10:1 (estimated) |

## 4.4.0.0 Storage Tiering

### 4.4.1.0 Hot Storage

| Property | Value |
|----------|-------|
| Duration | 30 days |
| Accessibility | immediate |
| Cost | medium |

### 4.4.2.0 Warm Storage

| Property | Value |
|----------|-------|
| Duration | N/A |
| Accessibility | N/A |
| Cost | N/A |

### 4.4.3.0 Cold Storage

| Property | Value |
|----------|-------|
| Duration | 30 days to 12 months (for audit logs) |
| Accessibility | hours |
| Cost | low |

## 4.5.0.0 Compression Strategy

| Property | Value |
|----------|-------|
| Algorithm | snappy |
| Compression Level | default |
| Expected Ratio | 10:1 |

## 4.6.0.0 Anonymization Requirements

- {'dataType': 'PII (email, fullName, ipAddress)', 'method': 'masking', 'timeline': 'at-source', 'compliance': 'GDPR/CCPA'}

# 5.0.0.0 Search Capability Requirements

## 5.1.0.0 Essential Capabilities

### 5.1.1.0 Capability

#### 5.1.1.1 Capability

Search logs by indexed labels (service, level, pod)

#### 5.1.1.2 Performance Requirement

P95 < 2s

#### 5.1.1.3 Justification

Core functionality of Loki for filtering logs to a specific context for troubleshooting.

### 5.1.2.0 Capability

#### 5.1.2.1 Capability

Filter logs by Trace ID

#### 5.1.2.2 Performance Requirement

P95 < 3s

#### 5.1.2.3 Justification

Essential for correlating logs with a specific distributed trace in Jaeger, as per REQ-1-083.

## 5.2.0.0 Performance Characteristics

| Property | Value |
|----------|-------|
| Search Latency | P95 < 3 seconds |
| Concurrent Users | 20 |
| Query Complexity | simple |
| Indexing Strategy | Loki indexes only metadata (labels), not the full ... |

## 5.3.0.0 Indexed Fields

### 5.3.1.0 Field

#### 5.3.1.1 Field

service.name

#### 5.3.1.2 Index Type

Loki Label

#### 5.3.1.3 Search Pattern

Filtering by service

#### 5.3.1.4 Frequency

high

### 5.3.2.0 Field

#### 5.3.2.1 Field

level

#### 5.3.2.2 Index Type

Loki Label

#### 5.3.2.3 Search Pattern

Filtering by severity

#### 5.3.2.4 Frequency

high

### 5.3.3.0 Field

#### 5.3.3.1 Field

k8s.pod.name

#### 5.3.3.2 Index Type

Loki Label

#### 5.3.3.3 Search Pattern

Isolating logs from a specific pod instance

#### 5.3.3.4 Frequency

medium

## 5.4.0.0 Full Text Search

### 5.4.1.0 Required

❌ No

### 5.4.2.0 Fields

*No items available*

### 5.4.3.0 Search Engine

N/A

### 5.4.4.0 Relevance Scoring

❌ No

## 5.5.0.0 Correlation And Tracing

### 5.5.1.0 Correlation Ids

- traceId
- spanId

### 5.5.2.0 Trace Id Propagation

Handled by OpenTelemetry instrumentation across all services.

### 5.5.3.0 Span Correlation

✅ Yes

### 5.5.4.0 Cross Service Tracing

✅ Yes

## 5.6.0.0 Dashboard Requirements

- {'dashboard': 'Service Health Dashboard', 'purpose': 'Display key metrics (error rates, latency) alongside a stream of ERROR-level logs for that service.', 'refreshInterval': '30s', 'audience': 'On-Call Engineers'}

# 6.0.0.0 Storage Solution Selection

## 6.1.0.0 Selected Technology

### 6.1.1.0 Primary

Loki

### 6.1.2.0 Reasoning

Explicitly mandated by the architecture in REQ-1-083. It is cost-effective and integrates natively with the specified stack (Prometheus, Grafana).

### 6.1.3.0 Alternatives

- OpenSearch (for logging)

## 6.2.0.0 Scalability Requirements

| Property | Value |
|----------|-------|
| Expected Growth Rate | 20% MoM |
| Peak Load Handling | Loki is designed to be horizontally scalable to ha... |
| Horizontal Scaling | ✅ |

## 6.3.0.0 Cost Performance Analysis

- {'solution': 'Loki with S3 backend', 'costPerGB': 'Low (based on S3 pricing)', 'queryPerformance': 'Fast for label-based queries, slower for full-text search.', 'operationalComplexity': 'medium'}

## 6.4.0.0 Backup And Recovery

| Property | Value |
|----------|-------|
| Backup Frequency | Handled by AWS S3's native durability and versioni... |
| Recovery Time Objective | 4 hours |
| Recovery Point Objective | 1 hour |
| Testing Frequency | annually |

## 6.5.0.0 Geo Distribution

### 6.5.1.0 Required

❌ No

### 6.5.2.0 Regions

*No items available*

### 6.5.3.0 Replication Strategy

N/A

## 6.6.0.0 Data Sovereignty

*No items available*

# 7.0.0.0 Access Control And Compliance

## 7.1.0.0 Access Control Requirements

### 7.1.1.0 Role

#### 7.1.1.1 Role

Developer

#### 7.1.1.2 Permissions

- read

#### 7.1.1.3 Log Types

- Application Logs

#### 7.1.1.4 Justification

Allow developers to view logs for services they own in non-production environments.

### 7.1.2.0 Role

#### 7.1.2.1 Role

Operator/SRE

#### 7.1.2.2 Permissions

- read
- query

#### 7.1.2.3 Log Types

- All

#### 7.1.2.4 Justification

Allow on-call personnel to access all logs in production for incident response.

## 7.2.0.0 Sensitive Data Handling

- {'dataType': 'PII', 'handlingStrategy': 'mask', 'fields': ['email', 'fullName', 'password'], 'complianceRequirement': 'GDPR/CCPA'}

## 7.3.0.0 Encryption Requirements

### 7.3.1.0 In Transit

| Property | Value |
|----------|-------|
| Required | ✅ |
| Protocol | TLS 1.3 |
| Certificate Management | Automated (e.g., via Kubernetes cert-manager) |

### 7.3.2.0 At Rest

| Property | Value |
|----------|-------|
| Required | ✅ |
| Algorithm | AES-256 |
| Key Management | AWS KMS |

## 7.4.0.0 Audit Trail

| Property | Value |
|----------|-------|
| Log Access | ✅ |
| Retention Period | 90 days |
| Audit Log Location | Grafana Audit Logs / CloudTrail |
| Compliance Reporting | ❌ |

## 7.5.0.0 Regulatory Compliance

- {'regulation': 'GDPR', 'applicableComponents': ['All Services'], 'specificRequirements': ['PII must not be logged in plain text.'], 'evidenceCollection': 'Code review and automated SAST scans to detect logging of sensitive data.'}

## 7.6.0.0 Data Protection Measures

- {'measure': 'PII Masking', 'implementation': 'A shared logging utility/middleware will be used in all services to automatically mask known PII patterns before logs are written.', 'monitoringRequired': True}

# 8.0.0.0 Project Specific Logging Config

## 8.1.0.0 Logging Config

### 8.1.1.0 Level

🔹 INFO

### 8.1.2.0 Retention

30 days (app), 12 months (audit)

### 8.1.3.0 Aggregation

Centralized via OTEL Collector to Loki

### 8.1.4.0 Storage

Loki with S3 backend

### 8.1.5.0 Configuration

*No data available*

## 8.2.0.0 Component Configurations

- {'component': 'All NestJS Microservices', 'logLevel': 'INFO', 'outputFormat': 'JSON', 'destinations': ['stdout (to be collected by OTEL)'], 'sampling': {'enabled': False, 'rate': '1.0'}, 'customFields': ['traceId', 'spanId', 'userId']}

## 8.3.0.0 Metrics

### 8.3.1.0 Custom Metrics

*No data available*

## 8.4.0.0 Alert Rules

- {'name': 'HighApiErrorRate', 'condition': 'sum(rate(http_server_requests_seconds_count{status_code=~"5.."}[5m])) > 0.01', 'severity': 'Critical', 'actions': [{'type': 'pagerduty', 'target': 'on-call-service-key', 'configuration': {}}], 'suppressionRules': [], 'escalationPath': []}

# 9.0.0.0 Implementation Priority

## 9.1.0.0 Component

### 9.1.1.0 Component

OpenTelemetry Instrumentation in Services

### 9.1.2.0 Priority

🔴 high

### 9.1.3.0 Dependencies

*No items available*

### 9.1.4.0 Estimated Effort

Medium

### 9.1.5.0 Risk Level

low

## 9.2.0.0 Component

### 9.2.1.0 Component

Loki & OTEL Collector Deployment

### 9.2.2.0 Priority

🔴 high

### 9.2.3.0 Dependencies

*No items available*

### 9.2.4.0 Estimated Effort

Medium

### 9.2.5.0 Risk Level

medium

## 9.3.0.0 Component

### 9.3.1.0 Component

PII Masking Middleware

### 9.3.2.0 Priority

🔴 high

### 9.3.3.0 Dependencies

- OpenTelemetry Instrumentation in Services

### 9.3.4.0 Estimated Effort

Small

### 9.3.5.0 Risk Level

low

# 10.0.0.0 Risk Assessment

## 10.1.0.0 Risk

### 10.1.1.0 Risk

Excessive Log Volume

### 10.1.2.0 Impact

medium

### 10.1.3.0 Probability

medium

### 10.1.4.0 Mitigation

Implement log level controls via configuration. Introduce sampling for high-volume, low-severity logs if necessary. Set alerts on ingestion rates.

### 10.1.5.0 Contingency Plan

Temporarily increase log level to WARN or ERROR for noisy services.

## 10.2.0.0 Risk

### 10.2.1.0 Risk

PII Leak in Logs

### 10.2.2.0 Impact

high

### 10.2.3.0 Probability

low

### 10.2.4.0 Mitigation

Implement a shared, mandatory logging library with built-in PII masking. Use SAST tools in the CI/CD pipeline to scan for direct logging of sensitive variables.

### 10.2.5.0 Contingency Plan

Incident response plan to identify and purge leaked data from log storage.

# 11.0.0.0 Recommendations

- {'category': 'Implementation', 'recommendation': 'A standardized logging library should be created and shared across all NestJS microservices to enforce structured logging, PII masking, and inclusion of standard fields like traceId.', 'justification': 'Ensures consistency, reduces boilerplate code in each service, and centralizes the implementation of critical security requirements like PII handling.', 'priority': 'high', 'implementationNotes': 'This library should wrap a standard logger (e.g., Pino) and be configured by the OpenTelemetry SDK.'}

