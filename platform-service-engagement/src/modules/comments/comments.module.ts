import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommentsController } from './presentation/comments.controller';
import { AddCommentHandler } from './application/commands/add-comment/add-comment.handler';
import { EditCommentHandler } from './application/commands/edit-comment/edit-comment.handler';
import { DeleteCommentHandler } from './application/commands/delete-comment/delete-comment.handler';
import { ICommentsRepository } from './domain/i-comments.repository';
import { CommentsPrismaRepository } from './infrastructure/repositories/comments.prisma.repository';

const CommandHandlers = [
  AddCommentHandler,
  EditCommentHandler,
  DeleteCommentHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [CommentsController],
  providers: [
    ...CommandHandlers,
    {
      provide: ICommentsRepository,
      useClass: CommentsPrismaRepository,
    },
  ],
})
export class CommentsModule {}