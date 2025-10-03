import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

/**
 * Provides and exports the ConfigService for application-wide use.
 * This module is marked as global to make the ConfigService available
 * in all other modules without needing to import ConfigModule. This is
 * a core module that should be imported once in the root AppModule of
 * the consuming microservice.
 */
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class CoreLibConfigModule {}