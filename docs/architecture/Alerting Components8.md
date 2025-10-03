# 1 System Overview

## 1.1 Analysis Date

2025-06-13

## 1.2 Technology Stack

- AWS EKS (Kubernetes)
- AWS RDS (PostgreSQL)
- AWS ElastiCache (Redis)
- AWS OpenSearch
- AWS API Gateway
- Node.js (NestJS)
- Next.js

## 1.3 Metrics Configuration

- OpenTelemetry for unified instrumentation (REQ-1-083).
- Prometheus for metrics collection (REQ-1-083).
- Key system health indicators: CPU/memory utilization, API error rates, P95 latency (REQ-1-084).
- Key business metrics: user sign-ups, active users, posts created (REQ-1-084).

## 1.4 Monitoring Needs

- Ensure 99.9% platform availability (REQ-1-085).
- Maintain core API P95 latency below 200ms (REQ-1-051).
- Monitor health of all managed AWS services (RDS, ElastiCache, EKS, OpenSearch).
- Ensure reliability of asynchronous event-driven workflows (e.g., news feed fan-out).
- Detect security anomalies such as high rates of failed login attempts (REQ-1-059).

## 1.5 Environment

production

# 2.0 Alert Condition And Threshold Design

## 2.1 Critical Metrics Alerts

### 2.1.1 Metric

#### 2.1.1.1 Metric

api_gateway_5xx_error_rate

#### 2.1.1.2 Condition

The percentage of 5xx server-side errors at the API Gateway exceeds 2% over a 5-minute period.

#### 2.1.1.3 Threshold Type

static

#### 2.1.1.4 Value

> 0.02

#### 2.1.1.5 Justification

Directly impacts user experience for all features. A sustained error rate indicates a major backend failure. REQ-1-084 requires monitoring API error rates.

#### 2.1.1.6 Business Impact

High. Prevents users from accessing core platform functionality.

### 2.1.2.0 Metric

#### 2.1.2.1 Metric

api_p95_latency_ms

#### 2.1.2.2 Condition

The 95th percentile latency for core API endpoints exceeds 200ms for 5 minutes.

#### 2.1.2.3 Threshold Type

static

#### 2.1.2.4 Value

> 200

#### 2.1.2.5 Justification

Violates the core performance NFR defined in REQ-1-051. Indicates systemic slowdown and poor user experience.

#### 2.1.2.6 Business Impact

Medium. Platform is usable but feels slow, leading to user frustration.

### 2.1.3.0 Metric

#### 2.1.3.1 Metric

rds_cpu_utilization_percent

#### 2.1.3.2 Condition

The CPU utilization of the primary PostgreSQL RDS instance is above 85% for 15 minutes.

#### 2.1.3.3 Threshold Type

static

#### 2.1.3.4 Value

> 85

#### 2.1.3.5 Justification

Sustained high CPU on the primary database is a precursor to query timeouts, performance degradation, and potential outages across all services.

#### 2.1.3.6 Business Impact

High. Degrades performance of all database-dependent features.

### 2.1.4.0 Metric

#### 2.1.4.1 Metric

kube_pod_crash_looping

#### 2.1.4.2 Condition

A Kubernetes pod has restarted more than 5 times in the last 10 minutes.

#### 2.1.4.3 Threshold Type

static

#### 2.1.4.4 Value

rate(kube_pod_container_status_restarts_total[10m]) * 60 * 10 > 5

#### 2.1.4.5 Justification

Indicates a critical application bug, misconfiguration, or resource issue in a microservice that prevents it from starting, impacting its functionality.

#### 2.1.4.6 Business Impact

Varies by service, from low to high. A critical service like Identity & Access would have a high impact.

### 2.1.5.0 Metric

#### 2.1.5.1 Metric

sqs_dlq_messages_visible

#### 2.1.5.2 Condition

The number of visible messages in any Dead Letter Queue (DLQ) is greater than 0.

#### 2.1.5.3 Threshold Type

static

#### 2.1.5.4 Value

> 0

#### 2.1.5.5 Justification

Messages in a DLQ represent failed processing of critical asynchronous events (e.g., new post fan-out, search indexing), indicating data inconsistency or broken workflows.

