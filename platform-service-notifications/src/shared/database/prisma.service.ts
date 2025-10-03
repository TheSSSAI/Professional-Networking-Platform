import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('Connecting to the database...');
      await this.$connect();
      this.logger.log('Database connection established successfully.');
    } catch (error) {
      this.logger.error('Failed to connect to the database.', error);
      // Depending on the application's needs, we might want to exit the process
      // if a database connection is critical for startup.
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from the database...');
    await this.$disconnect();
    this.logger.log('Database connection closed gracefully.');
  }

  /**
   * A utility function for graceful shutdown, often used in e2e tests
   * or specific shutdown hooks.
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    // The order of deletion matters due to foreign key constraints.
    // Start with models that are dependents of others.
    // This is a sample order, adjust based on your final schema.
    
    // In the context of the messaging service:
    this.logger.log('Cleaning database for test environment...');
    await this.message.deleteMany();
    
    // Prisma requires a bit more work to delete from implicit many-to-many tables.
    // We delete the parent records, and cascade constraints should handle the rest.
    // Assuming `_ConversationToUser` is the implicit join table for `Conversation` and `User`.
    // In a real scenario with a User service, we would not delete users here.
    // But for isolated testing, we might clear conversations.
    await this.conversation.deleteMany();

    this.logger.log('Database cleaned.');
  }
}