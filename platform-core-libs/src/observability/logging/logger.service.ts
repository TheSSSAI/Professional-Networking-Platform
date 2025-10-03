import { Injectable, Scope, ConsoleLogger, LogLevel } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import pino, { Logger, destination } from 'pino';
import { context, trace } from '@opentelemetry/api';

/**
 * @class LoggerService
 * @description A custom, production-ready logger service for NestJS applications.
 * It extends the default ConsoleLogger but uses Pino for high-performance, structured JSON logging.
 * Logs are automatically enriched with OpenTelemetry trace and span IDs for correlation in systems like Loki.
 * This service is designed to be a drop-in replacement for the built-in NestJS logger.
 * As per REQ-1-083, it provides standardized, structured logging for the observability stack.
 *
 * @property {Logger} pinoLogger - The underlying Pino logger instance.
 *
 * @requires ConfigService - To get application-level configurations like service name and log level.
 * @requires @opentelemetry/api - To access the active trace context for log correlation.
 * @requires pino - For high-performance structured logging.
 *
 * @scope Scope.TRANSIENT - Ensures a new instance is created for each class that injects it,
 * allowing the context (e.g., class name) to be set per-consumer without conflicts.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  private readonly pinoLogger: Logger;

  constructor(private readonly configService: ConfigService) {
    super();
    const coreLibConfig = this.configService.get();
    const logLevel = coreLibConfig.observability.logLevel || 'info';
    const serviceName = coreLibConfig.observability.serviceName;

    this.pinoLogger = pino({
      level: logLevel,
      base: {
        service: serviceName,
        pid: process.pid,
      },
      formatters: {
        level: (label) => {
          return { level: label };
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
      // Use pino.destination for async logging in production to avoid blocking the event loop.
      // For simplicity in a library, stdout is often sufficient, but this shows the production-ready pattern.
      ...(process.env.NODE_ENV === 'production'
        ? { stream: destination({ sync: false }) }
        : {}),
    });

    this.setLogLevels(this.getNestLogLevels(logLevel));
  }

  /**
   * @method log
   * @description Writes a log message at the 'info' level.
   * @param {any} message - The log message or object.
   * @param {string} [context] - The context of the log message (e.g., class name).
   */
  log(message: any, context?: string) {
    if (!this.isLevelEnabled('log')) {
      return;
    }
    const logObject = this.createLogObject(message, context);
    this.pinoLogger.info(logObject);
  }

  /**
   * @method error
   * @description Writes a log message at the 'error' level.
   * @param {any} message - The error message or object.
   * @param {string} [trace] - The stack trace of the error.
   * @param {string} [context] - The context of the log message.
   */
  error(message: any, trace?: string, context?: string) {
    if (!this.isLevelEnabled('error')) {
      return;
    }
    const logObject = this.createLogObject(message, context, { stack_trace: trace });
    this.pinoLogger.error(logObject);
  }

  /**
   * @method warn
   * @description Writes a log message at the 'warn' level.
   * @param {any} message - The log message or object.
   * @param {string} [context] - The context of the log message.
   */
  warn(message: any, context?: string) {
    if (!this.isLevelEnabled('warn')) {
      return;
    }
    const logObject = this.createLogObject(message, context);
    this.pinoLogger.warn(logObject);
  }

  /**
   * @method debug
   * @description Writes a log message at the 'debug' level.
   * @param {any} message - The log message or object.
   * @param {string} [context] - The context of the log message.
   */
  debug?(message: any, context?: string) {
    if (!this.isLevelEnabled('debug')) {
      return;
    }
    const logObject = this.createLogObject(message, context);
    this.pinoLogger.debug(logObject);
  }

  /**
   * @method verbose
   * @description Writes a log message at the 'verbose' (trace in Pino) level.
   * @param {any} message - The log message or object.
   * @param {string} [context] - The context of the log message.
   */
  verbose?(message: any, context?: string) {
    if (!this.isLevelEnabled('verbose')) {
      return;
    }
    const logObject = this.createLogObject(message, context);
    this.pinoLogger.trace(logObject);
  }

  /**
   * @method setContext
   * @description Overrides the default context for this logger instance.
   * @param {string} context - The context to set.
   */
  setContext(context: string) {
    this.context = context;
  }

  /**
   * @private
   * @method createLogObject
   * @description Enriches the log message with trace context and metadata.
   * @param {any} message - The log message or object.
   * @param {string} [logContext] - The context for this specific log call.
   * @param {object} [additionalFields] - Any other fields to add to the log object.
   * @returns {object} The final structured log object.
   */
  private createLogObject(
    message: any,
    logContext?: string,
    additionalFields: object = {},
  ): object {
    const traceContext = this.getTraceContext();
    const finalContext = logContext || this.context;

    const baseLog = {
      ...traceContext,
      context: finalContext,
      ...additionalFields,
    };

    if (typeof message === 'object' && message !== null) {
      // If message is an object, merge it with the base log object
      return { ...baseLog, ...message };
    }

    return { ...baseLog, message };
  }

  /**
   * @private
   * @method getTraceContext
   * @description Retrieves the current OpenTelemetry trace and span IDs.
   * @returns {{ trace_id: string | undefined, span_id: string | undefined }} An object with trace context.
   */
  private getTraceContext(): { trace_id?: string; span_id?: string } {
    const span = trace.getSpan(context.active());
    if (!span) {
      return {};
    }

    const spanContext = span.spanContext();
    return {
      trace_id: spanContext.traceId,
      span_id: spanContext.spanId,
    };
  }

  /**
   * @private
   * @method getNestLogLevels
   * @description Maps a single Pino log level to the array of levels NestJS enables.
   * @param {LogLevel} level - The minimum log level.
   * @returns {LogLevel[]} An array of enabled NestJS log levels.
   */
  private getNestLogLevels(level: LogLevel): LogLevel[] {
    const levels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
    const index = levels.indexOf(level);
    return levels.slice(0, index >= 0 ? index + 1 : 3); // Default to 'log' if level is unknown
  }
}