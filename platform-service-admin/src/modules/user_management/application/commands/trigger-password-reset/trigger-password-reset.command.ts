export class TriggerPasswordResetCommand {
  constructor(
    public readonly adminId: string,
    public readonly targetUserId: string,
  ) {}
}