import { URL } from 'url';

/**
 * @interface LinkPreviewProps
 * @description Properties for creating a LinkPreview value object.
 */
export interface LinkPreviewProps {
  url: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
}

/**
 * @class LinkPreview
 * @classdesc Represents a link preview as a Value Object in Domain-Driven Design.
 * It is immutable and defined by its attributes.
 * As per REQ-1-019, this is generated for external URLs in posts.
 */
export class LinkPreview {
  public readonly url: string;
  public readonly title: string | null;
  public readonly description: string | null;
  public readonly imageUrl: string | null;

  private constructor(props: LinkPreviewProps) {
    this.url = props.url;
    this.title = props.title;
    this.description = props.description;
    this.imageUrl = props.imageUrl;
  }

  /**
   * @static
   * @method create
   * @description Factory method to create a new LinkPreview instance.
   * Enforces domain invariants, such as ensuring the URL is valid.
   * @param {LinkPreviewProps} props - The properties for the link preview.
   * @returns {LinkPreview} A new LinkPreview instance.
   * @throws {Error} if the URL is invalid.
   */
  public static create(props: LinkPreviewProps): LinkPreview {
    if (!this.isValidUrl(props.url)) {
      throw new Error('Invalid URL provided for link preview.');
    }

    const trimmedProps: LinkPreviewProps = {
      url: props.url.trim(),
      title: props.title ? props.title.trim() : null,
      description: props.description ? props.description.trim() : null,
      imageUrl: props.imageUrl ? props.imageUrl.trim() : null,
    };

    const linkPreview = new LinkPreview(trimmedProps);
    // Freezing the object to enforce immutability, a core concept of Value Objects.
    Object.freeze(linkPreview);
    return linkPreview;
  }

  /**
   * @private
   * @static
   * @method isValidUrl
   * @description Validates if a given string is a valid HTTP/HTTPS URL.
   * @param {string} urlString - The string to validate.
   * @returns {boolean} True if the URL is valid, false otherwise.
   */
  private static isValidUrl(urlString: string): boolean {
    if (!urlString) {
      return false;
    }
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (error) {
      return false;
    }
  }

  /**
   * @method equals
   * @description Compares this value object with another for equality.
   * Two LinkPreview objects are equal if all their properties are the same.
   * @param {LinkPreview} other - The other LinkPreview object to compare with.
   * @returns {boolean} True if they are equal, false otherwise.
   */
  public equals(other?: LinkPreview): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (other.constructor.name !== this.constructor.name) {
      return false;
    }
    return (
      this.url === other.url &&
      this.title === other.title &&
      this.description === other.description &&
      this.imageUrl === other.imageUrl
    );
  }
}