export class GetAuditLogsQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly adminId?: string,
    public readonly targetId?: string,
    public readonly actionType?: string,
  ) {}
}