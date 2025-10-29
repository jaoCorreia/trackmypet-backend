import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

type MulterRequest = Request & { fileValidationError?: string };

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          // don't throw here — tell multer to skip the file and record the reason on the request
          const r = req as MulterRequest;
          r.fileValidationError = 'Apenas imagens são permitidas!';
          return callback(null, false);
        }
        callback(null, true);
      },
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: MulterRequest,
  ) {
    if (!file) {
      const msg = req.fileValidationError || 'Arquivo inválido ou não enviado.';
      throw new BadRequestException(msg);
    }
    return {
      message: 'Upload realizado com sucesso!',
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    };
  }

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: MulterRequest,
  ) {
    if (!file) {
      const msg = req.fileValidationError || 'Arquivo inválido ou não enviado.';
      throw new BadRequestException(msg);
    }
    return {
      message: 'Upload realizado com sucesso!',
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    };
  }
}
