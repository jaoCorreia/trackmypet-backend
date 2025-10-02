import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../database/entities/refresh_token.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../database/entities/user.entity';
import { UsersService } from '../users/users.service';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_DAYS = 30;

@Injectable()
export class AuthService {
  private readonly privateKey: string;
  private readonly publicKey: string;

  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
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
}
