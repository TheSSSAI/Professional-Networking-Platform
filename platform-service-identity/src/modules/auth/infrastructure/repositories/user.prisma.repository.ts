import { Injectable } from '@nestjs/common';
import { Prisma, User as PrismaUser } from '@prisma/client';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserStatus } from '../../domain/enums/user-status.enum';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { userId: id },
    });
    return user ? this.mapToDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return user ? this.mapToDomain(user) : null;
  }

  async add(user: User): Promise<void> {
    const data = this.mapToPersistence(user);
    await this.prisma.user.create({ data });
  }

  async update(user: User): Promise<void> {
    const data = this.mapToPersistence(user);
    await this.prisma.user.update({
      where: { userId: user.id },
      data,
    });
  }

  private mapToDomain(prismaUser: PrismaUser): User {
    const user = new User({
      id: prismaUser.userId,
      email: prismaUser.email,
      dateOfBirth: prismaUser.dateOfBirth,
      status: prismaUser.status as UserStatus,
      mfaEnabled: prismaUser.mfaEnabled,
      // private fields are set through this method, not directly
      passwordHash: prismaUser.passwordHash,
      mfaSecret: prismaUser.mfaSecret,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
    return user;
  }

  private mapToPersistence(
    user: User,
  ): Prisma.UserUncheckedCreateInput | Prisma.UserUpdateInput {
    // Access private properties for persistence via a method on the entity
    const persistenceData = user.getPersistenceData();
    return {
      userId: user.id,
      email: user.email,
      passwordHash: persistenceData.passwordHash,
      status: user.status,
      dateOfBirth: persistenceData.dateOfBirth,
      mfaSecret: persistenceData.mfaSecret,
      mfaEnabled: user.mfaEnabled,
      createdAt: persistenceData.createdAt,
      updatedAt: persistenceData.updatedAt,
    };
  }
}