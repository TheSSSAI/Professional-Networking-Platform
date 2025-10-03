import {
  Controller,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
  AddEducationCommand,
  AddSkillCommand,
  AddWorkExperienceCommand,
  ConfirmMediaUploadCommand,
  GenerateUploadUrlCommand,
  RemoveEducationCommand,
  RemoveSkillCommand,
  RemoveWorkExperienceCommand,
  UpdateBasicInfoCommand,
  UpdateEducationCommand,
  UpdateWorkExperienceCommand,
} from '../application/commands/impl';
import { GetProfileQuery } from '../application/queries/impl';
import { ProfileOwnerGuard } from './guards/profile-owner.guard';
import { CacheInvalidationInterceptor } from './interceptors/cache-invalidation.interceptor';
import {
  AddEducationRequest,
  AddSkillRequest,
  AddWorkExperienceRequest,
  ConfirmMediaUploadRequest,
  EducationResponse,
  GenerateUploadUrlRequest,
  GetProfileByUserIdRequest,
  IdRequest,
  ProfileResponse,
  RemoveEducationRequest,
  RemoveSkillRequest,
  RemoveWorkExperienceRequest,
  SkillResponse,
  UpdateBasicInfoRequest,
  UpdateEducationRequest,
  UpdateWorkExperienceRequest,
  UploadUrlResponse,
  WorkExperienceResponse,
} from 'src/modules/profile/application/dtos/profile.dto.mapper';
import { Profile } from '../domain/entities/profile.entity';
import { WorkExperience } from '../domain/entities/work-experience.entity';
import { Education } from '../domain/entities/education.entity';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ProfileGrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('ProfileService', 'GetProfileByUserId')
  async getProfileByUserId(
    @Payload() request: GetProfileByUserIdRequest,
  ): Promise<ProfileResponse> {
    const query = new GetProfileQuery(
      request.targetUserId,
      request.requestingUserId,
    );
    const profile: Profile = await this.queryBus.execute(query);
    return Profile.toResponse(profile);
  }

  // --- Basic Info ---
  @GrpcMethod('ProfileService', 'UpdateBasicInfo')
  @UseGuards(ProfileOwnerGuard)
  @UseInterceptors(CacheInvalidationInterceptor)
  async updateBasicInfo(
    @Payload() request: UpdateBasicInfoRequest,
  ): Promise<ProfileResponse> {
    const command = new UpdateBasicInfoCommand(request.userId, {
      name: request.name,
      headline: request.headline,
      location: request.location,
      contactInfo: request.contactInfo
        ? JSON.stringify(request.contactInfo)
        : undefined,
      customUrlSlug: request.customUrlSlug,
      visibility: request.visibility,
    });
    const profile: Profile = await this.commandBus.execute(command);
    return Profile.toResponse(profile);
  }

  // --- Work Experience ---
  @GrpcMethod('ProfileService', 'AddWorkExperience')
  @UseGuards(ProfileOwnerGuard)
  @UseInterceptors(CacheInvalidationInterceptor)
  async addWorkExperience(
    @Payload() request: AddWorkExperienceRequest,
  ): Promise<WorkExperienceResponse> {
    const command = new AddWorkExperienceCommand(request.userId, request);
    const experience: WorkExperience = await this.commandBus.execute(command);
    return WorkExperience.toResponse(experience);
  }

  @GrpcMethod('ProfileService', 'UpdateWorkExperience')
  @UseGuards(ProfileOwnerGuard)
  @UseInterceptors(CacheInvalidationInterceptor)
  async updateWorkExperience(
    @Payload() request: UpdateWorkExperienceRequest,
  ): Promise<WorkExperienceResponse> {
    const command = new UpdateWorkExperienceCommand(
      request.userId,
      request.experienceId,
      request,
    );
    const experience: WorkExperience = await this.commandBus.execute(command);
    return WorkExperience.toResponse(experience);
  }

  @GrpcMethod('ProfileService', 'RemoveWorkExperience')
  @UseGuards(ProfileOwnerGuard)
  @UseInterceptors(CacheInvalidationInterceptor)
  async removeWorkExperience(
    @Payload() request: RemoveWorkExperienceRequest,
  ): Promise<IdResponse> {
    const command = new RemoveWorkExperienceCommand(
      request.userId,
      request.experienceId,
    );
    const id: string = await this.commandBus.execute(command);
    return { id };
  }

  // --- Education ---
  @GrpcMethod('ProfileService', 'AddEducation')
  @UseGuards(ProfileOwnerGuard)
  @UseInterceptors(CacheInvalidationInterceptor)
  async addEducation(
    @Payload() request: AddEducationRequest,
  ): Promise<EducationResponse> {
    const command = new AddEducationCommand(request.userId, request);
    const education: Education = await this.commandBus.execute(command);
    return Education.toResponse(education);
  }

  @GrpcMethod('ProfileService', 'UpdateEducation')
  @UseGuards(ProfileOwnerGuard)
  @UseInterceptors(CacheInvalidationInterceptor)
  async updateEducation(
    @Payload() request: UpdateEducationRequest,
  ): Promise<EducationResponse> {
    const command = new UpdateEducationCommand(
      request.userId,
      request.educationId,
      request,
    );
    const education: Education = await this.commandBus.execute(command);
    return Education.toResponse(education);
  }

  @GrpcMethod('ProfileService', 'RemoveEducation')
  @UseGuards(ProfileOwnerGuard)
  @UseInterceptors(CacheInvalidationInterceptor)
  async removeEducation(
    @Payload() request: RemoveEducationRequest,
  ): Promise<IdResponse> {
    const command = new RemoveEducationCommand(
      request.userId,
      request.educationId,
    );
    const id: string = await this.commandBus.execute(command);
    return { id };
  }

  // --- Skills ---
  @GrpcMethod('ProfileService', 'AddSkill')
  @UseGuards(ProfileOwnerGuard)
  @UseInterceptors(CacheInvalidationInterceptor)
  async addSkill(
    @Payload() request: AddSkillRequest,
  ): Promise<SkillResponse> {
    const command = new AddSkillCommand(request.userId, request.skillName);
    // Assuming the handler returns the updated list of skills or the new skill object
    // For simplicity, let's assume it returns the newly associated skill
    return await this.commandBus.execute(command);
  }

  @GrpcMethod('ProfileService', 'RemoveSkill')
  @UseGuards(ProfileOwnerGuard)
  @UseInterceptors(CacheInvalidationInterceptor)
  async removeSkill(
    @Payload() request: RemoveSkillRequest,
  ): Promise<IdResponse> {
    const command = new RemoveSkillCommand(request.userId, request.skillId);
    const id: string = await this.commandBus.execute(command);
    return { id };
  }

  // --- Media Uploads ---
  @GrpcMethod('ProfileService', 'GenerateProfilePictureUploadUrl')
  @UseGuards(ProfileOwnerGuard)
  async generateProfilePictureUploadUrl(
    @Payload() request: GenerateUploadUrlRequest,
  ): Promise<UploadUrlResponse> {
    const command = new GenerateUploadUrlCommand(
      request.userId,
      'profile-picture',
      request.fileType,
      request.fileSize,
    );
    return this.commandBus.execute(command);
  }

  @GrpcMethod('ProfileService', 'ConfirmProfilePictureUpload')
  @UseGuards(ProfileOwnerGuard)
  @UseInterceptors(CacheInvalidationInterceptor)
  async confirmProfilePictureUpload(
    @Payload() request: ConfirmMediaUploadRequest,
  ): Promise<ProfileResponse> {
    const command = new ConfirmMediaUploadCommand(
      request.userId,
      'profile-picture',
      request.objectKey,
    );
    const profile: Profile = await this.commandBus.execute(command);
    return Profile.toResponse(profile);
  }

  @GrpcMethod('ProfileService', 'GenerateBannerImageUploadUrl')
  @UseGuards(ProfileOwnerGuard)
  async generateBannerImageUploadUrl(
    @Payload() request: GenerateUploadUrlRequest,
  ): Promise<UploadUrlResponse> {
    const command = new GenerateUploadUrlCommand(
      request.userId,
      'banner-image',
      request.fileType,
      request.fileSize,
    );
    return this.commandBus.execute(command);
  }

  @GrpcMethod('ProfileService', 'ConfirmBannerImageUpload')
  @UseGuards(ProfileOwnerGuard)
  @UseInterceptors(CacheInvalidationInterceptor)
  async confirmBannerImageUpload(
    @Payload() request: ConfirmMediaUploadRequest,
  ): Promise<ProfileResponse> {
    const command = new ConfirmMediaUploadCommand(
      request.userId,
      'banner-image',
      request.objectKey,
    );
    const profile: Profile = await this.commandBus.execute(command);
    return Profile.toResponse(profile);
  }
}