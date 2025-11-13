import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserRole } from 'src/database/entities/user-role.enum';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { FileCategoriesService } from './file-categories.service';
import { CreateFileCategoryDto, UpdateFileCategoryDto } from './dto';

interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}

@Controller('file_categories')
export class FileCategoriesController {
  constructor(private readonly service: FileCategoriesService) {}

  @Post()
  async create(@Body() dto: CreateFileCategoryDto) {
    const fileCategory = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      data: fileCategory,
      _link: {
        self: {
          href: `${host}/file_categories/${fileCategory.id}`,
          method: 'GET',
        },
        list: { href: `${host}/file_categories`, method: 'GET' },
        create: { href: `${host}/file_categories`, method: 'POST' },
        update: {
          href: `${host}/file_categories/${fileCategory.id}`,
          method: 'PUT',
        },
        delete: {
          href: `${host}/file_categories/${fileCategory.id}`,
          method: 'DELETE',
        },
      },
    };
  }

  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    const userId = user.role === UserRole.ADMIN ? undefined : Number(user.sub);
    const fileCategory = await this.service.findAll(userId);
    const host = process.env.HOST;
    return {
      data: fileCategory,
      _link: {
        self: { href: `${host}/file_categories/:id`, method: 'GET' },
        list: { href: `${host}/file_categories`, method: 'GET' },
        create: { href: `${host}/file_categories`, method: 'POST' },
        update: { href: `${host}/file_categories/:id`, method: 'PUT' },
        delete: { href: `${host}/file_categories/:id`, method: 'DELETE' },
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const fileCategory = await this.service.findOne(Number(id));
    const host = process.env.HOST;
    return {
      data: fileCategory,
      _link: {
        self: {
          href: `${host}/file_categories/${fileCategory.id}`,
          method: 'GET',
        },
        list: { href: `${host}/file_categories`, method: 'GET' },
        create: { href: `${host}/file_categories`, method: 'POST' },
        update: {
          href: `${host}/file_categories/${fileCategory.id}`,
          method: 'PUT',
        },
        delete: {
          href: `${host}/file_categories/${fileCategory.id}`,
          method: 'DELETE',
        },
      },
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFileCategoryDto) {
    const fileCategory = await this.service.update(Number(id), dto);
    const host = process.env.HOST;
    return {
      data: fileCategory,
      _link: {
        self: {
          href: `${host}/file_categories/${fileCategory.id}`,
          method: 'GET',
        },
        list: { href: `${host}/file_categories`, method: 'GET' },
        create: { href: `${host}/file_categories`, method: 'POST' },
        update: {
          href: `${host}/file_categories/${fileCategory.id}`,
          method: 'PUT',
        },
        delete: {
          href: `${host}/file_categories/${fileCategory.id}`,
          method: 'DELETE',
        },
      },
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const fileCategory = await this.service.delete(Number(id));
    const host = process.env.HOST;
    return {
      data: fileCategory,
      _link: {
        self: { href: `${host}/file_categories/:id`, method: 'GET' },
        list: { href: `${host}/file_categories`, method: 'GET' },
        create: { href: `${host}/file_categories`, method: 'POST' },
        update: { href: `${host}/file_categories/:id`, method: 'PUT' },
        delete: { href: `${host}/file_categories/:id`, method: 'DELETE' },
      },
    };
  }
}
