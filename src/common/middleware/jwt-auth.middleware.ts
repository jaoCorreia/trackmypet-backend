import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  private readonly publicKey: string;

  constructor(private readonly configService: ConfigService) {
    const publicKeyPath = this.configService.get<string>('JWT_PUBLIC_KEY_PATH');

    if (!publicKeyPath) {
      throw new Error('JWT_PUBLIC_KEY_PATH not configured in .env');
    }

    const publicKeyFullPath = path.resolve(process.cwd(), publicKeyPath);

    if (!fs.existsSync(publicKeyFullPath)) {
      throw new Error(`Public key not found at: ${publicKeyFullPath}`);
    }

    this.publicKey = fs.readFileSync(publicKeyFullPath, 'utf8');
  }

  use(req: Request & { user?: any }, res: Response, next: NextFunction) {
    const auth = req.headers['authorization'];

    if (!auth) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const parts = String(auth).split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = parts[1];

    try {
      const payload = jwt.verify(token, this.publicKey, {
        algorithms: ['RS256'],
      });
      req.user = payload;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token ' + error);
    }
  }
}
