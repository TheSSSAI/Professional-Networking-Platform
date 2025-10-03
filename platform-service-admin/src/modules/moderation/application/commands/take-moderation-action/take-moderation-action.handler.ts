import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TakeModerationActionCommand } from './take-moderation-action.command';
import { IContentReportRepository } from '../../../../moderation/domain/interfaces/content-report.repository';
import { AuditService } from '../../../../audit/application/services/audit.service';
import { IdentityServiceClient } from '../../../../../shared/infrastructure/grpc-clients/identity/identity.client';
import { PostsServiceClient } from '../../../../../shared/infrastructure/grpc-clients/posts/posts.client';
import { AdminActionType } from '../../../../audit/domain/enums/admin-action-type.enum';
import { ReportStatus } from '../../../../moderation/domain/enums/report-status.enum';
import { PrismaService } from 'nestjs-prisma'; // Assuming PrismaService is available for transactions

// Assuming a domain event for when an action is taken
class AdminActionTakenEvent {
    constructor(
        public readonly reportId: string,
        public readonly adminId: string,
        public readonly action: AdminActionType,
        public readonly targetId: string,
    ) {}
}

@CommandHandler(TakeModerationActionCommand)
export class TakeModerationActionHandler implements ICommandHandler<TakeModerationActionCommand> {
    private readonly logger = new Logger(TakeModerationActionHandler.name);

    constructor(
        @Inject(IContentReportRepository)
        private readonly contentReportRepository: IContentReportRepository,
        private readonly auditService: AuditService,
        private readonly identityClient: IdentityServiceClient,
        private readonly postsClient: PostsServiceClient,
        private readonly eventBus: EventBus,
        private readonly prisma: PrismaService, // Inject Prisma for transactions
    ) {}

    async execute(command: TakeModerationActionCommand): Promise<void> {
        const { reportId, adminId, action, reason, details } = command;
        this.logger.log(`Executing TakeModerationActionCommand for report ${reportId} with action ${action}`);

        const report = await this.contentReportRepository.findById(reportId);
        if (!report) {
            this.logger.error(`Content report with ID "${reportId}" not found.`);
            throw new NotFoundException(`Content report with ID "${reportId}" not found.`);
        }

        if (report.status !== ReportStatus.PENDING) {
            this.logger.warn(`Attempted to action a report that is not in PENDING state. Report ID: ${reportId}, Status: ${report.status}`);
            throw new ConflictException(`This report has already been actioned.`);
        }

        // The target for the audit log is the user or content, not the report itself.
        const targetId = report.authorId || report.contentId;
        const targetType = report.contentType === 'USER' ? 'User' : report.contentType;

        // Log the intent to take action before executing it. This is crucial for auditability.
        await this.auditService.logAction({
            adminId,
            actionType: action,
            targetId: targetId,
            targetType: targetType,
            reason: reason,
            details: { ...details, reportId: report.id },
        });

        try {
            await this.prisma.$transaction(async (tx) => {
                const transactionalRepository = this.contentReportRepository.withTransaction(tx);
                
                switch (action) {
                    case AdminActionType.DISMISS_REPORT:
                        report.status = ReportStatus.DISMISSED;
                        await transactionalRepository.update(report);
                        this.logger.log(`Report ${reportId} dismissed by admin ${adminId}.`);
                        break;
                    
                    case AdminActionType.REMOVE_CONTENT:
                        if (report.contentType === 'POST') {
                            await this.postsClient.deletePostAsAdmin({ postId: report.contentId, adminId });
                        } else if (report.contentType === 'COMMENT') {
                            // Assuming a similar client method for comments
                            // await this.commentsClient.deleteCommentAsAdmin({ commentId: report.contentId, adminId });
                            this.logger.warn(`Comment removal not implemented. Report: ${reportId}`);
                        }
                        report.status = ReportStatus.ACTION_TAKEN;
                        await transactionalRepository.update(report);
                        this.logger.log(`Content ${report.contentId} removed based on report ${reportId}.`);
                        break;

                    case AdminActionType.BAN_USER:
                        await this.identityClient.banUser({ userId: report.authorId, adminId, reason });
                        report.status = ReportStatus.ACTION_TAKEN;
                        await transactionalRepository.update(report);
                        this.logger.log(`User ${report.authorId} banned based on report ${reportId}.`);
                        break;
                    
                    case AdminActionType.SUSPEND_USER:
                        if (!details?.durationSeconds) {
                            throw new ConflictException('Suspension duration is required.');
                        }
                        await this.identityClient.suspendUser({ userId: report.authorId, adminId, reason, durationSeconds: details.durationSeconds });
                        report.status = ReportStatus.ACTION_TAKEN;
                        await transactionalRepository.update(report);
                        this.logger.log(`User ${report.authorId} suspended for ${details.durationSeconds}s based on report ${reportId}.`);
                        break;
                        
                    case AdminActionType.ISSUE_WARNING:
                         // Assuming an RPC call to issue a warning
                         // await this.identityClient.issueWarning({ userId: report.authorId, adminId, reason });
                        report.status = ReportStatus.ACTION_TAKEN;
                        await transactionalRepository.update(report);
                        this.logger.log(`Warning issued to user ${report.authorId} based on report ${reportId}.`);
                        break;

                    default:
                        this.logger.error(`Unsupported moderation action: ${action}`);
                        // Revert the audit log? Or log a failure? For now, we throw.
                        // The initial audit log remains as an "attempt".
                        throw new InternalServerErrorException(`Unsupported moderation action: ${action}`);
                }
            });

            this.eventBus.publish(new AdminActionTakenEvent(reportId, adminId, action, targetId));

        } catch (error) {
            this.logger.error(`Failed to execute moderation action for report ${reportId}. Error: ${error.message}`, error.stack);
            if (error instanceof RpcException) {
                // Propagate gRPC errors
                throw error;
            }
            throw new InternalServerErrorException(`Failed to execute moderation action. Please try again.`);
        }
    }
}