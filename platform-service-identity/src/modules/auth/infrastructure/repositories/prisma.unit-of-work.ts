import { Injectable, Scope, OnApplicationShutdown } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { IUnitOfWork } from '../../domain/interfaces/unit-of-work.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserPrismaRepository } from './user.prisma.repository';

// Assuming a PrismaService exists that provides the PrismaClient instance.
// This is a standard pattern in NestJS + Prisma applications.
// If it doesn't exist, this class would inject PrismaClient directly.
@Injectable()
export class PrismaService extends PrismaClient implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    console.log(`Prisma client disconnecting on signal: ${signal}`);
    await this.$disconnect();
  }
}

@Injectable({ scope: Scope.REQUEST })
export class PrismaUnitOfWork implements IUnitOfWork {
  private tx: Prisma.TransactionClient | null = null;
  public userRepository: IUserRepository;

  constructor(private readonly prisma: PrismaService) {}

  async startTransaction(): Promise<void> {
    if (this.tx) {
      // Already in a transaction
      return;
    }

    // This uses Prisma's interactive transactions, which is a preview feature
    // as of some versions. This is the cleanest way to implement the stateful
    // IUnitOfWork interface (start, commit, rollback).
    // The use case handler will be responsible for calling commit or rollback.
    this.tx = await (this.prisma as any).$begin();
    this.userRepository = new UserPrismaRepository(this.tx);
  }

  async commitTransaction(): Promise<void> {
    if (!this.tx) {
      throw new Error('No active transaction to commit.');
    }
    await (this.prisma as any).$commit(this.tx);
    this.tx = null;
    this.userRepository = null;
  }

  async rollbackTransaction(): Promise<void> {
    if (!this.tx) {
      // No active transaction to rollback, which is a safe no-op.
      return;
    }
    try {
      await (this.prisma as any).$rollback(this.tx);
    } catch (error) {
      // Log the error, but don't rethrow as rollback is a recovery mechanism.
      console.error('Error during transaction rollback:', error);
    } finally {
      this.tx = null;
      this.userRepository = null;
    }
  }

  /**
   * Provides a more idiomatic way of handling transactions with Prisma's callback-based API.
   * This can be used in handlers as an alternative to manual start/commit/rollback.
   * @param work A function that receives the transactional client and repositories.
   */
  async execute<T>(
    work: (userRepository: IUserRepository) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      const transactionalUserRepository = new UserPrismaRepository(tx);
      return await work(transactionalUserRepository);
    });
  }
}