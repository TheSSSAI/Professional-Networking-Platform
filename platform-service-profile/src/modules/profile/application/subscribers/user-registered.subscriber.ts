import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '../../../domain/events/user-registered.event';
import { IProfileRepository } from '../../../domain/interfaces/profile-repository.interface';
import { Profile } from '../../../domain/entities/profile.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserRegisteredSubscriber {
  private readonly logger = new Logger(UserRegisteredSubscriber.name);

  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  /**
   * Handles the 'user.registered' event to create a new profile stub.
   * This ensures that every new user in the system has a corresponding profile record.
   * The handler is idempotent, checking if a profile already exists before creating one.
   *
   * @param {UserRegisteredEvent} event - The event payload containing the new user's details.
   */
  @OnEvent('user.registered', { async: true })
  async handleUserRegistered(event: UserRegisteredEvent): Promise<void> {
    const { userId, name, email } = event;
    this.logger.log(`Received UserRegisteredEvent for userId: ${userId}`);

    try {
      const existingProfile = await this.profileRepository.findByUserId(userId);
      if (existingProfile) {
        this.logger.warn(
          `Profile for user ${userId} already exists. Skipping creation.`,
        );
        return;
      }

      const profile = Profile.create({
        userId,
        name,
        // The DTO might contain contact details which can be populated here
        contactDetails: { email },
      });

      await this.profileRepository.save(profile);
      // No need to commit events here, as profile creation shouldn't trigger a 'ProfileUpdated' event
      // unless specifically required by another business process.

      this.logger.log(`Successfully created profile for user ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to create profile for user ${userId}: ${error.message}`,
        error.stack,
      );
      // In a production system, this might push to a dead-letter queue for retry.
    }
  }
}