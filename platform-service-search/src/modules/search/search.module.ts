import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { OpenSearchModule } from '../../shared/opensearch/opensearch.module';
import { ConnectionsClientModule } from '../../shared/grpc-clients/connections/connections-client.module';
import { redisStore } from 'cache-manager-redis-yet';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_TTL_SECONDS: Joi.number().default(300),
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('CacheModule');
        const host = configService.get<string>('REDIS_HOST');
        const port = configService.get<number>('REDIS_PORT');
        const ttl = configService.get<number>('REDIS_TTL_SECONDS');

        logger.log(`Configuring Redis cache connection to ${host}:${port}`);

        const store = await redisStore({
          socket: {
            host: host,
            port: port,
          },
          ttl: ttl * 1000, // ttl in milliseconds
        });

        return {
          store: () => store,
        };
      },
      inject: [ConfigService],
    }),
    OpenSearchModule,
    ConnectionsClientModule,
  ],
  controllers: [SearchController],
  providers: [SearchService, Logger],
})
export class SearchModule {}