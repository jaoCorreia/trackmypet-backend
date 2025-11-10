import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto, UpdateFileDto } from './dto';

@Controller('files')
export class FilesController {
  constructor(private readonly service: FilesService) {}

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
