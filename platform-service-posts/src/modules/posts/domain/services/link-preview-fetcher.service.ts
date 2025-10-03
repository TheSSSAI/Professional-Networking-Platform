import { Inject, Injectable, Logger } from '@nestjs/common';
import { LinkPreview } from 'src/modules/posts/domain/link-preview.value-object';

// This is a simplified regex. A production-ready one might be more complex.
const URL_REGEX = /(https?:\/\/[^\s]+)/;

export const ILinkMetadataFetcherPort = Symbol('ILinkMetadataFetcherPort');

export interface ILinkMetadataFetcherPort {
  fetch(url: string): Promise<{
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
  } | null>;
}

@Injectable()
export class LinkPreviewFetcherService {
  private readonly logger = new Logger(LinkPreviewFetcherService.name);

  constructor(
    @Inject(ILinkMetadataFetcherPort)
    private readonly metadataFetcher: ILinkMetadataFetcherPort,
  ) {}

  async fetchPreview(text: string): Promise<LinkPreview | null> {
    const match = text.match(URL_REGEX);
    if (!match || !match[0]) {
      return null;
    }

    const url = match[0];

    try {
      const metadata = await this.metadataFetcher.fetch(url);
      if (!metadata || !metadata.title) {
        this.logger.warn(`No valid metadata found for URL: ${url}`);
        return null;
      }

      return LinkPreview.create({
        url,
        title: metadata.title,
        description: metadata.description,
        imageUrl: metadata.image,
        siteName: metadata.siteName,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch link preview for URL: ${url}`,
        error.stack,
      );
      // Fail gracefully, link preview is not a critical feature for post creation
      return null;
    }
  }
}