#### 2.1.5.6 Business Impact

Medium to High. Can lead to stale data (feeds, search) or failed user workflows (email verification).

### 2.1.6.0 Metric

#### 2.1.6.1 Metric

opensearch_cluster_status_red

#### 2.1.6.2 Condition

The health status of the OpenSearch cluster is 'red'.

#### 2.1.6.3 Threshold Type

static

#### 2.1.6.4 Value

== 1

#### 2.1.6.5 Justification

A 'red' status indicates that at least one primary shard is not allocated, meaning data is unavailable and search functionality (REQ-1-031) is critically impaired.

#### 2.1.6.6 Business Impact

High. User search functionality is broken or returning incomplete results.

## 2.2.0.0 Threshold Strategies

*No items available*

## 2.3.0.0 Baseline Deviation Alerts

*No items available*

## 2.4.0.0 Predictive Alerts

*No items available*

## 2.5.0.0 Compound Conditions

*No items available*

# 3.0.0.0 Severity Level Classification

## 3.1.0.0 Severity Definitions

### 3.1.1.0 Level

#### 3.1.1.1 Level

🚨 Critical

#### 3.1.1.2 Criteria

Immediate, widespread user-facing impact. Core functionality is unavailable (e.g., login, registration, posting). Imminent risk of data loss or major security breach. SLA/SLO violation is occurring.

#### 3.1.1.3 Business Impact

High (Revenue, Reputation, Customer Trust)

#### 3.1.1.4 Customer Impact

Severe (Users blocked from using the platform)

#### 3.1.1.5 Response Time

< 15 minutes (Ack), < 1 hour (Resolution)

#### 3.1.1.6 Escalation Required

✅ Yes

### 3.1.2.0 Level

#### 3.1.2.1 Level

🔴 High

#### 3.1.2.2 Criteria

Significant degradation of service performance or functionality. A core feature is partially failing or very slow. High potential to escalate to a critical incident. Security anomaly detected.

#### 3.1.2.3 Business Impact

Medium (Reputation, Customer Satisfaction)

#### 3.1.2.4 Customer Impact

Significant (Poor user experience, intermittent failures)

#### 3.1.2.5 Response Time

< 30 minutes (Ack), < 4 hours (Resolution)

#### 3.1.2.6 Escalation Required

✅ Yes

### 3.1.3.0 Level

#### 3.1.3.1 Level

⚠️ Warning

#### 3.1.3.2 Criteria

System health indicators are outside of normal parameters (e.g., high resource utilization). No immediate user impact, but indicates a potential future problem if left unaddressed. Non-critical background job failures.

#### 3.1.3.3 Business Impact

Low

#### 3.1.3.4 Customer Impact

Minimal to None

#### 3.1.3.5 Response Time

Business hours (Ack), Best effort (Resolution)

#### 3.1.3.6 Escalation Required

❌ No

## 3.2.0.0 Business Impact Matrix

*No items available*

## 3.3.0.0 Customer Impact Criteria

*No items available*

## 3.4.0.0 Sla Violation Severity

*No items available*

## 3.5.0.0 System Health Severity

*No items available*

# 4.0.0.0 Notification Channel Strategy

## 4.1.0.0 Channel Configuration

### 4.1.1.0 Channel

#### 4.1.1.1 Channel

pagerduty

#### 4.1.1.2 Purpose

Primary on-call alerting for urgent, actionable incidents requiring immediate attention.

#### 4.1.1.3 Applicable Severities

- Critical

#### 4.1.1.4 Time Constraints

24/7

#### 4.1.1.5 Configuration

*No data available*

### 4.1.2.0 Channel

#### 4.1.2.1 Channel

slack

#### 4.1.2.2 Purpose

General team awareness for non-urgent issues and notifications of critical incidents.

#### 4.1.2.3 Applicable Severities

- Critical
- High
- Warning

#### 4.1.2.4 Time Constraints

24/7

#### 4.1.2.5 Configuration

##### 4.1.2.5.1 Channel

#alerts-prod

### 4.1.3.0.0 Channel

#### 4.1.3.1.0 Channel

