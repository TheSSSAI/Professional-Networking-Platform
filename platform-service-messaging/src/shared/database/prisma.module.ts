import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * A global module that provides and exports the PrismaService.
 * By making this module global, the PrismaService becomes available
 * for injection in any other module of the application without needing
 * to import PrismaModule explicitly. This is a common pattern for
 * foundational, singleton services like a database connection manager.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}