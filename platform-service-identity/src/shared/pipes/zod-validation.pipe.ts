import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      // For HTTP context, we might want to throw a BadRequestException
      // For gRPC, we must throw an RpcException. We can check the context type.
      // Assuming gRPC context for this service as per architecture.
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');

        // As per architecture, this service uses gRPC.
        // We'll throw an RpcException that can be caught by a GrpcExceptionFilter.
        // status.INVALID_ARGUMENT is the standard gRPC code for validation failures.
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: `Validation failed: ${validationErrors}`,
        });
      }

      // For non-Zod errors, rethrow a generic internal error
      throw new RpcException({
        code: status.INTERNAL,
        message: 'An unexpected error occurred during validation.',
      });
    }
  }
}