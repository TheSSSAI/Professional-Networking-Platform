export class UpdateFeatureFlagCommand {
  constructor(
    public readonly adminId: string,
    public readonly flagName: string,
    public readonly isEnabled: boolean,
  ) {}
}