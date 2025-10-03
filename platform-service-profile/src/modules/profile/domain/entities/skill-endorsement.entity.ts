import { randomUUID } from 'crypto';

export interface SkillEndorsementProps {
  id?: string;
  endorserUserId: string;
  userProfileSkillProfileUserId: string;
  userProfileSkillSkillId: string;
  createdAt?: Date;
}

export class SkillEndorsement {
  readonly id: string;
  readonly endorserUserId: string;
  readonly userProfileSkillProfileUserId: string;
  readonly userProfileSkillSkillId: string;
  readonly createdAt: Date;

  private constructor(props: SkillEndorsementProps) {
    this.id = props.id ?? randomUUID();
    this.endorserUserId = props.endorserUserId;
    this.userProfileSkillProfileUserId = props.userProfileSkillProfileUserId;
    this.userProfileSkillSkillId = props.userProfileSkillSkillId;
    this.createdAt = props.createdAt ?? new Date();
  }

  public static create(
    props: Omit<SkillEndorsementProps, 'id' | 'createdAt'>,
  ): SkillEndorsement {
    return new SkillEndorsement(props);
  }

  public static from(props: SkillEndorsementProps): SkillEndorsement {
    return new SkillEndorsement(props);
  }

  public getProps(): SkillEndorsementProps {
    return {
      id: this.id,
      endorserUserId: this.endorserUserId,
      userProfileSkillProfileUserId: this.userProfileSkillProfileUserId,
      userProfileSkillSkillId: this.userProfileSkillSkillId,
      createdAt: this.createdAt,
    };
  }
}