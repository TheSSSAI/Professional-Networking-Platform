# 1 Strategies

## 1.1 Retry

### 1.1.1 Type

🔹 Retry

### 1.1.2 Configuration

#### 1.1.2.1 Description

For transient, recoverable errors in synchronous communication. Applied to gRPC calls between services and calls to external managed services (AWS RDS, S3, SES, etc.).

#### 1.1.2.2 Retry Attempts

3

#### 1.1.2.3 Backoff Strategy

ExponentialWithJitter

#### 1.1.2.4 Initial Interval

100ms

#### 1.1.2.5 Max Interval

1s

#### 1.1.2.6 Timeout Per Attempt

2s

#### 1.1.2.7 Error Handling Rules

- GrpcUnavailableError
- DatabaseTransientError
- CacheConnectionError
- AwsServiceThrottlingError
- NetworkTimeout

## 1.2.0.0 CircuitBreaker

### 1.2.1.0 Type

🔹 CircuitBreaker

### 1.2.2.0 Configuration

#### 1.2.2.1 Description

Protects services from cascading failures due to repeated errors from a single dependency. Wraps all inter-service gRPC calls.

#### 1.2.2.2 Failure Threshold Percentage

50%

#### 1.2.2.3 Monitoring Time Window

30s

#### 1.2.2.4 Minimum Requests

20

#### 1.2.2.5 Open State Duration

60s

#### 1.2.2.6 Error Handling Rules

- GrpcUnavailableError
- GrpcTimeoutError
- GrpcInternalError

## 1.3.0.0 Fallback

### 1.3.1.0 Type

🔹 Fallback

### 1.3.2.0 Configuration

#### 1.3.2.1 Description

Provides graceful degradation for read operations by serving stale data if the primary data source is unavailable.

#### 1.3.2.2 Fallback Mechanism

ServeStaleFromCache

#### 1.3.2.3 Cache Ttlfor Stale Data

5m

#### 1.3.2.4 Error Handling Rules

- DatabaseReadTimeout
- DatabaseUnavailable
- CircuitBreakerOpenException

## 1.4.0.0 DeadLetter

### 1.4.1.0 Type

🔹 DeadLetter

### 1.4.2.0 Configuration

#### 1.4.2.1 Description

Captures messages from asynchronous event-driven workflows (e.g., feed fan-out, search indexing) that fail processing after exhausting retries.

#### 1.4.2.2 Dead Letter Queue

platform_events_dlq

#### 1.4.2.3 Initial Retry Policy

| Property | Value |
|----------|-------|
| Retry Attempts | 5 |
| Backoff Strategy | Exponential |
| Initial Interval | 10s |

#### 1.4.2.4 Error Handling Rules

- EventProcessingPermanentError
- RepeatedEventProcessingTransientError

# 2.0.0.0 Monitoring

## 2.1.0.0 Error Types

- GrpcUnavailableError
- DatabaseTransientError
- CacheConnectionError
- AwsServiceThrottlingError
- NetworkTimeout
- CircuitBreakerOpenException
- EventProcessingPermanentError
- ValidationError
- AuthenticationError
- AuthorizationError
- UnhandledException

## 2.2.0.0 Logging

All errors are logged in a structured JSON format to Loki. Every log entry must include a `correlationId` propagated from the API Gateway, service name, error type, full stack trace, and sanitized request context.

## 2.3.0.0 Alerting

Alerting is configured in Prometheus/Alertmanager and integrated with PagerDuty for critical on-call notifications. Critical alerts are triggered by: Circuit Breaker entering an 'open' state, API Gateway 5xx error rate exceeding 2% over 5 minutes, sustained P95 latency > 200ms, and message count in any Dead Letter Queue > 0. Warning-level alerts (e.g., elevated resource utilization) are sent to a dedicated engineering Slack channel.

