import { AggregateRoot } from '@nestjs/cqrs';
import { ulid } from 'ulid';
import {
  PostMedia,
  PostMediaProps,
} from 'src/modules/posts/domain/post-media.entity';
import { LinkPreview } from 'src/modules/posts/domain/link-preview.value-object';
import { PostCreatedEvent } from 'src/modules/posts/domain/events/post-created.event';
import { PostDeletedEvent } from 'src/modules/posts/domain/events/post-deleted.event';
import { DomainError } from 'src/core/errors/domain.error';

export const POST_TEXT_MAX_LENGTH = 3000;
export const POST_MEDIA_MAX_COUNT = 4;

export interface PostProps {
  id: string;
  authorId: string;
  text: string;
  media: PostMedia[];
  linkPreview: LinkPreview | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PostAggregate extends AggregateRoot implements PostProps {
  id: string;
  authorId: string;
  text: string;
  media: PostMedia[];
  linkPreview: LinkPreview | null;
  createdAt: Date;
  updatedAt: Date;

  private constructor(props: PostProps) {
    super();
    Object.assign(this, props);
  }

  public static create(props: {
    authorId: string;
    text: string;
    mediaProps?: Omit<PostMediaProps, 'postId'>[];
    linkPreview?: LinkPreview;
  }): PostAggregate {
    this.validateText(props.text);
    this.validateMediaCount(props.mediaProps);

    const postId = ulid();
    const media =
      props.mediaProps?.map((mediaProp) =>
        PostMedia.create({ ...mediaProp, postId }),
      ) || [];

    const post = new PostAggregate({
      id: postId,
      authorId: props.authorId,
      text: props.text,
      media: media,
      linkPreview: props.linkPreview || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    post.apply(new PostCreatedEvent(post.id, post.authorId, post.createdAt));

    return post;
  }

  public updateText(newText: string): void {
    PostAggregate.validateText(newText);
    this.text = newText;
    this.updatedAt = new Date();
  }

  public updateMedia(
    newMediaProps: Omit<PostMediaProps, 'postId'>[],
  ): void {
    PostAggregate.validateMediaCount(newMediaProps);
    this.media = newMediaProps.map((mediaProp) =>
      PostMedia.create({ ...mediaProp, postId: this.id }),
    );
    this.updatedAt = new Date();
  }

  public setLinkPreview(linkPreview: LinkPreview | null): void {
    this.linkPreview = linkPreview;
    this.updatedAt = new Date();
  }

  public delete(): void {
    this.apply(new PostDeletedEvent(this.id, this.authorId, this.media));
  }

  private static validateText(text: string): void {
    if (text.length > POST_TEXT_MAX_LENGTH) {
      throw new DomainError(
        `Post text cannot exceed ${POST_TEXT_MAX_LENGTH} characters.`,
      );
    }
  }

  private static validateMediaCount(
    media?: Omit<PostMediaProps, 'postId'>[],
  ): void {
    if (media && media.length > POST_MEDIA_MAX_COUNT) {
      throw new DomainError(
        `A post cannot have more than ${POST_MEDIA_MAX_COUNT} media items.`,
      );
    }
  }

  public static fromPrimitives(props: PostProps): PostAggregate {
    const mediaEntities = props.media.map((m) => PostMedia.fromPrimitives(m));
    const linkPreview = props.linkPreview
      ? LinkPreview.fromPrimitives(props.linkPreview)
      : null;

    return new PostAggregate({
      ...props,
      media: mediaEntities,
      linkPreview: linkPreview,
    });
  }
}