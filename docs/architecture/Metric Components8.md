# 1 System Overview

## 1.1 Analysis Date

2025-06-13

## 1.2 Technology Stack

- Node.js
- NestJS
- Next.js
- React
- TypeScript
- PostgreSQL
- Redis
- OpenSearch
- Kubernetes (EKS)
- GraphQL
- gRPC

## 1.3 Monitoring Components

- OpenTelemetry
- Prometheus
- Grafana
- Loki
- Jaeger

## 1.4 Requirements

- REQ-1-050
- REQ-1-051
- REQ-1-053
- REQ-1-083
- REQ-1-084
- REQ-1-085
- REQ-1-093

## 1.5 Environment

production

# 2.0 Standard System Metrics Selection

## 2.1 Hardware Utilization Metrics

### 2.1.1 container_cpu_usage_seconds_total

#### 2.1.1.1 Name

container_cpu_usage_seconds_total

#### 2.1.1.2 Type

🔹 counter

#### 2.1.1.3 Unit

seconds

#### 2.1.1.4 Description

Cumulative CPU time consumed by each container.

#### 2.1.1.5 Collection

##### 2.1.1.5.1 Interval

30s

##### 2.1.1.5.2 Method

cAdvisor/kubelet scrape

#### 2.1.1.6.0 Thresholds

##### 2.1.1.6.1 Warning

>80% of limit for 5m

##### 2.1.1.6.2 Critical

>90% of limit for 2m

#### 2.1.1.7.0 Justification

Required by REQ-1-084 for system health monitoring and capacity planning.

### 2.1.2.0.0 container_memory_working_set_bytes

#### 2.1.2.1.0 Name

container_memory_working_set_bytes

#### 2.1.2.2.0 Type

🔹 gauge

#### 2.1.2.3.0 Unit

bytes

#### 2.1.2.4.0 Description

Current memory usage of each container.

#### 2.1.2.5.0 Collection

##### 2.1.2.5.1 Interval

30s

##### 2.1.2.5.2 Method

cAdvisor/kubelet scrape

#### 2.1.2.6.0 Thresholds

##### 2.1.2.6.1 Warning

>85% of limit

##### 2.1.2.6.2 Critical

>95% of limit

#### 2.1.2.7.0 Justification

Required by REQ-1-084 for system health monitoring and preventing OOMKills.

### 2.1.3.0.0 kubelet_volume_stats_used_bytes

#### 2.1.3.1.0 Name

kubelet_volume_stats_used_bytes

#### 2.1.3.2.0 Type

🔹 gauge

#### 2.1.3.3.0 Unit

bytes

#### 2.1.3.4.0 Description

Used space on persistent volumes.

#### 2.1.3.5.0 Collection

##### 2.1.3.5.1 Interval

5m

##### 2.1.3.5.2 Method

kubelet scrape

#### 2.1.3.6.0 Thresholds

##### 2.1.3.6.1 Warning

>80% of capacity

##### 2.1.3.6.2 Critical

>90% of capacity

#### 2.1.3.7.0 Justification

Required by REQ-1-084 (disk space) to prevent data loss or service unavailability.

## 2.2.0.0.0 Runtime Metrics

### 2.2.1.0.0 nodejs_eventloop_lag_seconds

#### 2.2.1.1.0 Name

nodejs_eventloop_lag_seconds

#### 2.2.1.2.0 Type

🔹 gauge

#### 2.2.1.3.0 Unit

seconds

#### 2.2.1.4.0 Description

Measures the latency of the Node.js event loop, indicating if it's blocked by long-running synchronous code.

#### 2.2.1.5.0 Technology

Node.js

#### 2.2.1.6.0 Collection

##### 2.2.1.6.1 Interval

15s

##### 2.2.1.6.2 Method

OpenTelemetry Instrumentation

#### 2.2.1.7.0 Criticality

high

### 2.2.2.0.0 nodejs_heap_space_size_used_bytes

#### 2.2.2.1.0 Name

nodejs_heap_space_size_used_bytes

#### 2.2.2.2.0 Type

🔹 gauge

#### 2.2.2.3.0 Unit

bytes

#### 2.2.2.4.0 Description

Tracks heap memory usage to identify potential memory leaks in backend services.

#### 2.2.2.5.0 Technology

Node.js

#### 2.2.2.6.0 Collection

