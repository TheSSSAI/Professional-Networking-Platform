export class SearchUsersAdminQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly searchQuery?: string,
    public readonly filterByStatus?: string, // e.g., 'ACTIVE', 'BANNED', 'SUSPENDED'
  ) {}
}