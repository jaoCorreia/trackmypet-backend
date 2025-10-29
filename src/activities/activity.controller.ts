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
import { OwnerOrAdminGuard } from 'src/common/guard/owner-or-admin.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UserRole } from 'src/database/entities/user-role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { CreateActivityDto, UpdateActivityDto } from './dto';
import { ActivitiesService } from './activity.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Post()
  //   @UseGuards(OwnerOrAdminGuard)
  async create(@Body() dto: CreateActivityDto) {
    const activity = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      data: activity,
      _link: {
        self: { href: `${host}/activities/${activity.id}`, method: 'GET' },
        list: { href: `${host}/activities`, method: 'GET' },
        create: { href: `${host}/activities`, method: 'POST' },
        update: { href: `${host}/activities/${activity.id}`, method: 'PUT' },
        delete: { href: `${host}/activities/${activity.id}`, method: 'DELETE' },
      },
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    const activities = await this.service.findAll();
    const host = process.env.HOST;
    return {
      data: activities,
      _link: {
        self: { href: `${host}/activities/:id`, method: 'GET' },
        list: { href: `${host}/activities`, method: 'GET' },
        create: { href: `${host}/activities`, method: 'POST' },
        update: { href: `${host}/activities/:id`, method: 'PUT' },
        delete: { href: `${host}/activities/:id`, method: 'DELETE' },
      },
    };
  }

  @Get(':id')
  //   @UseGuards(OwnerOrAdminGuard)
  async findOne(@Param('id') id: string) {
    const activity = await this.service.findOne(Number(id));
    const host = process.env.HOST;
    return {
      data: activity,
      _link: {
        self: { href: `${host}/activities/${activity.id}`, method: 'GET' },
        list: { href: `${host}/activities`, method: 'GET' },
        create: { href: `${host}/activities`, method: 'POST' },
        update: { href: `${host}/activities/${activity.id}`, method: 'PUT' },
        delete: { href: `${host}/activities/${activity.id}`, method: 'DELETE' },
      },
    };
  }

  @Put(':id')
  //   @UseGuards(OwnerOrAdminGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateActivityDto) {
    const activity = await this.service.update(Number(id), dto);
    const host = process.env.HOST;
    return {
      data: activity,
      _link: {
        self: { href: `${host}/activities/${activity.id}`, method: 'GET' },
        list: { href: `${host}/activities`, method: 'GET' },
        create: { href: `${host}/activities`, method: 'POST' },
        update: { href: `${host}/activities/${activity.id}`, method: 'PUT' },
        delete: { href: `${host}/activities/${activity.id}`, method: 'DELETE' },
      },
    };
  }

  @Delete(':id')
  //   @UseGuards(OwnerOrAdminGuard)
  async remove(@Param('id') id: string) {
    const activity = await this.service.delete(Number(id));
    const host = process.env.HOST;
    return {
      data: activity,
      _link: {
        self: { href: `${host}/activities/:id`, method: 'GET' },
        list: { href: `${host}/activities`, method: 'GET' },
        create: { href: `${host}/activities`, method: 'POST' },
        update: { href: `${host}/activities/:id`, method: 'PUT' },
        delete: { href: `${host}/activities/:id`, method: 'DELETE' },
      },
    };
  }
}
