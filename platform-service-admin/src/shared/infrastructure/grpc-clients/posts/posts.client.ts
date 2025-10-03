import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, catchError, throwError, timeout } from 'rxjs';

// These interfaces would typically be generated from a .proto file
// and placed in a shared contracts library.
interface PostsServiceClient {
  deletePostAsAdmin(request: DeletePostAsAdminRequest): Promise<StatusResponse>;
}

interface DeletePostAsAdminRequest {
  postId: string;
  adminId: string;
}

interface StatusResponse {
  success: boolean;
  message?: string;
}

/**
 * A client service to interact with the Posts microservice via gRPC.
 * It abstracts the low-level gRPC client proxy and provides a clean,
 * Promise-based interface for the application layer.
 */
@Injectable()
export class PostsClient implements OnModuleInit {
  private postsService: PostsServiceClient;
  private readonly timeoutMs = 5000; // 5 seconds

  constructor(@Inject('POSTS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.postsService =
      this.client.getService<PostsServiceClient>('PostsService');
  }

  /**
   * Sends a command to delete a post as an administrator.
   * @param {DeletePostAsAdminRequest} request - The delete post request payload.
   * @returns {Promise<StatusResponse>} The status response from the Posts service.
   */
  async deletePostAsAdmin(
    request: DeletePostAsAdminRequest,
  ): Promise<StatusResponse> {
    return firstValueFrom(
      this.postsService.deletePostAsAdmin(request).pipe(
        timeout(this.timeoutMs),
        catchError((err) =>
          throwError(
            () =>
              new Error(
                `gRPC call to PostsService.deletePostAsAdmin failed: ${
                  err.details || err.message
                }`,
              ),
          ),
        ),
      ),
    );
  }
}