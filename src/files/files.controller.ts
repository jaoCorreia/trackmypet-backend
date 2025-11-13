import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { FilesService } from './files.service';
import { CreateFileDto, UpdateFileDto } from './dto';
import { S3Service } from '../s3/s3.service';
import { UserRole } from 'src/database/entities/user-role.enum';

interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}

@Controller('files')
export class FilesController {
  constructor(
    private readonly service: FilesService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  //   @UseGuards(OwnerOrAdminGuard)
  async create(@Body() dto: CreateFileDto) {
    const file = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      data: file,
      _link: {
        self: { href: `${host}/files/${file.id}`, method: 'GET' },
        list: { href: `${host}/files`, method: 'GET' },
        create: { href: `${host}/files`, method: 'POST' },
        update: { href: `${host}/files/${file.id}`, method: 'PUT' },
        delete: { href: `${host}/files/${file.id}`, method: 'DELETE' },
      },
    };
  }

  @Get()
  async findAll(@Query('petId') petId?: number) {
    const files = await this.service.findAll(petId);
    const host = process.env.HOST;
    return {
      data: files,
      _link: {
        self: { href: `${host}/files/:id`, method: 'GET' },
        list: { href: `${host}/files`, method: 'GET' },
        create: { href: `${host}/files`, method: 'POST' },
        update: { href: `${host}/files/:id`, method: 'PUT' },
        delete: { href: `${host}/files/:id`, method: 'DELETE' },
      },
    };
  }

  // Upload de arquivos para S3
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo inválido ou não enviado.');
    }

    if (!user || !user.sub) {
      throw new BadRequestException('Usuário não autenticado.');
    }

    const result = await this.s3Service.uploadFile(
      file,
      `users/${Number(user.sub)}/files`,
    );

    return {
      message: 'Upload realizado com sucesso!',
      ...result,
    };
  }

  // Download por URL completa
  @Get('download')
  async getDownloadUrl(
    @Query('url') fileUrl: string,
    @Query('expiresIn') expiresIn?: number,
  ) {
    if (!fileUrl) {
      throw new BadRequestException('URL do arquivo é obrigatória');
    }

    const downloadUrl = await this.s3Service.getDownloadUrl(
      fileUrl,
      expiresIn || 3600,
    );

    return {
      downloadUrl,
      expiresIn: expiresIn || 3600,
    };
  }

  // Download por key
  @Get('download-by-key')
  async getDownloadUrlByKey(
    @Query('key') key: string,
    @Query('expiresIn') expiresIn?: number,
  ) {
    if (!key) {
      throw new BadRequestException('Key do arquivo é obrigatória');
    }

    const downloadUrl = await this.s3Service.getDownloadUrlByKey(
      key,
      expiresIn || 3600,
    );

    return {
      downloadUrl,
      expiresIn: expiresIn || 3600,
    };
  }

  @Get(':id')
  //   @UseGuards(OwnerOrAdminGuard)
  async findOne(@Param('id') id: string) {
    const file = await this.service.findOne(Number(id));
    const host = process.env.HOST;
    return {
      data: file,
      _link: {
        self: { href: `${host}/files/${file.id}`, method: 'GET' },
        list: { href: `${host}/files`, method: 'GET' },
        create: { href: `${host}/files`, method: 'POST' },
        update: { href: `${host}/files/${file.id}`, method: 'PUT' },
        delete: { href: `${host}/files/${file.id}`, method: 'DELETE' },
      },
    };
  }

  @Put(':id')
  //   @UseGuards(OwnerOrAdminGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateFileDto) {
    const file = await this.service.update(Number(id), dto);
    const host = process.env.HOST;
    return {
      data: file,
      _link: {
        self: { href: `${host}/files/${file.id}`, method: 'GET' },
        list: { href: `${host}/files`, method: 'GET' },
        create: { href: `${host}/files`, method: 'POST' },
        update: { href: `${host}/files/${file.id}`, method: 'PUT' },
        delete: { href: `${host}/files/${file.id}`, method: 'DELETE' },
      },
    };
  }

  @Delete(':id')
  //   @UseGuards(OwnerOrAdminGuard)
  async remove(@Param('id') id: string) {
    const file = await this.service.delete(Number(id));
    const host = process.env.HOST;
    return {
      data: file,
      _link: {
        self: { href: `${host}/files/:id`, method: 'GET' },
        list: { href: `${host}/files`, method: 'GET' },
        create: { href: `${host}/files`, method: 'POST' },
        update: { href: `${host}/files/:id`, method: 'PUT' },
        delete: { href: `${host}/files/:id`, method: 'DELETE' },
      },
    };
  }
}
