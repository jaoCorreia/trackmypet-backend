import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UserRole } from 'src/database/entities/user-role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { OwnerOrAdminGuard } from 'src/common/guard/owner-or-admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      data: user,
      _link: {
        self: { href: `${host}/users/${user.id}`, method: 'GET' },
        list: { href: `${host}/users`, method: 'GET' },
        create: { href: `${host}/users`, method: 'POST' },
        update: { href: `${host}/users/${user.id}`, method: 'PUT' },
        delete: { href: `${host}/users/${user.id}`, method: 'DELETE' },
      },
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    const users = await this.service.findAll();
    const host = process.env.HOST;
    return {
      data: users,
      _link: {
        self: { href: `${host}/users/:id`, method: 'GET' },
        list: { href: `${host}/users`, method: 'GET' },
        create: { href: `${host}/users`, method: 'POST' },
        update: { href: `${host}/users/:id`, method: 'PUT' },
        delete: { href: `${host}/users/:id`, method: 'DELETE' },
      },
    };
  }

  @Get(':id')
  @UseGuards(OwnerOrAdminGuard)
  async findOne(@Param('id') id: string) {
    const user = await this.service.findOne(Number(id));
    const host = process.env.HOST;
    return {
      data: user,
      _link: {
        self: { href: `${host}/users/${user.id}`, method: 'GET' },
        list: { href: `${host}/users`, method: 'GET' },
        create: { href: `${host}/users`, method: 'POST' },
        update: { href: `${host}/users/${user.id}`, method: 'PUT' },
        delete: { href: `${host}/users/${user.id}`, method: 'DELETE' },
      },
    };
  }

  @Put(':id')
  @UseGuards(OwnerOrAdminGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.service.update(Number(id), dto);
    const host = process.env.HOST;
    return {
      data: user,
      _link: {
        self: { href: `${host}/users/${user.id}`, method: 'GET' },
        list: { href: `${host}/users`, method: 'GET' },
        create: { href: `${host}/users`, method: 'POST' },
        update: { href: `${host}/users/${user.id}`, method: 'PUT' },
        delete: { href: `${host}/users/${user.id}`, method: 'DELETE' },
      },
    };
  }

  @Delete(':id')
  @UseGuards(OwnerOrAdminGuard)
  async remove(@Param('id') id: string) {
    const user = await this.service.delete(Number(id));
    const host = process.env.HOST;
    return {
      data: user,
      _link: {
        self: { href: `${host}/users/:id`, method: 'GET' },
        list: { href: `${host}/users`, method: 'GET' },
        create: { href: `${host}/users`, method: 'POST' },
        update: { href: `${host}/users/:id`, method: 'PUT' },
        delete: { href: `${host}/users/:id`, method: 'DELETE' },
      },
    };
  }
}
