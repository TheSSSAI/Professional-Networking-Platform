import {
  Injectable,
  OnModuleInit,
  Logger,
  Inject,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
} from '@aws-sdk/client-sqs';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PostCreatedEventDto } from './dto/post-created-event.dto';
import { IFeedService } from '../modules/feed/interfaces/feed.service.interface';

@Injectable()
export class PostCreatedConsumer implements OnModuleInit {
  private readonly logger = new Logger(PostCreatedConsumer.name);
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;

  constructor(
    @Inject(IFeedService) private readonly feedService: IFeedService,
    private readonly configService: ConfigService,
  ) {
    const awsRegion = this.configService.get<string>('aws.region');
    this.queueUrl = this.configService.get<string>('aws.sqsQueueUrl');
    if (!awsRegion || !this.queueUrl) {
      throw new Error('SQS configuration is missing in environment variables.');
    }
    this.sqsClient = new SQSClient({ region: awsRegion });
  }

  onModuleInit() {
    this.logger.log('Initializing SQS consumer...');
    this.startPolling();
  }

  private async startPolling(): Promise<void> {
    this.logger.log(`Starting to poll SQS queue: ${this.queueUrl}`);
    while (true) {
      try {
        const command = new ReceiveMessageCommand({
          QueueUrl: this.queueUrl,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 20, // Enable long polling
          AttributeNames: ['All'],
          MessageAttributeNames: ['All'],
        });

        const { Messages } = await this.sqsClient.send(command);

        if (Messages && Messages.length > 0) {
          this.logger.log(`Received ${Messages.length} messages from SQS.`);
          await Promise.all(Messages.map((msg) => this.processMessage(msg)));
        }
      } catch (error) {
        this.logger.error('Error receiving messages from SQS:', error);
        // Implement exponential backoff or a simple delay before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  private async processMessage(message: Message): Promise<void> {
    const messageId = message.MessageId;
    this.logger.log(`Processing message with ID: ${messageId}`);

    try {
      const messageBody = JSON.parse(message.Body);
      const validationPipe = new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      // SNS often wraps the message in a 'Message' property
      const payload = messageBody.Message ? JSON.parse(messageBody.Message) : messageBody;

      const postCreatedEvent = plainToInstance(
        PostCreatedEventDto,
        payload,
      );
      
      const errors = await validate(postCreatedEvent);

      if (errors.length > 0) {
        this.logger.warn(
          `Validation failed for message ID ${messageId}. Payload: ${JSON.stringify(
            payload,
          )}. Errors: ${errors.toString()}`,
        );
        // Malformed message, delete to prevent queue blockage and DLQ pollution
        await this.deleteMessage(message.ReceiptHandle, messageId);
        return;
      }
      
      const createdAtDate = new Date(postCreatedEvent.createdAt);

      await this.feedService.fanOutPostToConnections(
        postCreatedEvent.authorId,
        postCreatedEvent.postId,
        createdAtDate,
      );

      this.logger.log(
        `Successfully processed and fanned out post ${postCreatedEvent.postId} for author ${postCreatedEvent.authorId}.`,
      );
      
      await this.deleteMessage(message.ReceiptHandle, messageId);

    } catch (error) {
      this.logger.error(
        `Failed to process message ID ${messageId}. Error: ${error.message}`,
        error.stack,
      );
      // Do NOT delete the message. SQS visibility timeout will expire, allowing a retry.
      // After configured retries, SQS will move it to the DLQ.
    }
  }

  private async deleteMessage(receiptHandle: string, messageId: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      });
      await this.sqsClient.send(command);
      this.logger.log(`Deleted message ID ${messageId} from SQS queue.`);
    } catch (error) {
      this.logger.error(
        `Failed to delete message ID ${messageId} from SQS queue:`,
        error,
      );
      // This is a serious issue, as it may lead to duplicate processing.
      // A monitoring alert should be configured for this log message.
    }
  }
}