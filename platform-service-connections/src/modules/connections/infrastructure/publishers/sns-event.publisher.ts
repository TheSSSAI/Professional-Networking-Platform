import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from '@aws-sdk/client-sns';
import { IEventPublisherPort } from '../../domain/interfaces/event-publisher.port.interface';
import { BaseEvent } from '../../../../shared/domain/events/base.event';

@Injectable()
export class SnsEventPublisher implements IEventPublisherPort {
  private readonly logger = new Logger(SnsEventPublisher.name);
  private readonly snsClient: SNSClient;
  private readonly topicArn: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    if (!region) {
      throw new Error('AWS_REGION is not configured.');
    }

    this.snsClient = new SNSClient({ region });
    this.topicArn = this.configService.get<string>('AWS_SNS_TOPIC_ARN');
    if (!this.topicArn) {
      this.logger.warn(
        'AWS_SNS_TOPIC_ARN is not configured. Event publishing will be disabled.',
      );
    }
  }

  async publish(event: BaseEvent): Promise<void> {
    if (!this.topicArn) {
      this.logger.warn(
        `Skipping event publishing because AWS_SNS_TOPIC_ARN is not set. Event: ${event.constructor.name}`,
      );
      return;
    }

    const eventType = event.constructor.name;

    const params: PublishCommandInput = {
      TopicArn: this.topicArn,
      Message: JSON.stringify(event.payload),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: eventType,
        },
      },
    };

    try {
      const command = new PublishCommand(params);
      const result = await this.snsClient.send(command);
      this.logger.log(
        `Successfully published event of type ${eventType} with MessageId: ${result.MessageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish event of type ${eventType}. Error: ${error.message}`,
        error.stack,
      );
      // In a production system, you might want to add this to a dead-letter queue
      // or implement a more robust retry mechanism.
      throw new Error(`Failed to publish event: ${error.message}`);
    }
  }
}