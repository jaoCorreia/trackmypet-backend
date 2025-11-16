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
    @Query('weekDay') weekDay?: number,
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
    const schedules =
      today === 'true'
        ? await this.service.findForToday(
            petId ? Number(petId) : undefined,
            activityId ? Number(activityId) : undefined,
          )
        : await this.service.findAll(
            petId ? Number(petId) : undefined,
            activityId ? Number(activityId) : undefined,
            weekDay,
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
  //   @UseGuards(OwnerOrAdminGuard)
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
  //   @UseGuards(OwnerOrAdminGuard)
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
  //   @UseGuards(OwnerOrAdminGuard)
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
