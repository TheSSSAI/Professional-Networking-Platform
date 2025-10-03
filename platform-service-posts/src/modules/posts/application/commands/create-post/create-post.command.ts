import {
  IsString,
  IsUUID,
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { POST_TEXT_MAX_LENGTH, POST_MEDIA_MAX_COUNT } from 'src/modules/posts/domain/post.aggregate';

class MediaInput {
  @IsString()
  @IsNotEmpty()
  key: string; // S3 Object Key

  @IsString()
  @IsNotEmpty()
  mimetype: string;
}

export class CreatePostCommand {
  @IsUUID()
  readonly authorId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(POST_TEXT_MAX_LENGTH)
  readonly text: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(POST_MEDIA_MAX_COUNT)
  @ValidateNested({ each: true })
  @Type(() => MediaInput)
  readonly media?: MediaInput[];

  constructor(authorId: string, text: string, media?: MediaInput[]) {
    this.authorId = authorId;
    this.text = text;
    this.media = media;
  }
}