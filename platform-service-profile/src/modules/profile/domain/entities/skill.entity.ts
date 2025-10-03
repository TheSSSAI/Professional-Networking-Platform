import { randomUUID } from 'crypto';

export interface SkillProps {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Skill {
  readonly id: string;
  name: string;
  readonly createdAt: Date;
  updatedAt: Date;

  private constructor(props: SkillProps) {
    this.id = props.id ?? randomUUID();
    this.name = props.name;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public static create(props: Omit<SkillProps, 'id'>): Skill {
    return new Skill(props);
  }

  public static from(props: SkillProps): Skill {
    return new Skill(props);
  }

  public getProps(): SkillProps {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}