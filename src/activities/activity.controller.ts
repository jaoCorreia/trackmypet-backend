import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { CreateActivityDto, UpdateActivityDto } from './dto';
import { ActivitiesService } from './activity.service';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Post()
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
  async findAll(@CurrentUser() user: JwtPayload) {
    const userId = user.role === 'admin' ? undefined : user.sub;
    const activities = await this.service.findAll(userId);
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
