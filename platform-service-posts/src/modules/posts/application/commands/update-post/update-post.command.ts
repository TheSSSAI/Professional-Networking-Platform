import {
  IsString,
  IsUUID,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { POST_TEXT_MAX_LENGTH } from 'src/modules/posts/domain/post.aggregate';

export class UpdatePostCommand {
  @IsUUID()
  readonly postId: string;

  @IsUUID()
  readonly userId: string; // The user initiating the update for authorization

  @IsString()
  @IsNotEmpty()
  @MaxLength(POST_TEXT_MAX_LENGTH)
  @IsOptional()
  readonly text?: string;

  // In a real application, you might also include media updates
  // For simplicity, this command only handles text updates as per REQ-1-024

  constructor(postId: string, userId: string, text?: string) {
    this.postId = postId;
    this.userId = userId;
    this.text = text;
  }
}