##### 2.2.2.6.1 Interval

30s

##### 2.2.2.6.2 Method

OpenTelemetry Instrumentation

#### 2.2.2.7.0 Criticality

medium

## 2.3.0.0.0 Request Response Metrics

### 2.3.1.0.0 http_server_duration_seconds

#### 2.3.1.1.0 Name

http_server_duration_seconds

#### 2.3.1.2.0 Type

🔹 histogram

#### 2.3.1.3.0 Unit

seconds

#### 2.3.1.4.0 Description

Latency of inbound HTTP requests to the API Gateway.

#### 2.3.1.5.0 Dimensions

- http_method
- http_route
- http_status_code

#### 2.3.1.6.0 Percentiles

- p95
- p99

#### 2.3.1.7.0 Collection

##### 2.3.1.7.1 Interval

15s

##### 2.3.1.7.2 Method

OpenTelemetry Instrumentation

### 2.3.2.0.0 rpc_server_duration_seconds

#### 2.3.2.1.0 Name

rpc_server_duration_seconds

#### 2.3.2.2.0 Type

🔹 histogram

#### 2.3.2.3.0 Unit

seconds

#### 2.3.2.4.0 Description

Latency of internal gRPC requests between microservices.

#### 2.3.2.5.0 Dimensions

- rpc_service
- rpc_method
- rpc_grpc_status_code

#### 2.3.2.6.0 Percentiles

- p95
- p99

#### 2.3.2.7.0 Collection

##### 2.3.2.7.1 Interval

15s

##### 2.3.2.7.2 Method

OpenTelemetry Instrumentation

## 2.4.0.0.0 Availability Metrics

- {'name': 'service_uptime_percentage', 'type': 'gauge', 'unit': 'percentage', 'description': 'Represents the availability of a service based on the success rate of its health checks or API endpoints.', 'calculation': '(1 - (count of 5xx responses / total responses)) * 100', 'slaTarget': '99.9%'}

## 2.5.0.0.0 Scalability Metrics

- {'name': 'kube_deployment_spec_replicas', 'type': 'gauge', 'unit': 'count', 'description': 'Tracks the number of running pods for each microservice deployment to monitor autoscaling events.', 'capacityThreshold': 'N/A', 'autoScalingTrigger': True}

# 3.0.0.0.0 Application Specific Metrics Design

## 3.1.0.0.0 Transaction Metrics

### 3.1.1.0.0 app_user_registrations_total

#### 3.1.1.1.0 Name

app_user_registrations_total

#### 3.1.1.2.0 Type

🔹 counter

#### 3.1.1.3.0 Unit

count

#### 3.1.1.4.0 Description

Total number of successful user registrations.

#### 3.1.1.5.0 Business Context

User Growth

#### 3.1.1.6.0 Dimensions

- status

#### 3.1.1.7.0 Collection

##### 3.1.1.7.1 Interval

N/A (on event)

##### 3.1.1.7.2 Method

OpenTelemetry Custom Metric

#### 3.1.1.8.0 Aggregation

##### 3.1.1.8.1 Functions

- rate

##### 3.1.1.8.2 Window

5m

### 3.1.2.0.0 app_posts_created_total

#### 3.1.2.1.0 Name

app_posts_created_total

#### 3.1.2.2.0 Type

🔹 counter

#### 3.1.2.3.0 Unit

count

#### 3.1.2.4.0 Description

Total number of new posts created by users.

#### 3.1.2.5.0 Business Context

Content Engagement

#### 3.1.2.6.0 Dimensions

*No items available*

#### 3.1.2.7.0 Collection

##### 3.1.2.7.1 Interval

N/A (on event)

##### 3.1.2.7.2 Method

OpenTelemetry Custom Metric

#### 3.1.2.8.0 Aggregation

##### 3.1.2.8.1 Functions

- rate

##### 3.1.2.8.2 Window

5m

## 3.2.0.0.0 Cache Performance Metrics

- {'name': 'app_cache_operations_total', 'type': 'counter', 'unit': 'count', 'description': 'Tracks cache hits and misses for Redis.', 'cacheType': 'Redis', 'hitRatioTarget': '>90%'}

## 3.3.0.0.0 External Dependency Metrics

### 3.3.1.0.0 aws_ses_send_duration_seconds

#### 3.3.1.1.0 Name

