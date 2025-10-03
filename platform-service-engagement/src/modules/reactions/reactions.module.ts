import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AddReactionHandler } from './application/commands/add-reaction/add-reaction.handler';
import { IReactionsRepository } from './domain/i-reactions.repository';
import { ReactionsPrismaRepository } from './infrastructure/repositories/reactions.prisma.repository';
// Assuming ReactionsController exists at presentation layer to handle gRPC calls for reactions
// based on the architectural pattern established by the Comments module.
// e.g., import { ReactionsController } from './presentation/reactions.controller';

const CommandHandlers = [AddReactionHandler];

@Module({
  imports: [CqrsModule],
  // controllers: [ReactionsController], // This would be uncommented when ReactionsController is generated.
  providers: [
    ...CommandHandlers,
    {
      provide: IReactionsRepository,
      useClass: ReactionsPrismaRepository,
    },
  ],
})
export class ReactionsModule {}