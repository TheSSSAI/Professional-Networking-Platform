import { IsUUID } from 'class-validator';

export class DeletePostCommand {
  @IsUUID()
  readonly postId: string;

  @IsUUID()
  readonly userId: string; // The user initiating the deletion for authorization

  constructor(postId: string, userId: string) {
    this.postId = postId;
    this.userId = userId;
  }
}