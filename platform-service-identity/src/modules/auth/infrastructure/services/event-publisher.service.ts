import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from '@aws-sdk/client-sns';
import { IEventPublisher } from 'src/shared/interfaces/event-publisher.interface.ts';

@Injectable()
export class EventPublisherService implements IEventPublisher {
  private readonly logger = new Logger(EventPublisherService.name);
  private readonly snsClient: SNSClient;
  private readonly topicArn: string;

  constructor(private readonly configService: ConfigService) {
    // In a real application, SNSClient would be provided by a dedicated AWS module.
    // For simplicity here, we instantiate it directly.
    this.snsClient = new SNSClient({
      region: this.configService.get<string>('aws.region'),
      // Credentials would be loaded from the environment (e.g., IAM role)
    });
    this.topicArn = this.configService.get<string>('aws.snsTopicArn');
  }

  /**
   * Publishes a domain event to the configured AWS SNS topic.
   * @param eventName A string identifier for the event type, used for filtering by consumers.
   * @param payload The data payload of the event.
   */
  async publish<T extends object>(eventName: string, payload: T): Promise<void> {
    const messageBody = JSON.stringify({
      eventName,
      payload,
      timestamp: new Date().toISOString(),
    });

    const params: PublishCommandInput = {
      TopicArn: this.topicArn,
      Message: messageBody,
      MessageAttributes: {
        eventName: {
          DataType: 'String',
          StringValue: eventName,
        },
      },
    };

    try {
      const command = new PublishCommand(params);
      const result = await this.snsClient.send(command);
      this.logger.log(
        `Successfully published event '${eventName}' with MessageId: ${result.MessageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish event '${eventName}' to SNS topic ${this.topicArn}.`,
        {
          error: error.message,
          stack: error.stack,
          payload: JSON.stringify(payload), // Log payload for debugging
        },
      );
      // Re-throw the error to allow the calling use-case (e.g., in a transaction)
      // to handle the failure, for instance, by rolling back the transaction.
      throw new Error(`Event publication failed for '${eventName}'.`);
    }
  }
}