aws_ses_send_duration_seconds

#### 3.3.1.2.0 Type

🔹 histogram

#### 3.3.1.3.0 Unit

seconds

#### 3.3.1.4.0 Description

Latency for sending transactional emails via AWS SES.

#### 3.3.1.5.0 Dependency

AWS SES

#### 3.3.1.6.0 Circuit Breaker Integration

❌ No

#### 3.3.1.7.0 Sla

##### 3.3.1.7.1 Response Time

p95 < 1s

##### 3.3.1.7.2 Availability

99.9%

### 3.3.2.0.0 circuitbreaker_state

#### 3.3.2.1.0 Name

circuitbreaker_state

#### 3.3.2.2.0 Type

🔹 gauge

#### 3.3.2.3.0 Unit

state (0=closed, 1=open, 2=half-open)

#### 3.3.2.4.0 Description

Tracks the current state of circuit breakers for inter-service gRPC calls.

#### 3.3.2.5.0 Dependency

Internal Microservices

#### 3.3.2.6.0 Circuit Breaker Integration

✅ Yes

#### 3.3.2.7.0 Sla

##### 3.3.2.7.1 Response Time

N/A

##### 3.3.2.7.2 Availability

N/A

## 3.4.0.0.0 Error Metrics

- {'name': 'app_api_errors_total', 'type': 'counter', 'unit': 'count', 'description': 'Total count of server-side errors (5xx) at the API Gateway and service level.', 'errorTypes': ['500', '502', '503', '504'], 'dimensions': ['service', 'http_route'], 'alertThreshold': 'rate > 1% over 5m'}

## 3.5.0.0.0 Throughput And Latency Metrics

- {'name': 'app_async_event_processing_duration_seconds', 'type': 'histogram', 'unit': 'seconds', 'description': 'Time taken to process an asynchronous event, from consumption to completion (e.g., feed fan-out).', 'percentiles': ['p95', 'p99'], 'buckets': ['0.1', '0.5', '1', '2.5', '5', '10'], 'slaTargets': {'p95': '< 2s', 'p99': '< 5s'}}

# 4.0.0.0.0 Business Kpi Identification

## 4.1.0.0.0 Critical Business Metrics

### 4.1.1.0.0 business_user_signups_total

#### 4.1.1.1.0 Name

business_user_signups_total

#### 4.1.1.2.0 Type

🔹 counter

#### 4.1.1.3.0 Unit

users

#### 4.1.1.4.0 Description

Total number of new users who have completed registration.

#### 4.1.1.5.0 Business Owner

Product Team

#### 4.1.1.6.0 Calculation

sum(app_user_registrations_total)

#### 4.1.1.7.0 Reporting Frequency

real-time

#### 4.1.1.8.0 Target

N/A

### 4.1.2.0.0 business_daily_active_users

#### 4.1.2.1.0 Name

business_daily_active_users

#### 4.1.2.2.0 Type

🔹 gauge

#### 4.1.2.3.0 Unit

users

#### 4.1.2.4.0 Description

Count of unique users who have logged in within a 24-hour period.

#### 4.1.2.5.0 Business Owner

Product Team

#### 4.1.2.6.0 Calculation

unique count of userId from login events over 24h

#### 4.1.2.7.0 Reporting Frequency

daily

#### 4.1.2.8.0 Target

N/A

## 4.2.0.0.0 User Engagement Metrics

- {'name': 'business_posts_created_total', 'type': 'counter', 'unit': 'posts', 'description': 'Cumulative count of all posts created on the platform.', 'segmentation': ['none'], 'cohortAnalysis': False}

## 4.3.0.0.0 Conversion Metrics

*No items available*

## 4.4.0.0.0 Operational Efficiency Kpis

- {'name': 'ops_avg_time_to_resolve_report', 'type': 'gauge', 'unit': 'hours', 'description': 'Average time taken by administrators to action a user-submitted content report.', 'calculation': 'avg(report.resolved_at - report.created_at)', 'benchmarkTarget': '< 24 hours'}

## 4.5.0.0.0 Revenue And Cost Metrics

*No items available*

## 4.6.0.0.0 Customer Satisfaction Indicators

*No items available*

# 5.0.0.0.0 Collection Interval Optimization

## 5.1.0.0.0 Sampling Frequencies

