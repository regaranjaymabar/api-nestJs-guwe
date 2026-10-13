import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';

const scryptAsync = promisify(scrypt);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  resetPasswordTokenHash?: string;
  resetPasswordExpiresAt?: Date;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly usersByEmail = new Map<string, UserRecord>();

  async register(registerDto: RegisterDto = {}) {
    const name = this.requireString(registerDto.name, 'name');
    const email = this.normalizeEmail(registerDto.email);
    const password = this.validatePassword(registerDto.password);
    const passwordConfirmation = this.validatePasswordConfirmation(
      registerDto.passwordConfirmation ?? registerDto.password_confirmation,
    );

    if (password !== passwordConfirmation) {
      throw new BadRequestException('Password confirmation does not match.');
    }

    if (this.usersByEmail.has(email)) {
      throw new ConflictException('Email already registered.');
    }

    const user: UserRecord = {
      id: randomUUID(),
      name,
      email,
      passwordHash: await this.hashSecret(password),
    };

    this.usersByEmail.set(email, user);

    return {
      message: 'Register successful.',
      user: this.toPublicUser(user),
    };
  }

  async login(loginDto: LoginDto = {}) {
    const email = this.normalizeEmail(loginDto.email);
    const password = this.requireString(loginDto.password, 'password');
    const user = this.usersByEmail.get(email);

    if (!user || !(await this.verifySecret(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return {
      message: 'Login successful.',
      accessToken: randomBytes(32).toString('hex'),
      user: this.toPublicUser(user),
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto = {}) {
    const email = this.normalizeEmail(forgotPasswordDto.email);
    const user = this.usersByEmail.get(email);

    if (!user) {
      return {
        message: 'If the email is registered, a reset token has been generated.',
      };
    }

    const resetToken = randomBytes(32).toString('hex');
    user.resetPasswordTokenHash = await this.hashSecret(resetToken);
    user.resetPasswordExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    return {
      message: 'Reset token generated.',
      resetToken,
      expiresInMinutes: RESET_TOKEN_TTL_MS / 60_000,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto = {}) {
    const token = this.requireString(resetPasswordDto.token, 'token');
    const password = this.validatePassword(resetPasswordDto.password);
    const passwordConfirmation = this.validatePasswordConfirmation(
      resetPasswordDto.passwordConfirmation ??
        resetPasswordDto.password_confirmation,
    );

    if (password !== passwordConfirmation) {
      throw new BadRequestException('Password confirmation does not match.');
    }

    const user = await this.findUserByResetToken(token);

    if (!user) {
      throw new BadRequestException('Reset token is invalid or expired.');
    }

    user.passwordHash = await this.hashSecret(password);
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;

    return {
      message: 'Password reset successful.',
    };
  }

  getUsers() {
    return {
      total: this.usersByEmail.size,
      users: [...this.usersByEmail.values()].map((user) =>
        this.toPublicUser(user),
      ),
    };
  }

  getUsersCount() {
    return {
      total: this.usersByEmail.size,
    };
  }

  private async findUserByResetToken(token: string) {
    for (const user of this.usersByEmail.values()) {
      const isExpired =
        !user.resetPasswordExpiresAt || user.resetPasswordExpiresAt <= new Date();

      if (!user.resetPasswordTokenHash || isExpired) {
        continue;
      }

      if (await this.verifySecret(token, user.resetPasswordTokenHash)) {
        return user;
      }
    }

    return undefined;
  }

  private async hashSecret(secret: string) {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(secret, salt, 64)) as Buffer;

    return `${salt}:${derivedKey.toString('hex')}`;
  }

  private async verifySecret(secret: string, storedHash: string) {
    const [salt, key] = storedHash.split(':');

    if (!salt || !key) {
      return false;
    }

    const storedKey = Buffer.from(key, 'hex');
    const derivedKey = (await scryptAsync(secret, salt, 64)) as Buffer;

    return (
      storedKey.length === derivedKey.length &&
      timingSafeEqual(storedKey, derivedKey)
    );
  }

  private normalizeEmail(value: unknown) {
    const email = this.requireString(value, 'email').toLowerCase();

    if (!EMAIL_REGEX.test(email)) {
      throw new BadRequestException('Email must be valid.');
    }

    return email;
  }

  private validatePassword(value: unknown) {
    const password = this.requireString(value, 'password');

    if (password.length < PASSWORD_MIN_LENGTH) {
      throw new BadRequestException(
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
      );
    }

    return password;
  }

  private validatePasswordConfirmation(value: unknown) {
    return this.requireString(value, 'password confirmation');
  }

  private requireString(value: unknown, field: string) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`${field} is required.`);
    }

    return value.trim();
  }

  private toPublicUser(user: UserRecord): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
