import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * A global module that provides and exports the PrismaService.
 * By marking it as @Global(), the PrismaService becomes available
 * application-wide without needing to import PrismaModule in every feature module.
 * This is a common pattern for foundational services like database connections.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}