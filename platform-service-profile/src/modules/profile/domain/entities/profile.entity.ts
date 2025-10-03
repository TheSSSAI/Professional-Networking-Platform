import { AggregateRoot } from '@nestjs/cqrs';
import { Visibility } from '../value-objects/visibility.enum';
import { Education } from './education.entity';
import { WorkExperience } from './work-experience.entity';
import { UserProfileSkill } from './user-profile-skill.entity';
import { ProfileUpdatedEvent } from '../events/profile-updated.event';
import { v4 as uuidv4 } from 'uuid';
import { UpdateBasicInfoDto } from '../../application/dtos/update-basic-info.dto';
import { AddWorkExperienceDto } from '../../application/dtos/add-work-experience.dto';
import { AddEducationDto } from '../../application/dtos/add-education.dto';

interface ProfileProps {
  userId: string;
  name: string;
  headline?: string | null;
  location?: string | null;
  contactDetails?: Record<string, any> | null;
  profilePictureUrl?: string | null;
  bannerImageUrl?: string | null;
  customUrlSlug?: string | null;
  visibility: Visibility;
  workExperiences?: WorkExperience[];
  educations?: Education[];
  skills?: UserProfileSkill[];
}

export class Profile extends AggregateRoot {
  private _userId: string;
  private _name: string;
  private _headline: string | null;
  private _location: string | null;
  private _contactDetails: Record<string, any> | null;
  private _profilePictureUrl: string | null;
  private _bannerImageUrl: string | null;
  private _customUrlSlug: string | null;
  private _visibility: Visibility;
  private _workExperiences: WorkExperience[];
  private _educations: Education[];
  private _skills: UserProfileSkill[];

  private constructor() {
    super();
  }

  // Getters
  get userId(): string {
    return this._userId;
  }
  get name(): string {
    return this._name;
  }
  get headline(): string | null {
    return this._headline;
  }
  get location(): string | null {
    return this._location;
  }
  get contactDetails(): Record<string, any> | null {
    return this._contactDetails;
  }
  get profilePictureUrl(): string | null {
    return this._profilePictureUrl;
  }
  get bannerImageUrl(): string | null {
    return this._bannerImageUrl;
  }
  get customUrlSlug(): string | null {
    return this._customUrlSlug;
  }
  get visibility(): Visibility {
    return this._visibility;
  }
  get workExperiences(): readonly WorkExperience[] {
    return this._workExperiences;
  }
  get educations(): readonly Education[] {
    return this._educations;
  }
  get skills(): readonly UserProfileSkill[] {
    return this._skills;
  }

  public isPublic(): boolean {
    return this._visibility === Visibility.PUBLIC;
  }

  public isPrivate(): boolean {
    return this._visibility === Visibility.PRIVATE;
  }

  public static create(props: {
    userId: string;
    name: string;
    contactDetails?: Record<string, any>;
  }): Profile {
    const profile = new Profile();
    profile._userId = props.userId;
    profile._name = props.name;
    profile._contactDetails = props.contactDetails || null;
    profile._visibility = Visibility.PUBLIC; // Default visibility
    profile._workExperiences = [];
    profile._educations = [];
    profile._skills = [];
    return profile;
  }

  public static fromPrimitives(props: ProfileProps): Profile {
    const profile = new Profile();
    profile._userId = props.userId;
    profile._name = props.name;
    profile._headline = props.headline ?? null;
    profile._location = props.location ?? null;
    profile._contactDetails = props.contactDetails ?? null;
    profile._profilePictureUrl = props.profilePictureUrl ?? null;
    profile._bannerImageUrl = props.bannerImageUrl ?? null;
    profile._customUrlSlug = props.customUrlSlug ?? null;
    profile._visibility = props.visibility;
    profile._workExperiences = props.workExperiences?.map(WorkExperience.fromPrimitives) || [];
    profile._educations = props.educations?.map(Education.fromPrimitives) || [];
    profile._skills = props.skills?.map(UserProfileSkill.fromPrimitives) || [];

    return profile;
  }

  public updateBasicInfo(data: Partial<UpdateBasicInfoDto>): void {
    if (data.name !== undefined) this._name = data.name;
    if (data.headline !== undefined) this._headline = data.headline;
    if (data.location !== undefined) this._location = data.location;
    if (data.contactDetails !== undefined)
      this._contactDetails = data.contactDetails;
    if (data.customUrlSlug !== undefined)
      this._customUrlSlug = data.customUrlSlug;
    if (data.visibility !== undefined) this._visibility = data.visibility;

    this.apply(new ProfileUpdatedEvent(this._userId));
  }

  public addWorkExperience(
    data: AddWorkExperienceDto,
  ): WorkExperience {
    const newExperience = WorkExperience.create({
      ...data,
      id: uuidv4(),
      profileId: this._userId,
    });
    this._workExperiences.push(newExperience);
    this.apply(new ProfileUpdatedEvent(this._userId));
    return newExperience;
  }
  
  public addEducation(data: AddEducationDto): Education {
    const newEducation = Education.create({
      ...data,
      id: uuidv4(),
      profileId: this._userId,
    });
    this._educations.push(newEducation);
    this.apply(new ProfileUpdatedEvent(this._userId));
    return newEducation;
  }

  public updateProfilePicture(url: string | null): void {
    this._profilePictureUrl = url;
    this.apply(new ProfileUpdatedEvent(this._userId));
  }

  public updateBannerImage(url: string | null): void {
    this._bannerImageUrl = url;
    this.apply(new ProfileUpdatedEvent(this._userId));
  }

  /**
   * Returns a new Profile instance with only the minimal data visible to non-connections.
   */
  public getMinimalProfile(): Profile {
    const minimalProfile = new Profile();
    minimalProfile._userId = this._userId;
    minimalProfile._name = this._name;
    minimalProfile._headline = this._headline;
    minimalProfile._profilePictureUrl = this._profilePictureUrl;
    // All other fields are intentionally left undefined/empty
    minimalProfile._visibility = this._visibility;
    minimalProfile._workExperiences = [];
    minimalProfile._educations = [];
    minimalProfile._skills = [];
    minimalProfile._bannerImageUrl = null;
    minimalProfile._contactDetails = null;
    minimalProfile._customUrlSlug = this._customUrlSlug; // slug is public
    minimalProfile._location = this._location;

    return minimalProfile;
  }
}