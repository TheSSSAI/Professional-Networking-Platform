import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

// As per gRPC Health Checking Protocol:
// https://github.com/grpc/grpc/blob/master/doc/health-checking.md
interface HealthCheckRequest {
  service: string;
}

interface HealthCheckResponse {
  status: 'SERVING' | 'NOT_SERVING' | 'UNKNOWN';
}

@Controller()
export class HealthController {
  /**
   * Implements the gRPC health check protocol.
   * This allows orchestrators like Kubernetes to probe the service's health.
   *
   * @param request The health check request, optionally containing a service name.
   * @returns The health status of the service.
   */
  @GrpcMethod('HealthService', 'Check')
  check(request: HealthCheckRequest): HealthCheckResponse {
    // For this service, we check the overall status. If the `service` field
    // is present and not an empty string or our service name, we can
    // return NOT_SERVING as per the protocol.
    if (request && request.service && request.service !== 'FeedService') {
        // We could also throw an RpcException for NOT_FOUND, which is also
        // a valid response according to the spec.
        throw new RpcException({
            code: status.NOT_FOUND,
            message: `Service '${request.service}' not found.`,
        });
    }

    // A more advanced implementation would check dependencies (e.g., Redis connection).
    // For now, if the service is running, it is considered 'SERVING'.
    return { status: 'SERVING' };
  }
}