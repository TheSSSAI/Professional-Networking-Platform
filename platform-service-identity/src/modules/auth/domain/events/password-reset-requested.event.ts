import { IDomainEvent } from '../../../../shared/interfaces/event-publisher.interface';

export class PasswordResetRequestedEvent implements IDomainEvent {
  readonly name = 'identity.password_reset.requested';

  constructor(public readonly payload: { userId: string; email: string }) {}
}