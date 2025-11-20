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
import { CreateScheduleDto, UpdateScheduleDto } from './dto';
import { ActivitySchedulesService } from './activity-schedules.service';

@Controller('activity_schedules')
export class ActivitySchedulesController {
  constructor(private readonly service: ActivitySchedulesService) {}

  @Post()
  async create(@Body() dto: CreateScheduleDto) {
    const schedule = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      data: schedule,
      _link: {
        self: {
          href: `${host}/activity_schedules/${schedule.id}`,
          method: 'GET',
        },
        list: { href: `${host}/activity_schedules`, method: 'GET' },
        create: { href: `${host}/activity_schedules`, method: 'POST' },
        update: {
          href: `${host}/activity_schedules/${schedule.id}`,
          method: 'PUT',
        },
        delete: {
          href: `${host}/activity_schedules/${schedule.id}`,
          method: 'DELETE',
        },
      },
    };
  }

  @Get()
  async findAll(
    @Query('petId') petId?: string,
    @Query('activityId') activityId?: string,
    @Query('weekDays') weekDays?: string | string[],
    @Query('isRecurring') isRecurring?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('today') today?: string,
  ) {
    if (startDate && isNaN(Date.parse(startDate))) {
      throw new BadRequestException('Invalid startDate');
    }
    if (endDate && isNaN(Date.parse(endDate))) {
      throw new BadRequestException('Invalid endDate');
    }

    let weekDayArray: number[] | undefined;
    if (weekDays) {
      if (Array.isArray(weekDays)) {
        weekDayArray = weekDays.map((d) => Number(d));
      } else {
        try {
          const parsed: unknown = JSON.parse(weekDays);
          if (Array.isArray(parsed)) {
            weekDayArray = parsed.map((d) => Number(d));
          } else {
            weekDayArray = [Number(weekDays)];
          }
        } catch {
          weekDayArray = [Number(weekDays)];
        }
      }
    }

    const schedules =
      today === 'true'
        ? await this.service.findForToday(
            petId ? Number(petId) : undefined,
            activityId ? Number(activityId) : undefined,
          )
        : await this.service.findAll(
            petId ? Number(petId) : undefined,
            activityId ? Number(activityId) : undefined,
            weekDayArray,
            isRecurring,
            startDate,
            endDate,
          );
    const host = process.env.HOST;
    return {
      data: schedules,
      _link: {
        self: { href: `${host}/activity_schedules/:id`, method: 'GET' },
        list: { href: `${host}/activity_schedules`, method: 'GET' },
        create: { href: `${host}/activity_schedules`, method: 'POST' },
        update: { href: `${host}/activity_schedules/:id`, method: 'PUT' },
        delete: { href: `${host}/activity_schedules/:id`, method: 'DELETE' },
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const schedule = await this.service.findOne(Number(id));
    const host = process.env.HOST;
    return {
      data: schedule,
      _link: {
        self: {
          href: `${host}/activity_schedules/${schedule.id}`,
          method: 'GET',
        },
        list: { href: `${host}/activity_schedules`, method: 'GET' },
        create: { href: `${host}/activity_schedules`, method: 'POST' },
        update: {
          href: `${host}/activity_schedules/${schedule.id}`,
          method: 'PUT',
        },
        delete: {
          href: `${host}/activity_schedules/${schedule.id}`,
          method: 'DELETE',
        },
      },
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    const schedule = await this.service.update(Number(id), dto);
    const host = process.env.HOST;
    return {
      data: schedule,
      _link: {
        self: {
          href: `${host}/activity_schedules/${schedule.id}`,
          method: 'GET',
        },
        list: { href: `${host}/activity_schedules`, method: 'GET' },
        create: { href: `${host}/activity_schedules`, method: 'POST' },
        update: {
          href: `${host}/activity_schedules/${schedule.id}`,
          method: 'PUT',
        },
        delete: {
          href: `${host}/activity_schedules/${schedule.id}`,
          method: 'DELETE',
        },
      },
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const schedule = await this.service.delete(Number(id));
    const host = process.env.HOST;
    return {
      data: schedule,
      _link: {
        self: { href: `${host}/activity_schedules/:id`, method: 'GET' },
        list: { href: `${host}/activity_schedules`, method: 'GET' },
        create: { href: `${host}/activity_schedules`, method: 'POST' },
        update: { href: `${host}/activity_schedules/:id`, method: 'PUT' },
        delete: { href: `${host}/activity_schedules/:id`, method: 'DELETE' },
      },
    };
  }
}