### 5.1.1.0.0 Metric Category

#### 5.1.1.1.0 Metric Category

System Hardware

#### 5.1.1.2.0 Interval

30s

#### 5.1.1.3.0 Justification

Provides good visibility into resource trends without excessive overhead.

#### 5.1.1.4.0 Resource Impact

low

### 5.1.2.0.0 Metric Category

#### 5.1.2.1.0 Metric Category

API Latency/Errors

#### 5.1.2.2.0 Interval

15s

#### 5.1.2.3.0 Justification

Faster detection of performance degradation and error spikes is required for core API NFRs.

#### 5.1.2.4.0 Resource Impact

medium

## 5.2.0.0.0 High Frequency Metrics

- {'name': 'http_server_duration_seconds', 'interval': '15s', 'criticality': 'high', 'costJustification': 'Essential for meeting the P95 < 200ms latency requirement in REQ-1-051.'}

## 5.3.0.0.0 Cardinality Considerations

- {'metricName': 'http_server_duration_seconds', 'estimatedCardinality': 'medium', 'dimensionStrategy': 'Use templated routes (e.g., /users/:id) instead of raw URLs to limit cardinality.', 'mitigationApproach': 'Avoid high-cardinality labels like userId or requestId.'}

## 5.4.0.0.0 Aggregation Periods

- {'metricType': 'counters', 'periods': ['1m', '5m', '1h'], 'retentionStrategy': 'Prometheus recording rules will pre-aggregate rates for long-term storage.'}

## 5.5.0.0.0 Collection Methods

- {'method': 'real-time', 'applicableMetrics': ['http_server_duration_seconds', 'rpc_server_duration_seconds'], 'implementation': 'Prometheus scraping OpenTelemetry endpoints.', 'performance': 'high'}

# 6.0.0.0.0 Aggregation Method Selection

## 6.1.0.0.0 Statistical Aggregations

- {'metricName': 'app_api_errors_total', 'aggregationFunctions': ['rate', 'sum'], 'windows': ['5m'], 'justification': 'Calculating the error rate over a 5-minute window is standard practice for alerting.'}

## 6.2.0.0.0 Histogram Requirements

- {'metricName': 'http_server_duration_seconds', 'buckets': ['0.005', '0.01', '0.025', '0.05', '0.1', '0.2', '0.5', '1', '2.5'], 'percentiles': ['p95', 'p99'], 'accuracy': 'high'}

## 6.3.0.0.0 Percentile Calculations

- {'metricName': 'http_server_duration_seconds', 'percentiles': ['95'], 'algorithm': 'quantile', 'accuracy': 'high'}

## 6.4.0.0.0 Metric Types

- {'name': 'app_user_registrations_total', 'implementation': 'counter', 'reasoning': 'This is a monotonically increasing value representing a cumulative count.', 'resetsHandling': 'Prometheus `rate()` and `increase()` functions inherently handle counter resets.'}

## 6.5.0.0.0 Dimensional Aggregation

- {'metricName': 'http_server_duration_seconds', 'dimensions': ['service', 'http_status_code'], 'aggregationStrategy': 'sum by (service) (rate(http_server_requests_total[5m]))', 'cardinalityImpact': 'medium'}

## 6.6.0.0.0 Derived Metrics

- {'name': 'cache_hit_ratio', 'calculation': 'sum(rate(app_cache_operations_total{result="hit"}[5m])) / sum(rate(app_cache_operations_total[5m]))', 'sourceMetrics': ['app_cache_operations_total'], 'updateFrequency': 'on scrape (e.g., 30s)'}

# 7.0.0.0.0 Storage Requirements Planning

## 7.1.0.0.0 Retention Periods

### 7.1.1.0.0 Metric Type

#### 7.1.1.1.0 Metric Type

High-resolution metrics (e.g., request latency)

#### 7.1.1.2.0 Retention Period

30 days

#### 7.1.1.3.0 Justification

Sufficient for short-term debugging, performance analysis, and incident response.

#### 7.1.1.4.0 Compliance Requirement

N/A

### 7.1.2.0.0 Metric Type

#### 7.1.2.1.0 Metric Type

Aggregated metrics (e.g., daily signups)

#### 7.1.2.2.0 Retention Period

1 year

#### 7.1.2.3.0 Justification

Required for long-term business and capacity planning.

