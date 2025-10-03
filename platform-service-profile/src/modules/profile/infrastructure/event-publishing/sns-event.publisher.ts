import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { ProfileUpdatedEvent } from '../../domain/events/profile-updated.event';
import { IEventPublisher } from '@app/common/interfaces/event-publisher.interface';
import { DomainEvent } from '@app/common/domain/domain-event';

@Injectable()
export class SnsEventPublisher implements IEventPublisher {
  private readonly logger = new Logger(SnsEventPublisher.name);
  private readonly snsClient: SNSClient;
  private readonly topicArn: string;

  constructor(private readonly configService: ConfigService) {
    this.snsClient = new SNSClient({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
    this.topicArn = this.configService.get<string>('AWS_SNS_PROFILE_TOPIC_ARN');
  }

  async publish(event: DomainEvent): Promise<void> {
    if (!this.topicArn) {
      this.logger.error('SNS_PROFILE_TOPIC_ARN is not configured. Cannot publish event.');
      return;
    }

    const eventType = event.constructor.name;
    const payload = {
        ...event,
        metadata: {
            timestamp: new Date().toISOString(),
            source: 'platform-service-profile'
        }
    };
    
    const message = JSON.stringify(payload);

    const command = new PublishCommand({
      TopicArn: this.topicArn,
      Message: message,
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: eventType,
        },
      },
    });

    try {
      const result = await this.snsClient.send(command);
      this.logger.log(
        `Successfully published event of type '${eventType}' with MessageId: ${result.MessageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish event of type '${eventType}': ${error.message}`,
        error.stack,
      );
      // Depending on the desired reliability, you might throw an exception here
      // to be handled by the calling service, or push to a Dead Letter Queue.
      throw error;
    }
  }
}