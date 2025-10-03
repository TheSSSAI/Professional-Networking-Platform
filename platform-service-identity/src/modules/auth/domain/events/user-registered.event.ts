import { IDomainEvent } from '../../../../shared/interfaces/event-publisher.interface';

export class UserRegisteredEvent implements IDomainEvent {
  readonly name = 'identity.user.registered';

  constructor(public readonly payload: { userId: string; email: string }) {}
}