#### 7.1.2.4.0 Compliance Requirement

N/A

## 7.2.0.0.0 Data Resolution

### 7.2.1.0.0 Time Range

#### 7.2.1.1.0 Time Range

0-30 days

#### 7.2.1.2.0 Resolution

15-30s

#### 7.2.1.3.0 Query Performance

high

#### 7.2.1.4.0 Storage Optimization

none

### 7.2.2.0.0 Time Range

#### 7.2.2.1.0 Time Range

30 days - 1 year

#### 7.2.2.2.0 Resolution

1h

#### 7.2.2.3.0 Query Performance

medium

#### 7.2.2.4.0 Storage Optimization

downsampling

## 7.3.0.0.0 Downsampling Strategies

- {'sourceResolution': '30s', 'targetResolution': '1h', 'aggregationMethod': 'avg for gauges, sum of rates for counters', 'triggerCondition': 'Prometheus recording rules run periodically.'}

## 7.4.0.0.0 Storage Performance

| Property | Value |
|----------|-------|
| Write Latency | < 50ms |
| Query Latency | p95 < 1s for typical dashboard queries |
| Throughput Requirements | Support 1M active time series |
| Scalability Needs | Horizontal scaling via Prometheus federation or Th... |

## 7.5.0.0.0 Query Optimization

- {'queryPattern': 'Aggregating request rates over long time periods', 'optimizationStrategy': 'Use pre-calculated aggregates from recording rules instead of querying raw data.', 'indexingRequirements': ['Prometheus TSDB is optimized for time-series queries.']}

## 7.6.0.0.0 Cost Optimization

- {'strategy': 'Aggressive Downsampling and Retention', 'implementation': 'Use recording rules to create lower-resolution aggregates and set shorter retention for raw, high-cardinality data.', 'expectedSavings': '30-50% on storage costs', 'tradeoffs': 'Loss of query granularity on older data.'}

# 8.0.0.0.0 Project Specific Metrics Config

## 8.1.0.0.0 Standard Metrics

*No items available*

## 8.2.0.0.0 Custom Metrics

*No items available*

## 8.3.0.0.0 Dashboard Metrics

*No items available*

# 9.0.0.0.0 Implementation Priority

## 9.1.0.0.0 Component

### 9.1.1.0.0 Component

API Gateway & Core Service Metrics (Latency, Errors, Throughput)

### 9.1.2.0.0 Priority

🔴 high

### 9.1.3.0.0 Dependencies

- OpenTelemetry Instrumentation

### 9.1.4.0.0 Estimated Effort

Medium

### 9.1.5.0.0 Risk Level

low

## 9.2.0.0.0 Component

### 9.2.1.0.0 Component

Business KPI Metrics (Signups, Posts Created)

### 9.2.2.0.0 Priority

🔴 high

### 9.2.3.0.0 Dependencies

- Application Code Instrumentation

### 9.2.4.0.0 Estimated Effort

Medium

### 9.2.5.0.0 Risk Level

low

## 9.3.0.0.0 Component

### 9.3.1.0.0 Component

Async Workflow Metrics (Queue Depth, Processing Latency)

### 9.3.2.0.0 Priority

🟡 medium

### 9.3.3.0.0 Dependencies

- OpenTelemetry Instrumentation
- AWS CloudWatch Exporter

### 9.3.4.0.0 Estimated Effort

Medium

### 9.3.5.0.0 Risk Level

medium

# 10.0.0.0.0 Risk Assessment

- {'risk': 'High Cardinality Metrics', 'impact': 'high', 'probability': 'medium', 'mitigation': 'Strictly enforce a policy of not using unbounded dimension values (e.g., user IDs, session IDs) in metric labels. Use templated routes for HTTP metrics.', 'contingencyPlan': 'Configure aggregation rules in Prometheus to drop high-cardinality labels if performance issues arise.'}

# 11.0.0.0.0 Recommendations

- {'category': 'Instrumentation', 'recommendation': 'Create a shared, versioned observability library for all Node.js services.', 'justification': 'Ensures consistent metric names, labels, and OpenTelemetry configuration across the entire backend, reducing configuration drift and simplifying maintenance.', 'priority': 'high', 'implementationNotes': 'This library should encapsulate the OpenTelemetry SDK setup and provide simple decorators or helpers for instrumenting custom application metrics.'}

