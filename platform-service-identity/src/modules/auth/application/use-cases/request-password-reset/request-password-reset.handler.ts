import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { RequestPasswordResetCommand } from './request-password-reset.command';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { IUnitOfWork } from '../../../domain/interfaces/unit-of-work.interface';
import { UserStatus } from '../../../domain/enums/user-status.enum';
import { PasswordResetRequestedEvent } from '../../../domain/events/password-reset-requested.event';

@CommandHandler(RequestPasswordResetCommand)
export class RequestPasswordResetHandler
  implements ICommandHandler<RequestPasswordResetCommand>
{
  private readonly logger = new Logger(RequestPasswordResetHandler.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IUnitOfWork')
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RequestPasswordResetCommand): Promise<void> {
    const { email } = command;
    const lowercasedEmail = email.toLowerCase();

    await this.unitOfWork.startTransaction();
    try {
      const user = await this.userRepository.findByEmail(lowercasedEmail);

      // To prevent email enumeration, we do not throw an error if the user is not found.
      // We proceed as if everything is fine, but only perform actions if the user exists.
      if (user && user.status !== UserStatus.BANNED) {
        // Invalidate any previous password reset tokens for this user
        await this.userRepository.invalidatePasswordResetTokens(user.id);

        const resetToken = user.generatePasswordResetToken();
        await this.userRepository.addUserToken(resetToken);

        await this.unitOfWork.commitTransaction();
        
        // Publish event after transaction commit
        this.eventBus.publish(
          new PasswordResetRequestedEvent(
            user.id,
            user.email,
            resetToken.getToken(),
          ),
        );
        this.logger.log(`Password reset requested for user: ${user.id}`);
      } else {
        // If user not found or is banned, we still commit an empty transaction and log it for security monitoring.
        await this.unitOfWork.commitTransaction();
        this.logger.warn(`Password reset requested for non-existent or banned email: ${lowercasedEmail}`);
      }
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      this.logger.error(`Failed to process password reset request for ${lowercasedEmail}: ${error.message}`, error.stack);
      // We deliberately swallow the error to not leak information.
      // The only failure visible to the user would be the email not arriving.
    }
  }
}