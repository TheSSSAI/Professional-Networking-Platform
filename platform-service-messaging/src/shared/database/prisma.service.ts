import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

/**
 * @class PrismaService
 * @description A service that provides a singleton instance of the Prisma client.
 * It extends the PrismaClient and implements NestJS lifecycle hooks to manage
 * the database connection gracefully.
 * This service is intended to be provided and injected throughout the application
 * to interact with the PostgreSQL database.
 * It is configured to log database queries in development environments for debugging purposes.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    const nodeEnv = configService.get<string>('NODE_ENV');
    super({
      log:
        nodeEnv === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['warn', 'error'],
    });
    this.logger.log('PrismaService initialized');
  }

  /**
   * @method onModuleInit
   * @description NestJS lifecycle hook that connects to the database when the module is initialized.
   * This ensures that the application does not start accepting requests until a database
   * connection is established.
   */
  async onModuleInit() {
    this.logger.log('Connecting to the database...');
    try {
      await this.$connect();
      this.logger.log('Database connection established successfully.');
    } catch (error) {
      this.logger.error('Failed to connect to the database.', error.stack);
      // Depending on the application's needs, we might want to exit the process
      // if the database connection fails on startup.
      process.exit(1);
    }
  }

  /**
   * @method onModuleDestroy
   * @description NestJS lifecycle hook that disconnects from the database when the application is shutting down.
   * This ensures a graceful shutdown and prevents resource leaks.
   */
  async onModuleDestroy() {
    this.logger.log('Disconnecting from the database...');
    try {
      await this.$disconnect();
      this.logger.log('Database connection closed successfully.');
    } catch (error) {
      this.logger.error('Failed to disconnect from the database.', error.stack);
    }
  }
}