email

#### 4.1.3.2.0 Purpose

Weekly summary reports of alerting activity and trends.

#### 4.1.3.3.0 Applicable Severities

- Warning

#### 4.1.3.4.0 Time Constraints

Weekly

#### 4.1.3.5.0 Configuration

*No data available*

## 4.2.0.0.0 Routing Rules

### 4.2.1.0.0 Condition

#### 4.2.1.1.0 Condition

alert.severity == 'Critical'

#### 4.2.1.2.0 Severity

Critical

#### 4.2.1.3.0 Alert Type

Any

#### 4.2.1.4.0 Channels

- pagerduty
- slack

#### 4.2.1.5.0 Priority

🔹 1

### 4.2.2.0.0 Condition

#### 4.2.2.1.0 Condition

alert.severity == 'High'

#### 4.2.2.2.0 Severity

High

#### 4.2.2.3.0 Alert Type

Any

#### 4.2.2.4.0 Channels

- slack

#### 4.2.2.5.0 Priority

🔹 2

### 4.2.3.0.0 Condition

#### 4.2.3.1.0 Condition

alert.severity == 'Warning'

#### 4.2.3.2.0 Severity

Warning

#### 4.2.3.3.0 Alert Type

Any

#### 4.2.3.4.0 Channels

- slack

#### 4.2.3.5.0 Priority

🔹 3

## 4.3.0.0.0 Time Based Routing

*No items available*

## 4.4.0.0.0 Ticketing Integration

*No items available*

## 4.5.0.0.0 Emergency Notifications

*No items available*

## 4.6.0.0.0 Chat Platform Integration

*No items available*

# 5.0.0.0.0 Alert Correlation Implementation

## 5.1.0.0.0 Grouping Requirements

- {'groupingCriteria': 'cluster, service, alertname', 'timeWindow': '5m', 'maxGroupSize': 0, 'suppressionStrategy': 'Group related alerts into a single notification to reduce noise.'}

## 5.2.0.0.0 Parent Child Relationships

- {'parentCondition': "Alert 'RDSDatabaseDown' is firing", 'childConditions': ['APIGatewayHighErrorRate', 'KubePodCrashLooping (for DB-dependent services)'], 'suppressionDuration': 'While parent is active', 'propagationRules': 'Only fire the parent alert to prevent a storm of secondary failure alerts.'}

## 5.3.0.0.0 Topology Based Correlation

*No items available*

## 5.4.0.0.0 Time Window Correlation

*No items available*

## 5.5.0.0.0 Causal Relationship Detection

*No items available*

## 5.6.0.0.0 Maintenance Window Suppression

- {'maintenanceType': 'Scheduled Deployments', 'suppressionScope': ['KubePodCrashLooping', 'APIGatewayHighErrorRate'], 'automaticDetection': False, 'manualOverride': True}

# 6.0.0.0.0 False Positive Mitigation

## 6.1.0.0.0 Noise Reduction Strategies

- {'strategy': "Use 'for' clause in Prometheus", 'implementation': "All threshold-based alerts include a 'for' duration (e.g., 'for: 5m') to ensure the condition is sustained before firing, ignoring transient spikes.", 'applicableAlerts': ['APIGatewayHighErrorRate', 'APIGatewayHighLatency', 'RDSHighCPU'], 'effectiveness': 'High'}

## 6.2.0.0.0 Confirmation Counts

*No items available*

## 6.3.0.0.0 Dampening And Flapping

*No items available*

## 6.4.0.0.0 Alert Validation

*No items available*

## 6.5.0.0.0 Smart Filtering

*No items available*

## 6.6.0.0.0 Quorum Based Alerting

*No items available*

# 7.0.0.0.0 On Call Management Integration

## 7.1.0.0.0 Escalation Paths

- {'severity': 'Critical', 'escalationLevels': [{'level': 1, 'recipients': ['Primary On-Call Engineer'], 'escalationTime': '15m', 'requiresAcknowledgment': True}, {'level': 2, 'recipients': ['Secondary On-Call Engineer'], 'escalationTime': '15m', 'requiresAcknowledgment': True}, {'level': 3, 'recipients': ['Engineering Manager'], 'escalationTime': '20m', 'requiresAcknowledgment': False}], 'ultimateEscalation': 'Head of Engineering'}

