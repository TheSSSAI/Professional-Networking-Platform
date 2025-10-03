import { AdminActionType } from '../../../../audit/domain/enums/admin-action-type.enum';

export class TakeModerationActionCommand {
  constructor(
    public readonly reportId: string,
    public readonly adminId: string,
    public readonly action: AdminActionType,
    public readonly reason?: string,
    public readonly suspensionDurationSeconds?: number,
  ) {}
}