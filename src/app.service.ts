import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
  version: string;
  uptime_seconds: number;
}

@Injectable()
export class AppService {
  private readonly startedAt = Date.now();
  private readonly version: string;

  constructor() {
    try {
      const pkgPath = path.join(process.cwd(), 'package.json');
      const raw = fs.readFileSync(pkgPath, 'utf8');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const pkg: { version?: string } = JSON.parse(raw);
      this.version = pkg.version ?? 'unknown';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      this.version = 'unknown';
    }
  }

  getHello(): HealthResponse {
    return {
      status: 'ok',
      message: 'API ativa',
      timestamp: new Date().toISOString(),
      version: this.version,
      uptime_seconds: Math.floor((Date.now() - this.startedAt) / 1000),
    };
  }
}
