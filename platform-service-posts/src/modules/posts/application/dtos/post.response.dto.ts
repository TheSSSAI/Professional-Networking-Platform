interface LinkPreviewDto {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  siteName?: string;
}

interface MediaDto {
  url: string; // Full CDN URL
  type: string;
  order: number;
}

interface AuthorDto {
  id: string;
  name: string;
  headline: string;
  profilePictureUrl?: string;
}

export class PostResponseDto {
  id: string;
  author: AuthorDto;
  text: string;
  media: MediaDto[];
  linkPreview: LinkPreviewDto | null;
  createdAt: Date;
  updatedAt: Date;
  // In a real application, you'd also include reaction and comment counts
  // These would be enriched from the Engagement Service
  // reactionCount: number;
  // commentCount: number;
}