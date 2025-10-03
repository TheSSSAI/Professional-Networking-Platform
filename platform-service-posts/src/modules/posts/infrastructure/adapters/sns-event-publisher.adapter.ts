import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { IEventPublisherPort } from '../../domain/interfaces/event-publisher.port.interface';
import { PostCreatedEvent } from '../../domain/events/post-created.event';
import { PostDeletedEvent } from '../../domain/events/post-deleted.event';
import { DomainEvent } from 'src/core/domain/domain.event';

@Injectable()
export class SnsEventPublisherAdapter implements IEventPublisherPort {
  private readonly logger = new Logger(SnsEventPublisherAdapter.name);
  private readonly snsClient: SNSClient;
  private readonly topicArn: string;

  constructor(private readonly configService: ConfigService) {
    this.topicArn = this.configService.get<string>('AWS_SNS_TOPIC_ARN');
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    if (!region || !accessKeyId || !secretAccessKey || !this.topicArn) {
      throw new Error('AWS SNS configuration is incomplete.');
    }

    this.snsClient = new SNSClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async publish(event: DomainEvent): Promise<void> {
    const eventName = event.constructor.name;
    this.logger.log(`Publishing event: ${eventName} to SNS topic`);

    try {
      let payload: object;

      // Type-safe switch to ensure we handle all expected events
      switch (event.constructor) {
        case PostCreatedEvent:
          payload = event as PostCreatedEvent;
          break;
        case PostDeletedEvent:
          payload = event as PostDeletedEvent;
          break;
        // In a real app, we might have ContentReportedEvent here too.
        default:
          this.logger.warn(`Attempted to publish an unknown event type: ${eventName}`);
          return;
      }

      const command = new PublishCommand({
        TopicArn: this.topicArn,
        Message: JSON.stringify(payload),
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: eventName,
          },
        },
      });

      const result = await this.snsClient.send(command);
      this.logger.log(
        `Successfully published event ${eventName} with Message ID: ${result.MessageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish event ${eventName} to SNS`,
        error.stack,
      );
      // In a production system, this failure should be handled with a retry mechanism
      // or by pushing the event to a Dead Letter Queue (DLQ).
      // Re-throwing here to let the calling service know the operation was not fully successful.
      throw new Error(`Failed to publish domain event: ${eventName}`);
    }
  }
}