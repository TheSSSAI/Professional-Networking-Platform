import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
} from '@aws-sdk/client-sqs';
import { IndexerService } from '../services/indexer.service';
import { UserProfileUpdatedEventDto } from '../dtos/user-profile-updated-event.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

enum ProfileEventType {
  UserProfileUpdated = 'UserProfileUpdated',
  UserProfileDeleted = 'UserProfileDeleted',
}

@Injectable()
export class ProfileEventsConsumer
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger(ProfileEventsConsumer.name);
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;
  private running = false;

  constructor(
    private readonly indexerService: IndexerService,
    private readonly configService: ConfigService,
  ) {
    this.queueUrl = this.configService.get<string>('aws.sqsQueueUrl');
    this.sqsClient = new SQSClient({
      region: this.configService.get<string>('aws.region'),
    });
  }

  onApplicationBootstrap() {
    if (!this.queueUrl) {
      this.logger.error(
        'SQS_QUEUE_URL is not configured. Consumer will not start.',
      );
      return;
    }
    this.running = true;
    this.startPolling();
    this.logger.log(`Started polling SQS queue: ${this.queueUrl}`);
  }

  onModuleDestroy() {
    this.running = false;
    this.logger.log('Stopping SQS polling...');
  }

  private async startPolling() {
    while (this.running) {
      try {
        const command = new ReceiveMessageCommand({
          QueueUrl: this.queueUrl,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 20, // Long polling
          AttributeNames: ['All'],
        });

        const { Messages } = await this.sqsClient.send(command);

        if (Messages && Messages.length > 0) {
          this.logger.log(`Received ${Messages.length} messages.`);
          await Promise.all(Messages.map((message) => this.handleMessage(message)));
        }
      } catch (error) {
        this.logger.error('Error receiving messages from SQS:', error);
        // Add a small delay before retrying to prevent spamming logs on persistent errors
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  private async handleMessage(message: Message): Promise<void> {
    try {
      if (!message.Body) {
        this.logger.warn(
          `Received message with empty body. Deleting message ID: ${message.MessageId}`,
        );
        await this.deleteMessage(message.ReceiptHandle);
        return;
      }

      // SNS messages are nested inside the SQS message body
      const snsMessage = JSON.parse(message.Body);
      const eventPayload = JSON.parse(snsMessage.Message);

      // Assuming event payload has a 'type' and 'data' field
      const eventType = eventPayload.type;
      const eventData = eventPayload.data;
      
      this.logger.log(`Processing event type: ${eventType} for userId: ${eventData.userId}`);

      switch (eventType) {
        case ProfileEventType.UserProfileUpdated:
          await this.processUpdateEvent(eventData, message);
          break;
        case ProfileEventType.UserProfileDeleted:
          await this.processDeleteEvent(eventData, message);
          break;
        default:
          this.logger.warn(`Unknown event type received: ${eventType}. Deleting message.`);
          await this.deleteMessage(message.ReceiptHandle);
      }
    } catch (error) {
      this.logger.error(
        `Failed to process message ID: ${message.MessageId}. Error: ${error.message}`,
        error.stack,
      );
      // Do not delete the message, let SQS handle retries and DLQ
    }
  }

  private async processUpdateEvent(eventData: any, message: Message) {
    const eventDto = plainToInstance(UserProfileUpdatedEventDto, eventData);
    const errors = await validate(eventDto);

    if (errors.length > 0) {
      this.logger.error(
        `Invalid UserProfileUpdatedEvent payload for message ID: ${message.MessageId}. Errors: ${errors.toString()}. Deleting message.`,
      );
      await this.deleteMessage(message.ReceiptHandle);
      return;
    }

    await this.indexerService.indexUserProfile(eventDto.userId);
    this.logger.log(`Successfully indexed profile for userId: ${eventDto.userId}`);
    await this.deleteMessage(message.ReceiptHandle);
  }
  
  private async processDeleteEvent(eventData: any, message: Message) {
    // Assuming delete event also contains userId
    const userId = eventData.userId;
    if (!userId) {
         this.logger.error(
        `Invalid UserProfileDeletedEvent payload (missing userId) for message ID: ${message.MessageId}. Deleting message.`,
      );
      await this.deleteMessage(message.ReceiptHandle);
      return;
    }

    await this.indexerService.deleteUserProfile(userId);
    this.logger.log(`Successfully deleted profile from index for userId: ${userId}`);
    await this.deleteMessage(message.ReceiptHandle);
  }

  private async deleteMessage(receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      });
      await this.sqsClient.send(command);
    } catch (error) {
      this.logger.error(
        `Failed to delete message with receipt handle: ${receiptHandle}`,
        error,
      );
    }
  }
}