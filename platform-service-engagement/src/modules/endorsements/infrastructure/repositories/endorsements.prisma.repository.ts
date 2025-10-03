import { Injectable, Logger } from '@nestjs/common';
import { Prisma, SkillEndorsement as PrismaSkillEndorsement } from '@prisma/client';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { IEndorsementsRepository } from '../../domain/i-endorsements.repository';
import { SkillEndorsement } from '../../domain/skill-endorsement.entity';
import { EndorsementExistsException } from '../../domain/exceptions/endorsement-exists.exception';

@Injectable()
export class EndorsementsPrismaRepository implements IEndorsementsRepository {
  private readonly logger = new Logger(EndorsementsPrismaRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Maps a Prisma SkillEndorsement model to a domain SkillEndorsement entity.
   * @param prismaEndorsement The endorsement object from Prisma.
   * @returns A SkillEndorsement domain entity.
   */
  private static toDomain(
    prismaEndorsement: PrismaSkillEndorsement,
  ): SkillEndorsement {
    if (!prismaEndorsement) {
      return null;
    }
    return new SkillEndorsement(
      prismaEndorsement.id,
      prismaEndorsement.endorserId,
      prismaEndorsement.endorsedUserId,
      prismaEndorsement.skillId,
      prismaEndorsement.createdAt,
    );
  }

  /**
   * Creates a new skill endorsement record.
   * @param endorsement The SkillEndorsement domain entity to persist.
   * @returns The persisted SkillEndorsement domain entity.
   * @throws {EndorsementExistsException} if this endorsement already exists.
   */
  async create(endorsement: SkillEndorsement): Promise<SkillEndorsement> {
    try {
      const createdEndorsement = await this.prisma.skillEndorsement.create({
        data: {
          id: endorsement.id,
          endorserId: endorsement.endorserId,
          endorsedUserId: endorsement.endorsedUserId,
          skillId: endorsement.skillId,
          createdAt: endorsement.createdAt,
        },
      });
      return EndorsementsPrismaRepository.toDomain(createdEndorsement);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        this.logger.warn(
          `Attempted to create a duplicate endorsement from user ${endorsement.endorserId} for user ${endorsement.endorsedUserId} on skill ${endorsement.skillId}`,
        );
        throw new EndorsementExistsException();
      }
      this.logger.error(
        `Error creating endorsement: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Deletes a skill endorsement. This operation is idempotent.
   * @param endorserId The ID of the user who made the endorsement.
   * @param endorsedUserId The ID of the user whose skill was endorsed.
   * @param skillId The ID of the skill.
   * @returns A promise that resolves when the operation is complete.
   */
  async delete(
    endorserId: string,
    endorsedUserId: string,
    skillId: string,
  ): Promise<void> {
    try {
      await this.prisma.skillEndorsement.deleteMany({
        where: {
          endorserId,
          endorsedUserId,
          skillId,
        },
      });
      this.logger.log(
        `Attempted deletion of endorsement from ${endorserId} for user ${endorsedUserId} on skill ${skillId}.`,
      );
    } catch (error) {
      this.logger.error(
        `Error deleting endorsement: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Finds a specific skill endorsement.
   * @param endorserId The ID of the user who made the endorsement.
   * @param endorsedUserId The ID of the user whose skill was endorsed.
   * @param skillId The ID of the skill.
   * @returns The SkillEndorsement domain entity if found, otherwise null.
   */
  async findByUserAndSkill(
    endorserId: string,
    endorsedUserId: string,
    skillId: string,
  ): Promise<SkillEndorsement | null> {
    const prismaEndorsement = await this.prisma.skillEndorsement.findUnique({
      where: {
        endorserId_endorsedUserId_skillId: {
          endorserId,
          endorsedUserId,
          skillId,
        },
      },
    });

    return EndorsementsPrismaRepository.toDomain(prismaEndorsement);
  }
}