export class GetModerationQueueQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly sortBy?: string,
    public readonly sortOrder?: 'asc' | 'desc',
  ) {}
}