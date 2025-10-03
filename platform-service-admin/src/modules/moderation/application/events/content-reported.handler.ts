import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ContentReport } from '../../domain/entities/content-report.entity';
import { ReportStatus } from '../../domain/enums/report-status.enum';
import { IContentReportRepository } from '../../domain/interfaces/content-report.repository';

// This DTO represents the expected payload from an external event source like SQS/SNS
// It should align with the contract defined in REPO-LIB-CONTRACTS
interface ContentReportedEvent {
  reporterId: string;
  contentId: string;
  contentType: 'POST' | 'COMMENT';
  authorId: string;
  reason: string;
  timestamp: string; // ISO 8601 string
}

@Injectable()
export class ContentReportedHandler {
  private readonly logger = new Logger(ContentReportedHandler.name);

  constructor(
    @Inject(IContentReportRepository)
    private readonly contentReportRepository: IContentReportRepository,
  ) {}

  @OnEvent('content.reported', { async: true })
  async handleContentReportedEvent(
    event: ContentReportedEvent,
  ): Promise<void> {
    this.logger.log(`Received content.reported event for contentId: ${event.contentId}`);

    try {
      // Find if there's already a pending report for this content to aggregate
      let existingReport = await this.contentReportRepository.findByContentId(
        event.contentId,
      );

      const newReportDetail = {
        reporterId: event.reporterId,
        reason: event.reason,
        timestamp: new Date(event.timestamp),
      };

      if (existingReport) {
        // Idempotency check: if this specific reporter has already reported this content, do nothing.
        const alreadyReported = existingReport.reports.some(
          (r) => r.reporterId === event.reporterId,
        );
        if (alreadyReported) {
          this.logger.warn(
            `Duplicate report event received from reporter ${event.reporterId} for content ${event.contentId}. Ignoring.`,
          );
          return;
        }

        // Aggregate new report detail into existing entry
        existingReport.addReport(newReportDetail);
        await this.contentReportRepository.update(existingReport);
        this.logger.log(
          `Aggregated new report for contentId: ${event.contentId}. Total reports: ${existingReport.reports.length}`,
        );
      } else {
        // Create a new moderation queue item
        const newContentReport = new ContentReport({
          id: undefined, // DB will generate
          contentId: event.contentId,
          contentType: event.contentType,
          authorId: event.authorId,
          status: ReportStatus.PENDING,
          reports: [newReportDetail],
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await this.contentReportRepository.create(newContentReport);
        this.logger.log(
          `Created new moderation queue item for contentId: ${event.contentId}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to process content.reported event for contentId: ${event.contentId}. Error: ${error.message}`,
        error.stack,
      );
      // Re-throw to allow the event bus (e.g., SQS) to handle retries/DLQ
      throw error;
    }
  }
}