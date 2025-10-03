import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import {
  collectDefaultMetrics,
  Counter,
  Gauge,
  Histogram,
  Registry,
  Summary,
  CounterConfiguration,
  GaugeConfiguration,
  HistogramConfiguration,
  SummaryConfiguration,
} from 'prom-client';

/**
 * @class MetricsService
 * @description A centralized service for creating and managing Prometheus metrics.
 * This service acts as a facade over the 'prom-client' library, ensuring that
 * metrics are registered only once and providing a consistent way to access them
 * throughout an application. It directly supports REQ-1-083 for Prometheus metrics collection.
 *
 * @property {Registry} registry - The Prometheus registry for this service's metrics.
 *
 * @requires ConfigService - To get the service name for default labels.
 * @requires prom-client - The underlying library for Prometheus metrics.
 */
@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly registry: Registry;
  private readonly serviceName: string;
  private readonly metricsCache: Map<string, Counter | Gauge | Histogram | Summary> = new Map();

  constructor(private readonly configService: ConfigService) {
    this.registry = new Registry();
    this.serviceName = this.configService.get().observability.serviceName;
    this.registry.setDefaultLabels({
      service: this.serviceName,
    });
  }

  /**
   * @method onModuleInit
   * @description NestJS lifecycle hook. Registers default Node.js and process metrics.
   */
  onModuleInit() {
    collectDefaultMetrics({ register: this.registry });
  }

  /**
   * @method getMetrics
   * @description Returns all registered metrics in the Prometheus text format.
   * @returns {Promise<string>} A string representing the metrics for scraping.
   */
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  /**
   * @method getContentType
   * @description Returns the content type for the metrics endpoint.
   * @returns {string} The Prometheus content type.
   */
  getContentType(): string {
    return this.registry.contentType;
  }

  /**
   * @method getCounter
   * @description Creates or retrieves a Prometheus Counter metric.
   * Counters can only be incremented.
   * @param {CounterConfiguration<string>} configuration - The configuration for the Counter.
   * @returns {Counter<string>} The Counter instance.
   */
  getCounter(configuration: CounterConfiguration<string>): Counter<string> {
    const { name } = configuration;
    if (this.metricsCache.has(name)) {
      return this.metricsCache.get(name) as Counter<string>;
    }
    const counter = new Counter({ ...configuration, registers: [this.registry] });
    this.metricsCache.set(name, counter);
    return counter;
  }

  /**
   * @method getGauge
   * @description Creates or retrieves a Prometheus Gauge metric.
   * Gauges can be incremented, decremented, or set to a specific value.
   * @param {GaugeConfiguration<string>} configuration - The configuration for the Gauge.
   * @returns {Gauge<string>} The Gauge instance.
   */
  getGauge(configuration: GaugeConfiguration<string>): Gauge<string> {
    const { name } = configuration;
    if (this.metricsCache.has(name)) {
      return this.metricsCache.get(name) as Gauge<string>;
    }
    const gauge = new Gauge({ ...configuration, registers: [this.registry] });
    this.metricsCache.set(name, gauge);
    return gauge;
  }

  /**
   * @method getHistogram
   * @description Creates or retrieves a Prometheus Histogram metric.
   * Histograms track the size and number of observations in configurable buckets.
   * @param {HistogramConfiguration<string>} configuration - The configuration for the Histogram.
   * @returns {Histogram<string>} The Histogram instance.
   */
  getHistogram(configuration: HistogramConfiguration<string>): Histogram<string> {
    const { name } = configuration;
    if (this.metricsCache.has(name)) {
      return this.metricsCache.get(name) as Histogram<string>;
    }
    const histogram = new Histogram({ ...configuration, registers: [this.registry] });
    this.metricsCache.set(name, histogram);
    return histogram;
  }

    /**
   * @method getSummary
   * @description Creates or retrieves a Prometheus Summary metric.
   * Summaries track the size and number of observations in configurable quantiles.
   * @param {SummaryConfiguration<string>} configuration - The configuration for the Summary.
   * @returns {Summary<string>} The Summary instance.
   */
  getSummary(configuration: SummaryConfiguration<string>): Summary<string> {
    const { name } = configuration;
    if (this.metricsCache.has(name)) {
      return this.metricsCache.get(name) as Summary<string>;
    }
    const summary = new Summary({ ...configuration, registers: [this.registry] });
    this.metricsCache.set(name, summary);
    return summary;
  }
}