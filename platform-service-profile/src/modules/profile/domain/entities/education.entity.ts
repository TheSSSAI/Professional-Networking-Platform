import { randomUUID } from 'crypto';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export interface EducationProps {
  id?: string;
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Education {
  readonly id: string;
  readonly profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date | null;
  readonly createdAt: Date;
  updatedAt: Date;

  private constructor(props: EducationProps) {
    this.id = props.id || randomUUID();
    this.profileId = props.profileId;
    this.institution = props.institution;
    this.degree = props.degree;
    this.fieldOfStudy = props.fieldOfStudy;
    this.startDate = props.startDate;
    this.endDate = props.endDate ?? null;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(props: Omit<EducationProps, 'id'>): Education {
    const education = new Education(props);
    education.validateDateRange();
    return education;
  }

  public static from(props: EducationProps): Education {
    const education = new Education(props);
    education.validateDateRange();
    return education;
  }

  public update(props: Partial<Omit<EducationProps, 'id' | 'profileId'>>) {
    if (props.institution) this.institution = props.institution;
    if (props.degree) this.degree = props.degree;
    if (props.fieldOfStudy) this.fieldOfStudy = props.fieldOfStudy;
    if (props.startDate) this.startDate = props.startDate;
    if (props.endDate !== undefined) this.endDate = props.endDate;

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

  public getProps(): EducationProps {
    return {
      id: this.id,
      profileId: this.profileId,
      institution: this.institution,
      degree: this.degree,
      fieldOfStudy: this.fieldOfStudy,
      startDate: this.startDate,
      endDate: this.endDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}