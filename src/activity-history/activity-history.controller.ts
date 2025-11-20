import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { CreateActivityHistoryDto, UpdateActivityHistoryDto } from './dto';
import { ActivityHistoryService } from './activity-history.service';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Controller('activity_history')
export class ActivityHistoryController {
  constructor(private readonly service: ActivityHistoryService) {}

  @Post()
  async create(@Body() dto: CreateActivityHistoryDto) {
    const history = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      data: history,
      _link: {
        self: { href: `${host}/activity_history/${history.id}`, method: 'GET' },
        list: { href: `${host}/activity_history`, method: 'GET' },
        create: { href: `${host}/activity_history`, method: 'POST' },
        update: {
          href: `${host}/activity_history/${history.id}`,
          method: 'PUT',
        },
        delete: {
          href: `${host}/activity_history/${history.id}`,
          method: 'DELETE',
        },
      },
    };
  }

  @Get()
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('activityScheduleId') activityScheduleId?: string,
  ) {
    if (startDate && isNaN(Date.parse(startDate))) {
      throw new BadRequestException('Invalid startDate');
    }
    if (endDate && isNaN(Date.parse(endDate))) {
      throw new BadRequestException('Invalid endDate');
    }

    const userId = user.role === 'admin' ? undefined : user.sub;
    const history = await this.service.findAll(
      activityScheduleId ? Number(activityScheduleId) : undefined,
      startDate,
      endDate,
      userId,
    );
    const host = process.env.HOST;
    return {
      data: history,
      _link: {
        self: { href: `${host}/activity_history/:id`, method: 'GET' },
        list: { href: `${host}/activity_history`, method: 'GET' },
        create: { href: `${host}/activity_history`, method: 'POST' },
        update: { href: `${host}/activity_history/:id`, method: 'PUT' },
        delete: { href: `${host}/activity_history/:id`, method: 'DELETE' },
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const history = await this.service.findOne(Number(id));
    const host = process.env.HOST;
    return {
      data: history,
      _link: {
        self: { href: `${host}/activity_history/${history.id}`, method: 'GET' },
        list: { href: `${host}/activity_history`, method: 'GET' },
        create: { href: `${host}/activity_history`, method: 'POST' },
        update: {
          href: `${host}/activity_history/${history.id}`,
          method: 'PUT',
        },
        delete: {
          href: `${host}/activity_history/${history.id}`,
          method: 'DELETE',
        },
      },
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateActivityHistoryDto) {
    const history = await this.service.update(Number(id), dto);
    const host = process.env.HOST;
    return {
      data: history,
      _link: {
        self: { href: `${host}/activity_history/${history.id}`, method: 'GET' },
        list: { href: `${host}/activity_history`, method: 'GET' },
        create: { href: `${host}/activity_history`, method: 'POST' },
        update: {
          href: `${host}/activity_history/${history.id}`,
          method: 'PUT',
        },
        delete: {
          href: `${host}/activity_history/${history.id}`,
          method: 'DELETE',
        },
      },
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const history = await this.service.delete(Number(id));
    const host = process.env.HOST;
    return {
      data: history,
      _link: {
        self: { href: `${host}/activity_history/:id`, method: 'GET' },
        list: { href: `${host}/activity_history`, method: 'GET' },
        create: { href: `${host}/activity_history`, method: 'POST' },
        update: { href: `${host}/activity_history/:id`, method: 'PUT' },
        delete: { href: `${host}/activity_history/:id`, method: 'DELETE' },
      },
    };
  }
}
