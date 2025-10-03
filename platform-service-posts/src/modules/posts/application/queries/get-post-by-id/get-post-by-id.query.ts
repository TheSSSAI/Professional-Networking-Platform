import { IsUUID } from 'class-validator';

export class GetPostByIdQuery {
  @IsUUID()
  readonly postId: string;

  @IsUUID()
  readonly viewerId: string; // The ID of the user viewing the post for visibility checks

  constructor(postId: string, viewerId: string) {
    this.postId = postId;
    this.viewerId = viewerId;
  }
}