## 7.2.0.0.0 Escalation Timeframes

*No items available*

## 7.3.0.0.0 On Call Rotation

- {'team': 'Platform Engineering', 'rotationType': 'weekly', 'handoffTime': 'Monday 10:00 UTC', 'backupEscalation': 'Secondary On-Call Schedule'}

## 7.4.0.0.0 Acknowledgment Requirements

- {'severity': 'Critical', 'acknowledgmentTimeout': '15m', 'autoEscalation': True, 'requiresComment': False}

## 7.5.0.0.0 Incident Ownership

*No items available*

## 7.6.0.0.0 Follow The Sun Support

*No items available*

# 8.0.0.0.0 Project Specific Alerts Config

## 8.1.0.0.0 Alerts

### 8.1.1.0.0 APIGatewayHighErrorRate

#### 8.1.1.1.0 Name

APIGatewayHighErrorRate

#### 8.1.1.2.0 Description

Monitors the rate of 5xx errors from the AWS API Gateway.

#### 8.1.1.3.0 Condition

job:apigateway_requests:rate5xx{env="prod"} > 0.02 for 5m

#### 8.1.1.4.0 Threshold

2% over 5 minutes

#### 8.1.1.5.0 Severity

Critical

#### 8.1.1.6.0 Channels

- pagerduty
- slack

#### 8.1.1.7.0 Correlation

##### 8.1.1.7.1 Group Id

api-gateway

##### 8.1.1.7.2 Suppression Rules

*No items available*

#### 8.1.1.8.0 Escalation

##### 8.1.1.8.1 Enabled

✅ Yes

##### 8.1.1.8.2 Escalation Time

15m

##### 8.1.1.8.3 Escalation Path

- Primary On-Call
- Secondary On-Call

#### 8.1.1.9.0 Suppression

| Property | Value |
|----------|-------|
| Maintenance Window | ✅ |
| Dependency Failure | ✅ |
| Manual Override | ✅ |

#### 8.1.1.10.0 Validation

##### 8.1.1.10.1 Confirmation Count

0

##### 8.1.1.10.2 Confirmation Window

5m

#### 8.1.1.11.0 Remediation

##### 8.1.1.11.1 Automated Actions

*No items available*

##### 8.1.1.11.2 Runbook Url

