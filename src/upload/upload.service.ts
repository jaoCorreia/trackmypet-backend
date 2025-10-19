import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  private readonly uploadPath = './uploads';

  constructor() {
    // Garante que o diretório de uploads existe
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory() {
    const directories = [
      `${this.uploadPath}`,
      `${this.uploadPath}/users`,
      `${this.uploadPath}/pets`,
    ];

    directories.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  getMulterOptions(folder: 'users' | 'pets') {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, `${this.uploadPath}/${folder}`);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${folder}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Apenas imagens são permitidas!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    };
  }

  deleteFile(filePath: string): void {
    const fullPath = `./${filePath}`;
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  generateFileUrl(filename: string, folder: 'users' | 'pets'): string {
    const host = process.env.HOST || 'http://localhost:3000';
    return `${host}/uploads/${folder}/${filename}`;
  }
}
