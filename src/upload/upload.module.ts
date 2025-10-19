import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          // O destino será determinado dinamicamente baseado na rota
          const path = req.path;
          if (path.includes('/users/')) {
            cb(null, './uploads/users');
          } else if (path.includes('/pets/')) {
            cb(null, './uploads/pets');
          } else {
            cb(null, './uploads');
          }
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const folder = req.path.includes('/users/')
            ? 'user'
            : req.path.includes('/pets/')
              ? 'pet'
              : 'file';
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
    }),
  ],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
