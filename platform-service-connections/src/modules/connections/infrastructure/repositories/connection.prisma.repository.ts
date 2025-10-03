import { Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma, Connection } from '@prisma/client';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { IConnectionRepository } from '../../domain/interfaces/connection.repository.interface';
import { ConnectionAggregate } from '../../domain/connection.aggregate';
import { ConnectionStatus } from '../../domain/connection-status.enum';
import { IEventPublisherPort } from '../../domain/interfaces/event-publisher.port.interface';

@Injectable()
export class ConnectionPrismaRepository implements IConnectionRepository {
  private readonly logger = new Logger(ConnectionPrismaRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('IEventPublisherPort')
    private readonly eventPublisher: IEventPublisherPort,
  ) {}

  private toAggregate(prismaConnection: Connection): ConnectionAggregate {
    const aggregate = new ConnectionAggregate({
      id: prismaConnection.id,
      requesterId: prismaConnection.requesterId,
      addresseeId: prismaConnection.addresseeId,
      status: prismaConnection.status as ConnectionStatus,
      message: prismaConnection.message,
      createdAt: prismaConnection.createdAt,
      updatedAt: prismaConnection.updatedAt,
    });
    return aggregate;
  }

  private fromAggregate(
    aggregate: ConnectionAggregate,
  ): Prisma.ConnectionUncheckedCreateInput {
    const props = aggregate.getProps();
    return {
      id: props.id,
      requesterId: props.requesterId,
      addresseeId: props.addresseeId,
      status: props.status,
      message: props.message,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }

  async save(connection: ConnectionAggregate): Promise<void> {
    const props = connection.getProps();
    const data = this.fromAggregate(connection);

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.connection.upsert({
          where: { id: props.id },
          update: data,
          create: data,
        });

        // Publish domain events after transaction commits
        const events = connection.getUncommittedEvents();
        for (const event of events) {
          await this.eventPublisher.publish(event);
        }
        connection.clearUncommittedEvents();
      });
      this.logger.log(`Successfully saved connection aggregate with ID: ${props.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to save connection aggregate with ID: ${props.id}. Error: ${error.message}`,
        error.stack,
      );
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors, e.g., unique constraint violation
        if (error.code === 'P2002') {
          // This could be mapped to a domain-specific exception
          throw new Error('A connection between these users already exists.');
        }
      }
      throw error;
    }
  }

  async findById(id: string): Promise<ConnectionAggregate | null> {
    const connection = await this.prisma.connection.findUnique({ where: { id } });
    return connection ? this.toAggregate(connection) : null;
  }

  async findByUsers(
    userIdA: string,
    userIdB: string,
  ): Promise<ConnectionAggregate | null> {
    const connection = await this.prisma.connection.findFirst({
      where: {
        OR: [
          { requesterId: userIdA, addresseeId: userIdB },
          { requesterId: userIdB, addresseeId: userIdA },
        ],
      },
    });
    return connection ? this.toAggregate(connection) : null;
  }

  async findPendingForUser(
    userId: string,
    options: { skip: number; take: number },
  ): Promise<ConnectionAggregate[]> {
    const connections = await this.prisma.connection.findMany({
      where: {
        addresseeId: userId,
        status: ConnectionStatus.PENDING,
      },
      skip: options.skip,
      take: options.take,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return connections.map(this.toAggregate);
  }

  async countPendingForUser(userId: string): Promise<number> {
    return this.prisma.connection.count({
      where: {
        addresseeId: userId,
        status: ConnectionStatus.PENDING,
      },
    });
  }

  async findAcceptedForUser(
    userId: string,
    options: { skip: number; take: number },
  ): Promise<{ connections: ConnectionAggregate[], total: number }> {
    const whereClause: Prisma.ConnectionWhereInput = {
      status: ConnectionStatus.ACCEPTED,
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    };

    const [connections, total] = await this.prisma.$transaction([
        this.prisma.connection.findMany({
            where: whereClause,
            skip: options.skip,
            take: options.take,
            orderBy: {
                updatedAt: 'desc', // Sort by when connection was accepted
            },
        }),
        this.prisma.connection.count({ where: whereClause }),
    ]);

    return { connections: connections.map(this.toAggregate), total };
  }


  async delete(id: string): Promise<void> {
    try {
      await this.prisma.connection.delete({ where: { id } });
      this.logger.log(`Successfully deleted connection with ID: ${id}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete connection with ID: ${id}. Error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}