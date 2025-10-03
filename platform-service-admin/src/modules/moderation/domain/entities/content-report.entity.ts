import { randomUUID } from 'crypto';
import { ReportStatus } from '../enums/report-status.enum';

export type ReportDetails = {
  reporterId: string;
  reason: string;
  timestamp: Date;
};

export interface ContentReportProps {
  id: string;
  contentId: string;
  contentType: 'POST' | 'COMMENT';
  authorId: string;
  reports: ReportDetails[];
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @class ContentReport
 * @description Represents a piece of content that has been reported by one or more users.
 * This is the aggregate root for the Content Moderation context.
 * Implements REQ-1-041 and REQ-1-042.
 */
export class ContentReport {
  private readonly _id: string;
  private readonly _contentId: string;
  private readonly _contentType: 'POST' | 'COMMENT';
  private readonly _authorId: string;
  private _reports: ReportDetails[];
  private _status: ReportStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: ContentReportProps) {
    this._id = props.id;
    this._contentId = props.contentId;
    this._contentType = props.contentType;
    this._authorId = props.authorId;
    this._reports = props.reports;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Factory method to create a new ContentReport when content is reported for the first time.
   * @param createProps Properties for the initial report.
   * @returns A new instance of ContentReport.
   */
  public static create(createProps: {
    contentId: string;
    contentType: 'POST' | 'COMMENT';
    authorId: string;
    reporterId: string;
    reason: string;
  }): ContentReport {
    const now = new Date();
    const initialReport: ReportDetails = {
      reporterId: createProps.reporterId,
      reason: createProps.reason,
      timestamp: now,
    };
    
    const props: ContentReportProps = {
      id: randomUUID(),
      contentId: createProps.contentId,
      contentType: createProps.contentType,
      authorId: createProps.authorId,
      reports: [initialReport],
      status: ReportStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };
    return new ContentReport(props);
  }

  /**
   * Reconstitutes a ContentReport from persistence.
   * @param props The full properties of an existing content report.
   * @returns An instance of ContentReport.
   */
  public static reconstitute(props: ContentReportProps): ContentReport {
    return new ContentReport(props);
  }

  // --- Business Logic Methods ---

  /**
   * Adds a new individual report to this aggregate.
   * This is used when a second or subsequent user reports the same piece of content.
   * @param reporterId The ID of the user submitting the new report.
   * @param reason The reason for the new report.
   */
  public addReport(reporterId: string, reason: string): void {
    if (this._status !== ReportStatus.PENDING) {
      throw new Error('Cannot add a report to an item that is already resolved.');
    }
    // Ensure a user cannot report the same content multiple times
    const alreadyReported = this._reports.some(r => r.reporterId === reporterId);
    if (alreadyReported) {
      // Idempotent: if already reported, do nothing. Do not throw an error.
      return;
    }
    this._reports.push({ reporterId, reason, timestamp: new Date() });
    this._updatedAt = new Date();
  }

  /**
   * Marks the report as dismissed by an administrator.
   */
  public dismiss(): void {
    if (this._status !== ReportStatus.PENDING) {
      throw new Error('Cannot dismiss a report that is not in a pending state.');
    }
    this._status = ReportStatus.DISMISSED;
    this._updatedAt = new Date();
  }

  /**
   * Marks the report as having had a moderation action taken.
   */
  public actionTaken(): void {
    if (this._status !== ReportStatus.PENDING) {
      throw new Error('Cannot take action on a report that is not in a pending state.');
    }
    this._status = ReportStatus.ACTION_TAKEN;
    this._updatedAt = new Date();
  }

  // --- Getters ---

  get id(): string {
    return this._id;
  }

  get contentId(): string {
    return this._contentId;
  }
  
  get contentType(): 'POST' | 'COMMENT' {
    return this._contentType;
  }

  get authorId(): string {
    return this._authorId;
  }

  get reports(): readonly ReportDetails[] {
    return this._reports;
  }

  get status(): ReportStatus {
    return this._status;
  }
  
  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get reportCount(): number {
    return this._reports.length;
  }
}