🔗 [https://runbooks.example.com/api-gateway-high-error-rate](https://runbooks.example.com/api-gateway-high-error-rate)

##### 8.1.1.11.3 Troubleshooting Steps

- Check Grafana dashboard for error rate breakdown by service.
- Check Loki for logs with 'level=error' during the incident window.
- Check Jaeger for traces with error flags.

### 8.1.2.0.0 APIGatewayHighLatency

#### 8.1.2.1.0 Name

APIGatewayHighLatency

#### 8.1.2.2.0 Description

Monitors the P95 latency of core API endpoints.

#### 8.1.2.3.0 Condition

histogram_quantile(0.95, sum(rate(api_gateway_latency_bucket[5m])) by (le, route)) > 200 for 5m

#### 8.1.2.4.0 Threshold

200ms

#### 8.1.2.5.0 Severity

High

#### 8.1.2.6.0 Channels

- slack

#### 8.1.2.7.0 Correlation

##### 8.1.2.7.1 Group Id

api-gateway

##### 8.1.2.7.2 Suppression Rules

*No items available*

#### 8.1.2.8.0 Escalation

##### 8.1.2.8.1 Enabled

❌ No

##### 8.1.2.8.2 Escalation Time



##### 8.1.2.8.3 Escalation Path

*No items available*

#### 8.1.2.9.0 Suppression

| Property | Value |
|----------|-------|
| Maintenance Window | ✅ |
| Dependency Failure | ❌ |
| Manual Override | ✅ |

#### 8.1.2.10.0 Validation

##### 8.1.2.10.1 Confirmation Count

0

##### 8.1.2.10.2 Confirmation Window

5m

#### 8.1.2.11.0 Remediation

##### 8.1.2.11.1 Automated Actions

*No items available*

##### 8.1.2.11.2 Runbook Url

🔗 [https://runbooks.example.com/api-gateway-high-latency](https://runbooks.example.com/api-gateway-high-latency)

##### 8.1.2.11.3 Troubleshooting Steps

- Identify the slow service/route from the Grafana dashboard.
- Analyze traces in Jaeger for the slow route to find the bottleneck.
- Check for high resource utilization on the identified service or its database.

### 8.1.3.0.0 DLQMessagesVisible

#### 8.1.3.1.0 Name

DLQMessagesVisible

#### 8.1.3.2.0 Description

Monitors for any messages in any SQS Dead Letter Queue.

#### 8.1.3.3.0 Condition

aws_sqs_approximate_number_of_messages_visible{queue_name~=".*-dlq"} > 0 for 15m

#### 8.1.3.4.0 Threshold

> 0

#### 8.1.3.5.0 Severity

Critical

#### 8.1.3.6.0 Channels

- pagerduty
- slack

#### 8.1.3.7.0 Correlation

##### 8.1.3.7.1 Group Id

async-processing

##### 8.1.3.7.2 Suppression Rules

*No items available*

#### 8.1.3.8.0 Escalation

##### 8.1.3.8.1 Enabled

✅ Yes

##### 8.1.3.8.2 Escalation Time

15m

##### 8.1.3.8.3 Escalation Path

- Primary On-Call
- Secondary On-Call

#### 8.1.3.9.0 Suppression

| Property | Value |
|----------|-------|
| Maintenance Window | ❌ |
| Dependency Failure | ❌ |
| Manual Override | ✅ |

#### 8.1.3.10.0 Validation

##### 8.1.3.10.1 Confirmation Count

0

##### 8.1.3.10.2 Confirmation Window

15m

#### 8.1.3.11.0 Remediation

##### 8.1.3.11.1 Automated Actions

*No items available*

##### 8.1.3.11.2 Runbook Url

🔗 [https://runbooks.example.com/dlq-messages](https://runbooks.example.com/dlq-messages)

##### 8.1.3.11.3 Troubleshooting Steps

- Identify the DLQ with messages from the alert details.
- Inspect sample messages to identify the cause of failure.
- Check logs for the associated consumer service for processing errors.
- If a bug is found, deploy a fix before considering redriving messages.

### 8.1.4.0.0 KubePodCrashLooping

#### 8.1.4.1.0 Name

KubePodCrashLooping

#### 8.1.4.2.0 Description

Detects if any Kubernetes pod is in a CrashLoopBackOff state.

#### 8.1.4.3.0 Condition

rate(kube_pod_container_status_restarts_total{namespace="prod"}[10m]) * 600 > 5

#### 8.1.4.4.0 Threshold

> 5 restarts in 10 minutes

#### 8.1.4.5.0 Severity

High

#### 8.1.4.6.0 Channels

- slack

#### 8.1.4.7.0 Correlation

##### 8.1.4.7.1 Group Id

kubernetes-workloads

##### 8.1.4.7.2 Suppression Rules

*No items available*

#### 8.1.4.8.0 Escalation

##### 8.1.4.8.1 Enabled

❌ No

##### 8.1.4.8.2 Escalation Time



##### 8.1.4.8.3 Escalation Path

*No items available*

#### 8.1.4.9.0 Suppression

| Property | Value |
|----------|-------|
| Maintenance Window | ✅ |
| Dependency Failure | ❌ |
| Manual Override | ✅ |

#### 8.1.4.10.0 Validation

##### 8.1.4.10.1 Confirmation Count

0

##### 8.1.4.10.2 Confirmation Window

0m

#### 8.1.4.11.0 Remediation

##### 8.1.4.11.1 Automated Actions

*No items available*

##### 8.1.4.11.2 Runbook Url

🔗 [https://runbooks.example.com/pod-crash-looping](https://runbooks.example.com/pod-crash-looping)

##### 8.1.4.11.3 Troubleshooting Steps

- Run 'kubectl describe pod <pod_name>' to check for errors.
- Run 'kubectl logs -p <pod_name>' to view logs from the previously crashed container.
- Check for recent deployments or configuration changes for the affected service.

## 8.2.0.0.0 Alert Groups

*No items available*

## 8.3.0.0.0 Notification Templates

*No items available*

# 9.0.0.0.0 Implementation Priority

## 9.1.0.0.0 Component

### 9.1.1.0.0 Component

Critical Alerts (API Errors, DLQ, OpenSearch Red)

### 9.1.2.0.0 Priority

🔴 high

### 9.1.3.0.0 Dependencies

- Prometheus/Alertmanager setup
- PagerDuty Integration

### 9.1.4.0.0 Estimated Effort

3 days

### 9.1.5.0.0 Risk Level

low

## 9.2.0.0.0 Component

### 9.2.1.0.0 Component

High/Warning Alerts (Latency, Resource Utilization, Pod Crashes)

### 9.2.2.0.0 Priority

🟡 medium

### 9.2.3.0.0 Dependencies

- Prometheus/Alertmanager setup

### 9.2.4.0.0 Estimated Effort

5 days

### 9.2.5.0.0 Risk Level

medium

## 9.3.0.0.0 Component

### 9.3.1.0.0 Component

Alert Correlation and Suppression Logic

### 9.3.2.0.0 Priority

🟢 low

### 9.3.3.0.0 Dependencies

- Base alerts implementation

### 9.3.4.0.0 Estimated Effort

4 days

### 9.3.5.0.0 Risk Level

medium

# 10.0.0.0.0 Risk Assessment

## 10.1.0.0.0 Risk

### 10.1.1.0.0 Risk

Alert Fatigue due to noisy or poorly tuned alerts.

### 10.1.2.0.0 Impact

high

### 10.1.3.0.0 Probability

medium

### 10.1.4.0.0 Mitigation

Start with a minimal set of high-signal alerts. Use appropriate 'for' durations. Iteratively tune thresholds based on historical data and false positives after launch. Conduct regular alert reviews.

### 10.1.5.0.0 Contingency Plan

Temporarily silence noisy alerts while root cause is investigated. Refine alert grouping and suppression rules in Alertmanager.

## 10.2.0.0.0 Risk

### 10.2.1.0.0 Risk

Missed incidents due to non-firing or misconfigured alerts.

### 10.2.2.0.0 Impact

high

### 10.2.3.0.0 Probability

low

### 10.2.4.0.0 Mitigation

Automate testing of the alerting pipeline. Manually trigger test alerts for each new configuration to verify the end-to-end notification flow (Prometheus -> Alertmanager -> PagerDuty/Slack).

### 10.2.5.0.0 Contingency Plan

Rely on dashboard monitoring and manual investigation until alerting is fixed. Escalate to the team responsible for the observability stack.

# 11.0.0.0.0 Recommendations

## 11.1.0.0.0 Category

### 11.1.1.0.0 Category

🔹 Process

### 11.1.2.0.0 Recommendation

Establish a bi-weekly 'Alert Review' meeting post-launch to analyze all fired alerts, identify false positives, and tune thresholds.

### 11.1.3.0.0 Justification

Alerting is not a 'set and forget' process. Continuous refinement is required to maintain a high signal-to-noise ratio and prevent alert fatigue.

### 11.1.4.0.0 Priority

🔴 high

### 11.1.5.0.0 Implementation Notes

The on-call engineer for the previous period should lead the review, presenting data on acknowledged alerts and false positives.

## 11.2.0.0.0 Category

### 11.2.1.0.0 Category

🔹 Technology

### 11.2.2.0.0 Recommendation

Codify all Prometheus and Alertmanager configurations (alerting rules, routing, suppression) in a version-controlled repository and manage them via a GitOps workflow.

### 11.2.3.0.0 Justification

Ensures alerting configuration is versioned, auditable, and peer-reviewed, reducing the risk of manual configuration errors and providing a history of changes.

### 11.2.4.0.0 Priority

🔴 high

### 11.2.5.0.0 Implementation Notes

Use tools like Terraform or a dedicated Kubernetes operator (e.g., Prometheus Operator) to manage the configuration declaratively.

