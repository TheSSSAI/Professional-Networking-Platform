import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AddEndorsementHandler } from './application/commands/add-endorsement/add-endorsement.handler';
import { IEndorsementsRepository } from './domain/i-endorsements.repository';
import { EndorsementsPrismaRepository } from './infrastructure/repositories/endorsements.prisma.repository';
// Assuming EndorsementsController exists at presentation layer to handle gRPC calls for endorsements
// based on the architectural pattern established by the Comments module.
// e.g., import { EndorsementsController } from './presentation/endorsements.controller';

const CommandHandlers = [AddEndorsementHandler];

@Module({
  imports: [CqrsModule],
  // controllers: [EndorsementsController], // This would be uncommented when EndorsementsController is generated.
  providers: [
    ...CommandHandlers,
    {
      provide: IEndorsementsRepository,
      useClass: EndorsementsPrismaRepository,
    },
  ],
})
export class EndorsementsModule {}