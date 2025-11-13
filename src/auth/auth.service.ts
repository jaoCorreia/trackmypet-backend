import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../database/entities/refresh_token.entity';
import { PasswordReset } from '../database/entities/password-reset.entity';
import { EmailVerification } from '../database/entities/email-verification.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../database/entities/user.entity';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_DAYS = 30;

@Injectable()
export class AuthService {
  private readonly privateKey: string;
  private readonly publicKey: string;

  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    // Read file paths from .env
    const privateKeyPath = this.configService.get<string>(
      'JWT_PRIVATE_KEY_PATH',
    );
    const publicKeyPath = this.configService.get<string>('JWT_PUBLIC_KEY_PATH');

    if (!privateKeyPath || !publicKeyPath) {
      throw new Error(
        'JWT_PRIVATE_KEY_PATH and JWT_PUBLIC_KEY_PATH must be configured in .env. Run: node generate-keys.js',
      );
    }

    // Read PEM files
    const privateKeyFullPath = path.resolve(process.cwd(), privateKeyPath);
    const publicKeyFullPath = path.resolve(process.cwd(), publicKeyPath);

    if (
      !fs.existsSync(privateKeyFullPath) ||
      !fs.existsSync(publicKeyFullPath)
    ) {
      throw new Error('Key files not found. Run: node generate-keys.js');
    }

    this.privateKey = fs.readFileSync(privateKeyFullPath, 'utf8');
    this.publicKey = fs.readFileSync(publicKeyFullPath, 'utf8');
  }

  generateAccessToken(payload: object): string {
    return jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.publicKey, {
        algorithms: ['RS256'],
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token ' + error);
    }
  }

  async generateAndSaveRefreshToken(user: User) {
    const token = crypto.randomBytes(64).toString('hex');
    const tokenHash = await bcrypt.hash(token, 10);
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

    const rt = this.refreshTokenRepository.create({
      tokenHash,
      expiredAt,
      user,
    });

    await this.refreshTokenRepository.save(rt);
    return { refreshToken: token, expiresAt: expiredAt };
  }

  async refreshAccessToken(providedRefreshToken: string) {
    const all = await this.refreshTokenRepository.find({ relations: ['user'] });
    for (const row of all) {
      const match = await bcrypt.compare(providedRefreshToken, row.tokenHash);
      if (match) {
        if (row.expiredAt < new Date()) {
          await this.refreshTokenRepository.delete(row.id);
          throw new UnauthorizedException('Refresh token expired');
        }

        const payload = {
          sub: row.user.id,
          email: row.user.email,
          role: row.user.role,
        };
        const accessToken = this.generateAccessToken(payload);
        return { accessToken };
      }
    }
    throw new UnauthorizedException('Invalid refresh token');
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.generateAccessToken(payload);
    const { refreshToken, expiresAt } =
      await this.generateAndSaveRefreshToken(user);
    return { accessToken, refreshToken, expiresAt };
  }

  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async revokeRefreshToken(providedRefreshToken: string) {
    const all = await this.refreshTokenRepository.find();
    for (const row of all) {
      const match = await bcrypt.compare(providedRefreshToken, row.tokenHash);
      if (match) {
        await this.refreshTokenRepository.delete(row.id);
        return true;
      }
    }
    return false;
  }

  async getCurrentUser(userId: number) {
    const user = await this.usersService.findOne(userId);
    return user;
  }

  // Password Reset Methods
  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate 6-digit code
    const { code } = await this.emailService.sendSecurityCode(email);

    // Hash the code
    const codeHash = await bcrypt.hash(code, 10);

    // Set expiration to 5 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Delete any existing password reset requests for this user
    await this.passwordResetRepository.delete({ user_id: user.id });

    // Create new password reset record
    const passwordReset = this.passwordResetRepository.create({
      user_id: user.id,
      token_hash: codeHash,
      expires_at: expiresAt,
      attempts: 0,
    });

    await this.passwordResetRepository.save(passwordReset);

    return { valid: true, message: 'Password reset code sent to email' };
  }

  async verifyResetCode(email: string, code: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordReset = await this.passwordResetRepository.findOne({
      where: { user_id: user.id },
      order: { created_at: 'DESC' },
    });

    if (!passwordReset) {
      throw new BadRequestException('No password reset request found');
    }

    if (passwordReset.expires_at < new Date()) {
      await this.passwordResetRepository.delete(passwordReset.id);
      throw new BadRequestException('Reset code expired');
    }

    if (passwordReset.attempts >= 3) {
      await this.passwordResetRepository.delete(passwordReset.id);
      throw new BadRequestException('Too many failed attempts');
    }

    const isValidCode = await bcrypt.compare(code, passwordReset.token_hash);

    if (!isValidCode) {
      passwordReset.attempts += 1;
      await this.passwordResetRepository.save(passwordReset);
      throw new BadRequestException('Invalid reset code');
    }

    return { valid: true, message: 'Code verified successfully' };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordReset = await this.passwordResetRepository.findOne({
      where: { user_id: user.id },
      order: { created_at: 'DESC' },
    });

    if (!passwordReset) {
      throw new BadRequestException('No password reset request found');
    }

    if (passwordReset.expires_at < new Date()) {
      await this.passwordResetRepository.delete(passwordReset.id);
      throw new BadRequestException('Reset code expired');
    }

    if (passwordReset.attempts >= 3) {
      await this.passwordResetRepository.delete(passwordReset.id);
      throw new BadRequestException('Too many failed attempts');
    }

    const isValidCode = await bcrypt.compare(code, passwordReset.token_hash);

    if (!isValidCode) {
      passwordReset.attempts += 1;
      await this.passwordResetRepository.save(passwordReset);
      throw new BadRequestException('Invalid reset code');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.id, passwordHash);

    await this.passwordResetRepository.delete(passwordReset.id);

    await this.refreshTokenRepository.delete({ user: { id: user.id } });

    return { valid: true, message: 'Password reset successfully' };
  }

  async sendEmailVerification(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { code } = await this.emailService.sendSecurityCode(email);

    const codeHash = await bcrypt.hash(code, 10);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await this.emailVerificationRepository.delete({ user_id: user.id });

    const emailVerification = this.emailVerificationRepository.create({
      user_id: user.id,
      code_hash: codeHash,
      expires_at: expiresAt,
      attempts: 0,
    });

    await this.emailVerificationRepository.save(emailVerification);

    return { valid: true, message: 'Verification code sent to email' };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const emailVerification = await this.emailVerificationRepository.findOne({
      where: { user_id: user.id },
      order: { created_at: 'DESC' },
    });

    if (!emailVerification) {
      throw new BadRequestException('No verification request found');
    }

    if (emailVerification.expires_at < new Date()) {
      await this.emailVerificationRepository.delete(emailVerification.id);
      throw new BadRequestException('Verification code expired');
    }

    if (emailVerification.attempts >= 3) {
      await this.emailVerificationRepository.delete(emailVerification.id);
      throw new BadRequestException('Too many failed attempts');
    }

    const isValidCode = await bcrypt.compare(code, emailVerification.code_hash);

    if (!isValidCode) {
      emailVerification.attempts += 1;
      await this.emailVerificationRepository.save(emailVerification);
      throw new BadRequestException('Invalid verification code');
    }

    await this.emailVerificationRepository.delete(emailVerification.id);

    return { valid: true, message: 'Email verified successfully' };
  }
}
