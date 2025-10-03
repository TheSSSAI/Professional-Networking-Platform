import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PostAggregate } from '../../domain/post.aggregate';
import { PostResponseDto } from '../dtos/post.response.dto';
import { PostMedia } from '../../domain/post-media.entity';
import s3Config from '../../../../config/s3.config';

@Injectable()
export class PostMapper {
  constructor(
    @Inject(s3Config.KEY)
    private readonly s3Configuration: ConfigType<typeof s3Config>,
  ) {}

  public toResponse(aggregate: PostAggregate): PostResponseDto {
    const properties = aggregate.getProps();
    const responseDto = new PostResponseDto();

    responseDto.id = properties.id;
    responseDto.authorId = properties.authorId;
    responseDto.textContent = properties.text;
    responseDto.media = properties.media.map((media: PostMedia) => ({
      id: media.id,
      url: this.constructCdnUrl(media.s3ObjectKey),
      type: media.mediaType,
      order: media.order,
    }));
    responseDto.linkPreview = properties.linkPreview
      ? {
          url: properties.linkPreview.url,
          title: properties.linkPreview.title,
          description: properties.linkPreview.description,
          imageUrl: properties.linkPreview.imageUrl,
        }
      : null;
    responseDto.createdAt = properties.createdAt;
    responseDto.updatedAt = properties.updatedAt;

    return responseDto;
  }

  private constructCdnUrl(objectKey: string): string {
    if (!this.s3Configuration.cdnBaseUrl || !objectKey) {
      return '';
    }
    // Ensure no double slashes between base url and key
    return `${this.s3Configuration.cdnBaseUrl.replace(/\/$/, '')}/${objectKey}`;
  }
}