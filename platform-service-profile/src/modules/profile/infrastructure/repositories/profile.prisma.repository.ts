import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/common/database/prisma.service';
import { IProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { Profile } from '../../domain/entities/profile.entity';
import {
  Prisma,
  UserProfile as PrismaUserProfile,
  WorkExperience as PrismaWorkExperience,
  Education as PrismaEducation,
} from '@prisma/client';
import { WorkExperience } from '../../domain/entities/work-experience.entity';
import { Education } from '../../domain/entities/education.entity';
import { Skill } from '../../domain/entities/skill.entity';

type FullPrismaProfile = PrismaUserProfile & {
  workExperiences: PrismaWorkExperience[];
  educations: PrismaEducation[];
  skills: { skill: { id: string; name: string } }[];
};

@Injectable()
export class ProfilePrismaRepository implements IProfileRepository {
  private readonly logger = new Logger(ProfilePrismaRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Profile | null> {
    const profileRecord = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: {
        workExperiences: true,
        educations: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!profileRecord) {
      return null;
    }

    return this.toDomain(profileRecord);
  }

  async findByUrlSlug(slug: string): Promise<Profile | null> {
    const profileRecord = await this.prisma.userProfile.findUnique({
      where: { customUrlSlug: slug },
      include: {
        workExperiences: true,
        educations: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!profileRecord) {
      return null;
    }

    return this.toDomain(profileRecord);
  }


  async checkSlugAvailability(slug: string, excludeUserId?: string): Promise<boolean> {
    const whereClause: Prisma.UserProfileWhereInput = {
      customUrlSlug: {
        equals: slug,
        mode: 'insensitive',
      },
    };

    if (excludeUserId) {
      whereClause.NOT = {
        userId: excludeUserId,
      };
    }
    
    const count = await this.prisma.userProfile.count({
      where: whereClause
    });

    return count === 0;
  }

  async save(profile: Profile): Promise<void> {
    const { userId } = profile;
    const persistenceModel = this.toPersistence(profile);

    await this.prisma.$transaction(async (tx) => {
      // Upsert the main profile data
      await tx.userProfile.upsert({
        where: { userId },
        update: persistenceModel.update,
        create: persistenceModel.create,
      });

      // Synchronize Work Experiences
      const existingExperiences = await tx.workExperience.findMany({ where: { profileId: userId } });
      const experiencesInDomain = profile.getWorkExperiences();

      const experiencesToDelete = existingExperiences.filter(e => !experiencesInDomain.some(d => d.id === e.id));
      const experiencesToUpdate = experiencesInDomain.filter(d => existingExperiences.some(e => e.id === d.id));
      const experiencesToCreate = experiencesInDomain.filter(d => !d.id);

      if (experiencesToDelete.length > 0) {
        await tx.workExperience.deleteMany({ where: { id: { in: experiencesToDelete.map(e => e.id) } } });
      }
      for (const exp of experiencesToUpdate) {
        await tx.workExperience.update({ where: { id: exp.id }, data: { ...exp, profileId: userId } });
      }
      if (experiencesToCreate.length > 0) {
        await tx.workExperience.createMany({ data: experiencesToCreate.map(e => ({ ...e, id: undefined, profileId: userId })) });
      }

       // Synchronize Education
       const existingEducations = await tx.education.findMany({ where: { profileId: userId } });
       const educationsInDomain = profile.getEducations();
 
       const educationsToDelete = existingEducations.filter(e => !educationsInDomain.some(d => d.id === e.id));
       const educationsToUpdate = educationsInDomain.filter(d => existingEducations.some(e => e.id === d.id));
       const educationsToCreate = educationsInDomain.filter(d => !d.id);
 
       if (educationsToDelete.length > 0) {
        await tx.education.deleteMany({ where: { id: { in: educationsToDelete.map(e => e.id) } } });
       }
       for (const edu of educationsToUpdate) {
         await tx.education.update({ where: { id: edu.id }, data: { ...edu, profileId: userId } });
       }
       if (educationsToCreate.length > 0) {
        await tx.education.createMany({ data: educationsToCreate.map(e => ({ ...e, id: undefined, profileId: userId })) });
       }
       
      // Synchronize Skills (simplified using connect/disconnect for many-to-many)
      await tx.userProfile.update({
        where: { userId },
        data: {
          skills: {
            // First, remove all skills that are no longer present in the domain entity
            deleteMany: {},
            // Then, create (or connect) all skills that are currently in the domain entity
            create: profile.getSkills().map(skill => ({
              skill: {
                connectOrCreate: {
                  where: { name: skill.name },
                  create: { name: skill.name },
                }
              }
            })),
          }
        }
      });
    });

    this.logger.log(`Successfully saved profile for user ID: ${userId}`);
  }

  private toDomain(record: FullPrismaProfile): Profile {
    const profileProps = {
      ...record,
      workExperiences: record.workExperiences.map(
        (exp) => new WorkExperience(exp),
      ),
      educations: record.educations.map((edu) => new Education(edu)),
      skills: record.skills.map(
        (userSkill) => new Skill(userSkill.skill),
      ),
    };
    return Profile.reconstitute(profileProps);
  }

  private toPersistence(profile: Profile): {
    create: Prisma.UserProfileCreateInput;
    update: Prisma.UserProfileUpdateInput;
  } {
    const data = {
      name: profile.name,
      headline: profile.headline,
      location: profile.location,
      contactInfo: profile.contactInfo as Prisma.JsonValue,
      profilePictureUrl: profile.profilePictureUrl,
      bannerImageUrl: profile.bannerImageUrl,
      customUrlSlug: profile.customUrlSlug,
      visibility: profile.visibility,
    };

    const createData = {
      ...data,
      user: {
        connect: { id: profile.userId },
      },
    };

    return { create: createData, update: data };
  }
}