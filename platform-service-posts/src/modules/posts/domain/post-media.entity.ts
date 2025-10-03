import { v4 as uuidv4 } from 'uuid';

/**
 * @interface PostMediaProps
 * @description Properties that define a PostMedia entity.
 */
export interface PostMediaProps {
  id: string;
  postId: string;
  s3ObjectKey: string;
  mediaType: 'image/jpeg' | 'image/png';
  order: number;
}

/**
 * @interface CreatePostMediaProps
 * @description Properties required to create a new PostMedia entity. The ID is generated automatically.
 */
export type CreatePostMediaProps = Omit<PostMediaProps, 'id'>;

/**
 * @class PostMedia
 * @classdesc Represents a media item (e.g., an image) attached to a post.
 * This is an Entity within the Post aggregate.
 * It enforces business rules from REQ-1-019 (file types) and REQ-1-072 (S3 storage).
 */
export class PostMedia {
  public readonly id: string;
  public readonly postId: string;
  public readonly s3ObjectKey: string;
  public readonly mediaType: 'image/jpeg' | 'image/png';
  public readonly order: number;

  private constructor(props: PostMediaProps) {
    this.id = props.id;
    this.postId = props.postId;
    this.s3ObjectKey = props.s3ObjectKey;
    this.mediaType = props.mediaType;
    this.order = props.order;
  }

  /**
   * @static
   * @method create
   * @description Factory method to create a new PostMedia instance.
   * This method ensures that new media entities are always valid.
   * @param {CreatePostMediaProps} props - The properties for creating the media entity.
   * @returns {PostMedia} A new, valid PostMedia instance.
   * @throws {Error} if any validation rule is violated.
   */
  public static create(props: CreatePostMediaProps): PostMedia {
    this.validate(props);
    const id = uuidv4();
    return new PostMedia({ ...props, id });
  }

  /**
   * @private
   * @static
   * @method validate
   * @description Validates the properties of a PostMedia entity before creation.
   * @param {CreatePostMediaProps} props - The properties to validate.
   * @throws {Error} with a descriptive message if validation fails.
   */
  private static validate(props: CreatePostMediaProps): void {
    if (!props.postId) {
      throw new Error('PostMedia must be associated with a post (postId is required).');
    }
    if (!props.s3ObjectKey || props.s3ObjectKey.trim() === '') {
      throw new Error('PostMedia must have a valid S3 object key.');
    }
    if (props.mediaType !== 'image/jpeg' && props.mediaType !== 'image/png') {
      throw new Error('Invalid media type. Only image/jpeg and image/png are supported.');
    }
    if (props.order === null || props.order === undefined || props.order < 0) {
      throw new Error('PostMedia must have a valid, non-negative order.');
    }
  }

  /**
   * @method equals
   * @description Compares this entity with another for equality based on their unique ID.
   * @param {PostMedia} other - The other PostMedia entity to compare with.
   * @returns {boolean} True if they are the same entity, false otherwise.
   */
  public equals(other?: PostMedia): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (other.constructor.name !== this.constructor.name) {
        return false;
    }
    return this.id === other.id;
  }
}