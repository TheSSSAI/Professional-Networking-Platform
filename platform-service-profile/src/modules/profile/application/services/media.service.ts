import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../../../domain/interfaces/profile-repository.interface';
import { IStorageClient } from '../../../domain/interfaces/storage-client.interface';
import {
  GenerateUploadUrlCommand,
  GenerateUploadUrlResponse,
} from '../commands/generate-upload-url.command';
import {
  ConfirmMediaUploadCommand,
  ConfirmMediaUploadResponse,
} from '../commands/confirm-media-upload.command';
import { ProfileNotFoundException } from '../../../domain/exceptions/profile-not-found.exception';
import { InvalidMediaException } from '../../../domain/exceptions/invalid-media.exception';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Profile } from '../../../domain/entities/profile.entity';

@Injectable()
export class MediaService {
  private readonly cdnBaseUrl: string;

  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IStorageClient')
    private readonly storageClient: IStorageClient,
    private readonly configService: ConfigService,
  ) {
    this.cdnBaseUrl = this.configService.get<string>('CDN_BASE_URL', '');
  }

  /**
   * Generates a pre-signed URL for a client to upload a file directly to object storage.
   * Implements the flow from sequence diagram ID 250.
   * @param command - Contains userId, fileType, and fileSize.
   * @returns A response object with the pre-signed URL and a unique object key.
   * @throws {InvalidMediaException} if the file metadata does not meet requirements.
   */
  async generateUploadUrl(
    command: GenerateUploadUrlCommand,
  ): Promise<GenerateUploadUrlResponse> {
    const { userId, fileType, fileSize, mediaType } = command;

    this.validateFileMetadata(fileType, fileSize);

    const extension = fileType === 'image/jpeg' ? 'jpg' : 'png';
    const objectKey = `profiles/${userId}/${mediaType}/${uuidv4()}.${extension}`;

    const uploadUrl = await this.storageClient.getPresignedPutUrl(
      objectKey,
      fileType,
    );

    return { uploadUrl, objectKey };
  }

  /**
   * Confirms that a media file has been successfully uploaded and updates the user's profile.
   * Implements the final step from sequence diagram ID 250.
   * @param command - Contains userId, objectKey, and mediaType.
   * @returns A response object with success status and the final CDN URL.
   * @throws {ProfileNotFoundException} if the user's profile doesn't exist.
   */
  async confirmMediaUpload(
    command: ConfirmMediaUploadCommand,
  ): Promise<ConfirmMediaUploadResponse> {
    const { userId, objectKey, mediaType } = command;

    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new ProfileNotFoundException(`Profile for user ${userId} not found`);
    }

    const cdnUrl = this.constructCdnUrl(objectKey);

    if (mediaType === 'picture') {
      profile.updateProfilePicture(cdnUrl);
    } else if (mediaType === 'banner') {
      profile.updateBannerImage(cdnUrl);
    }

    await this.profileRepository.save(profile);
    profile.commit();

    return { success: true, cdnUrl };
  }

  private validateFileMetadata(fileType: string, fileSize: number): void {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(fileType)) {
      throw new InvalidMediaException(
        'Invalid file type. Only JPEG or PNG are allowed.',
      );
    }

    if (fileSize > maxSize) {
      throw new InvalidMediaException('File size exceeds the 5MB limit.');
    }
  }

  private constructCdnUrl(objectKey: string): string {
    if (!this.cdnBaseUrl) {
      // Fallback or error for misconfiguration, in a real app this should be stricter
      console.warn('CDN_BASE_URL is not configured.');
      // This might return a direct S3 URL in dev, but for prod, a CDN is a must.
      return `https://${this.configService.get(
        'AWS_S3_BUCKET_NAME',
      )}.s3.amazonaws.com/${objectKey}`;
    }
    return `${this.cdnBaseUrl}/${objectKey}`;
  }
}