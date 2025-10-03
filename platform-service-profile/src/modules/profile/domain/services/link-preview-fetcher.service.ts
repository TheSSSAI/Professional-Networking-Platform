import { Inject, Injectable, Logger } from '@nestjs/common';
import { ILinkMetadataFetcher } from '../interfaces/link-metadata-fetcher.interface';

export interface LinkPreviewData {
  url: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  siteName?: string;
}

@Injectable()
export class LinkPreviewFetcherService {
  private readonly logger = new Logger(LinkPreviewFetcherService.name);

  constructor(
    @Inject('ILinkMetadataFetcher')
    private readonly metadataFetcher: ILinkMetadataFetcher,
  ) {}

  /**
   * Fetches metadata for a given URL to generate a link preview.
   * This service acts as a domain-level orchestrator, delegating the actual
   * HTTP fetching to an infrastructure implementation of ILinkMetadataFetcher.
   * It handles basic validation and error suppression.
   *
   * @param {string} url - The URL to fetch metadata from.
   * @returns {Promise<LinkPreviewData | null>} The fetched preview data, or null if fetching fails.
   */
  async fetchPreview(url: string): Promise<LinkPreviewData | null> {
    if (!this.isValidUrl(url)) {
      this.logger.warn(`Invalid URL format provided for link preview: ${url}`);
      return null;
    }

    try {
      const metadata = await this.metadataFetcher.fetch(url);
      if (!metadata.title) {
        this.logger.log(
          `No title found for URL ${url}. Skipping preview generation.`,
        );
        return null;
      }
      return {
        url,
        title: metadata.title,
        description: metadata.description,
        imageUrl: metadata.image,
        siteName: metadata.siteName,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch link preview for URL: ${url}. Error: ${error.message}`,
      );
      // Fail gracefully without throwing, as link previews are non-critical.
      return null;
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      // Basic regex to ensure it's a plausible http/https URL
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i',
      );
      return !!pattern.test(url);
    } catch (_) {
      return false;
    }
  }
}