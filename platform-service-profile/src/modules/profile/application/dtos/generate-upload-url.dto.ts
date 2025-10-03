import {
  IsIn,
  IsNumber,
  Max,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export enum UploadType {
  PROFILE_PICTURE = 'PROFILE_PICTURE',
  BANNER_IMAGE = 'BANNER_IMAGE',
}

export class GenerateUploadUrlDto {
  /**
   * The type of media being uploaded.
   * Must be either PROFILE_PICTURE or BANNER_IMAGE.
   * @example 'PROFILE_PICTURE'
   */
  @IsEnum(UploadType)
  @IsNotEmpty()
  uploadType: UploadType;

  /**
   * The MIME type of the file to be uploaded.
   * Must be either 'image/jpeg' or 'image/png'.
   * @example 'image/jpeg'
   */
  @IsIn(['image/jpeg', 'image/png'])
  @IsString()
  @IsNotEmpty()
  fileType: string;

  /**
   * The size of the file in bytes.
   * Must not exceed 5MB (5 * 1024 * 1024 = 5242880 bytes).
   * @example 2048000
   */
  @IsNumber()
  @Max(5242880, { message: 'File size cannot exceed 5MB.' })
  fileSize: number;
}