import { randomUUID } from 'crypto';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export interface WorkExperienceProps {
  id?: string;
  profileId: string;
  company: string;
  title: string;
  startDate: Date;
  endDate?: Date | null;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class WorkExperience {
  readonly id: string;
  readonly profileId: string;
  company: string;
  title: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  readonly createdAt: Date;
  updatedAt: Date;

  private constructor(props: WorkExperienceProps) {
    this.id = props.id ?? randomUUID();
    this.profileId = props.profileId;
    this.company = props.company;
    this.title = props.title;
    this.startDate = props.startDate;
    this.endDate = props.endDate ?? null;
    this.description = props.description ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public static create(props: Omit<WorkExperienceProps, 'id'>): WorkExperience {
    const experience = new WorkExperience(props);
    experience.validateDateRange();
    return experience;
  }

  public static from(props: WorkExperienceProps): WorkExperience {
    const experience = new WorkExperience(props);
    experience.validateDateRange();
    return experience;
  }

  public update(
    props: Partial<Omit<WorkExperienceProps, 'id' | 'profileId'>>,
  ) {
    if (props.company) this.company = props.company;
    if (props.title) this.title = props.title;
    if (props.startDate) this.startDate = props.startDate;
    if (props.endDate !== undefined) this.endDate = props.endDate;
    if (props.description !== undefined) this.description = props.description;

    this.validateDateRange();
    this.updatedAt = new Date();
  }

  private validateDateRange(): void {
    if (this.endDate && this.startDate > this.endDate) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'End date cannot be before the start date.',
      });
    }
  }

  public getProps(): WorkExperienceProps {
    return {
      id: this.id,
      profileId: this.profileId,
      company: this.company,
      title: this.title,
      startDate: this.startDate,
      endDate: this.endDate,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}