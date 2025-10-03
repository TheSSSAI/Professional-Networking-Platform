import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import { IndexerService } from './services/indexer.service';
import { ProfileEventsConsumer } from './consumers/profile-events.consumer';
import { ProfileClientModule } from '../../shared/grpc-clients/profile/profile-client.module';
import { OpenSearchModule } from '../../shared/opensearch/opensearch.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        PROFILE_EVENTS_QUEUE_URL: Joi.string().required(),
        PROFILE_EVENTS_QUEUE_NAME: Joi.string().default('profile-events'),
      }),
    }),
    SqsModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('SqsModule');
        const region = configService.get<string>('AWS_REGION');
        const queueUrl = configService.get<string>('PROFILE_EVENTS_QUEUE_URL');

        logger.log(
          `Configuring SQS consumer for queue URL: ${queueUrl} in region: ${region}`,
        );

        return {
          consumers: [
            {
              name: configService.get<string>('PROFILE_EVENTS_QUEUE_NAME'),
              queueUrl: queueUrl,
              region: region,
              batchSize: 10,
              waitTimeSeconds: 20,
            },
          ],
          producers: [],
        };
      },
      inject: [ConfigService],
    }),
    ProfileClientModule,
    OpenSearchModule,
  ],
  controllers: [],
  providers: [IndexerService, ProfileEventsConsumer, Logger],
})
export class IndexerModule {}