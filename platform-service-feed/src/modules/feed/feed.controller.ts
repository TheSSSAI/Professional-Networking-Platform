import {
  Controller,
  Inject,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { IFeedService } from './interfaces/feed.service.interface';
import { GetFeedRequestDto } from './dto/get-feed-request.dto';
import { FeedResponseDto } from './dto/feed-response.dto';
import { RpcExceptionFilter } from '../../shared/filters/rpc-exception.filter';
import { FeedOwnerGuard } from '../../shared/guards/feed-owner.guard';

@Controller()
@UseFilters(new RpcExceptionFilter())
export class FeedController {
  constructor(
    @Inject(IFeedService) private readonly feedService: IFeedService,
  ) {}

  /**
   * Retrieves the personalized feed for a given user.
   * This gRPC method is protected by the FeedOwnerGuard to ensure
   * a user can only request their own feed.
   *
   * @param request - The DTO containing the user ID and pagination options.
   * @returns A promise that resolves to a FeedResponseDto containing post IDs.
   * @throws RpcException with PERMISSION_DENIED if the authenticated user
   *         does not match the requested userId.
   * @throws RpcException with INVALID_ARGUMENT if the request DTO fails validation.
   */
  @GrpcMethod('FeedService', 'GetFeed')
  @UseGuards(FeedOwnerGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getFeed(request: GetFeedRequestDto): Promise<FeedResponseDto> {
    const { userId, page, limit } = request;
    const { postIds } = await this.feedService.getFeed(userId, page, limit);

    return { postIds };
  }
}