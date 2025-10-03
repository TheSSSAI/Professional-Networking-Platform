import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OpenSearchService } from '../../../shared/opensearch/opensearch.service';
import { UserProfileIndexDto } from '../../search/dtos/user-profile-index.dto';

// This interface should ideally be in a shared contracts library
interface IProfileService {
  getFullProfileForIndexing(request: {
    userId: string;
  }): Promise<any>; // Using 'any' as the full DTO is external
}

@Injectable()
export class IndexerService implements OnModuleInit {
  private readonly logger = new Logger(IndexerService.name);
  private profileService: IProfileService;

  constructor(
    private readonly openSearchService: OpenSearchService,
    @Inject('PROFILE_PACKAGE')
    private readonly profileServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.profileService =
      this.profileServiceClient.getService<IProfileService>('ProfileService');
  }

  /**
   * Fetches a user's full profile via gRPC, transforms it, and indexes it into OpenSearch.
   * This is the core logic for the CQRS read-model update.
   * @param userId - The ID of the user to index.
   */
  async indexUserProfile(userId: string): Promise<void> {
    this.logger.log(`Starting indexing process for userId: ${userId}`);
    try {
      // Step 1: Fetch full, up-to-date profile data from the source of truth (Profile Service)
      const fullProfile = await firstValueFrom(
        this.profileService.getFullProfileForIndexing({ userId }),
      );

      if (!fullProfile || !fullProfile.profile) {
        throw new Error(`Profile data not found for userId: ${userId}`);
      }

      // Step 2: Transform the rich DTO from the Profile Service into the denormalized search document
      const searchDocument = this.transformToSearchDocument(fullProfile);

      // Step 3: Index the document into OpenSearch, using the userId as the document ID for idempotency
      await this.openSearchService.indexProfile(searchDocument);

      this.logger.log(`Successfully indexed profile for userId: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to index profile for userId: ${userId}. Error: ${error.message}`,
        error.stack,
      );
      // Re-throw the error to ensure the SQS consumer does not delete the message, allowing for retries.
      throw error;
    }
  }

  /**
   * Deletes a user's profile document from the OpenSearch index.
   * @param userId - The ID of the user to delete from the index.
   */
  async deleteUserProfile(userId: string): Promise<void> {
    this.logger.log(`Starting deletion process for userId: ${userId}`);
    try {
      await this.openSearchService.deleteProfile(userId);
      this.logger.log(
        `Successfully deleted profile from index for userId: ${userId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete profile from index for userId: ${userId}. Error: ${error.message}`,
        error.stack,
      );
      // Re-throw to allow SQS to handle retries/DLQ
      throw error;
    }
  }

  /**
   * Transforms the complex, nested DTO from the Profile Service into a flat,
   * denormalized document suitable for OpenSearch.
   * @param fullProfile - The full profile data from the Profile Service gRPC call.
   * @returns A UserProfileIndexDto object ready for indexing.
   */
  private transformToSearchDocument(fullProfile: any): UserProfileIndexDto {
    const { profile, workExperiences = [], educations = [], skills = [] } = fullProfile;

    const document: UserProfileIndexDto = {
      userId: profile.userId,
      fullName: profile.name,
      headline: profile.headline,
      location: profile.location,
      profilePictureUrl: profile.profilePictureUrl,
      customUrlSlug: profile.customUrlSlug,
      visibility: profile.visibility,
      updatedAt: new Date(profile.updatedAt),
      skills: skills.map((s: any) => s.name),
      workExperience: workExperiences.map((exp: any) => ({
        title: exp.title,
        companyName: exp.company,
      })),
      education: educations.map((edu: any) => ({
        institutionName: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
      })),
    };

    return document;
  }
}