import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { IHashingService } from '../../domain/interfaces/hashing.service.interface';

@Injectable()
export class BcryptService implements IHashingService {
  private readonly logger = new Logger(BcryptService.name);
  private readonly saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    this.saltRounds = this.configService.get<number>('app.bcryptSaltRounds', 12);
    this.logger.log(`BcryptService initialized with ${this.saltRounds} salt rounds.`);
  }

  /**
   * Hashes a plaintext password using bcrypt.
   * @param password The plaintext password to hash.
   * @returns A promise that resolves to the hashed password.
   */
  async hash(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      this.logger.error('Error occurred during password hashing.', error.stack);
      // This is a critical internal failure, rethrow to be caught as a 500-level error.
      throw new Error('Could not hash password.');
    }
  }

  /**
   * Compares a plaintext password against a hash to verify correctness.
   * This uses bcrypt's built-in functionality to prevent timing attacks.
   * @param password The plaintext password to compare.
   * @param hash The stored password hash.
   * @returns A promise that resolves to true if the password matches the hash, otherwise false.
   */
  async compare(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      this.logger.error('Error occurred during password comparison.', error.stack);
      // In a comparison scenario, it's safer to return false than to throw an error,
      // as an exception might leak internal state information.
      return false;
    }
  }
}