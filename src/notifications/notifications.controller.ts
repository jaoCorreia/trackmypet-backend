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
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post()
  //   @UseGuards(OwnerOrAdminGuard)
  async create(@Body() dto: CreateNotificationDto) {
    const notification = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      data: notification,
      _link: {
        self: {
          href: `${host}/notifications/${notification.id}`,
          method: 'GET',
        },
        list: { href: `${host}/notifications`, method: 'GET' },
        create: { href: `${host}/notifications`, method: 'POST' },
        update: {
          href: `${host}/notifications/${notification.id}`,
          method: 'PUT',
        },
        delete: {
          href: `${host}/notifications/${notification.id}`,
          method: 'DELETE',
        },
      },
    };
  }

  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    const userId = user.role === 'admin' ? undefined : user.sub;
    const notifications = await this.service.findAll(userId);
    const host = process.env.HOST;
    return {
      data: notifications,
      _link: {
        self: { href: `${host}/notifications/:id`, method: 'GET' },
        list: { href: `${host}/notifications`, method: 'GET' },
        create: { href: `${host}/notifications`, method: 'POST' },
        update: { href: `${host}/notifications/:id`, method: 'PUT' },
        delete: { href: `${host}/notifications/:id`, method: 'DELETE' },
      },
    };
  }

  @Get(':id')
  //   @UseGuards(OwnerOrAdminGuard)
  async findOne(@Param('id') id: string) {
    const notification = await this.service.findOne(Number(id));
    const host = process.env.HOST;
    return {
      data: notification,
      _link: {
        self: {
          href: `${host}/notifications/${notification.id}`,
          method: 'GET',
        },
        list: { href: `${host}/notifications`, method: 'GET' },
        create: { href: `${host}/notifications`, method: 'POST' },
        update: {
          href: `${host}/notifications/${notification.id}`,
          method: 'PUT',
        },
        delete: {
          href: `${host}/notifications/${notification.id}`,
          method: 'DELETE',
        },
      },
    };
  }

  @Put(':id')
  //   @UseGuards(OwnerOrAdminGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateNotificationDto) {
    const notification = await this.service.update(Number(id), dto);
    const host = process.env.HOST;
    return {
      data: notification,
      _link: {
        self: {
          href: `${host}/notifications/${notification.id}`,
          method: 'GET',
        },
        list: { href: `${host}/notifications`, method: 'GET' },
        create: { href: `${host}/notifications`, method: 'POST' },
        update: {
          href: `${host}/notifications/${notification.id}`,
          method: 'PUT',
        },
        delete: {
          href: `${host}/notifications/${notification.id}`,
          method: 'DELETE',
        },
      },
    };
  }

  @Delete(':id')
  //   @UseGuards(OwnerOrAdminGuard)
  async remove(@Param('id') id: string) {
    const notification = await this.service.delete(Number(id));
    const host = process.env.HOST;
    return {
      data: notification,
      _link: {
        self: { href: `${host}/notifications/:id`, method: 'GET' },
        list: { href: `${host}/notifications`, method: 'GET' },
        create: { href: `${host}/notifications`, method: 'POST' },
        update: { href: `${host}/notifications/:id`, method: 'PUT' },
        delete: { href: `${host}/notifications/:id`, method: 'DELETE' },
      },
    };
  }

  @Post(':id/send')
  //   @UseGuards(OwnerOrAdminGuard)
  async sendNow(@Param('id') id: string) {
    const notification = await this.service.sendScheduledNotification(
      Number(id),
    );
    const host = process.env.HOST;
    return {
      data: notification,
      message: 'Push notification sent successfully',
      _link: {
        self: {
          href: `${host}/notifications/${notification.id}`,
          method: 'GET',
        },
      },
    };
  }
}
