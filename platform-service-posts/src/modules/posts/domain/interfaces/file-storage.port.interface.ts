export interface PresignedUrlPayload {
  userId: string;
  fileType: 'image/jpeg' | 'image/png';
  fileSize: number; // in bytes
}

export interface PresignedUrlResponse {
  /**
   * The secure, time-limited URL that the client can use to upload the file directly.
   */
  uploadUrl: string;
  /**
   * The unique key (path) of the object in the storage bucket. This is what should be stored in the database.
   */
  objectKey: string;
}

/**
 * Interface (Port) for a File Storage service.
 * This abstracts the underlying object storage technology (e.g., AWS S3, Google Cloud Storage)
 * from the domain and application layers. It defines the contract for operations
 * related to storing and deleting media files associated with posts.
 */
export abstract class IFileStoragePort {
  /**
   * Generates a secure, pre-signed URL that allows a client to upload a file directly
   * to the object storage service. This offloads the file transfer from the application server.
   * The implementation must validate the payload against business rules (file size, type).
   *
   * @param payload The details of the file to be uploaded.
   * @returns A Promise that resolves to an object containing the upload URL and the unique object key.
   */
  abstract generatePresignedUploadUrl(
    payload: PresignedUrlPayload,
  ): Promise<PresignedUrlResponse>;

  /**
   * Permanently deletes a file from the object storage service.
   * This is typically called asynchronously after a post and its associated media are deleted.
   *
   * @param objectKey The unique key of the object to be deleted.
   * @returns A Promise that resolves when the deletion is complete.
   */
  abstract deleteFile(objectKey: string): Promise<void>;
}