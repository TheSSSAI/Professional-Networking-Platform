import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { IFileStoragePort } from '../../domain/interfaces/file-storage.port.interface';

@Injectable()
export class S3FileStorageAdapter implements IFileStoragePort {
  private readonly logger = new Logger(S3FileStorageAdapter.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly cdnBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    this.cdnBaseUrl = this.configService.get<string>('CDN_BASE_URL');

    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    if (!region || !accessKeyId || !secretAccessKey || !this.bucketName) {
      throw new Error('AWS S3 configuration is incomplete.');
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async generatePresignedUploadUrl(
    userId: string,
    contentType: 'image/jpeg' | 'image/png',
  ): Promise<{ uploadUrl: string; objectKey: string }> {
    const fileExtension = contentType === 'image/jpeg' ? 'jpg' : 'png';
    const objectKey = `posts/${userId}/${uuidv4()}.${fileExtension}`;

    this.logger.log(
      `Generating pre-signed URL for object key: ${objectKey} in bucket: ${this.bucketName}`,
    );

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        ContentType: contentType,
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 300, // 5 minutes
      });

      return { uploadUrl, objectKey };
    } catch (error) {
      this.logger.error(
        `Failed to generate pre-signed URL for user ${userId}`,
        error.stack,
      );
      throw new Error('Could not generate secure upload URL.');
    }
  }

  async deleteFile(objectKey: string): Promise<void> {
    this.logger.log(
      `Deleting file with object key: ${objectKey} from bucket: ${this.bucketName}`,
    );

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
      });
      await this.s3Client.send(command);
      this.logger.log(`Successfully deleted file: ${objectKey}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete file from S3: ${objectKey}`,
        error.stack,
      );
      // Do not re-throw error for async cleanup, but log it critically.
      // In a real system, this might go to a dead-letter queue for retry.
    }
  }

  getCdnUrl(objectKey: string): string {
    return `${this.cdnBaseUrl}/${objectKey}`;
  }
}