import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreateScheduleDto, UpdateScheduleDto } from "./dto";
import { OwnerOrAdminGuard } from "src/common/guard/owner-or-admin.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { UserRole } from "src/database/entities/user-role.enum";
import { Roles } from "src/common/decorator/roles.decorator";
import { ActivitySchedulesService } from "./activity-schedules.service";

@Controller('activity_schedules')
export class ActivitySchedulesController {
    constructor(private readonly service: ActivitySchedulesService){}

  @Post()
//   @UseGuards(OwnerOrAdminGuard)
  async create(@Body() dto: CreateScheduleDto) {
    const schedule = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      data: schedule,
      _link: {
        self: { href: `${host}/activity_schedules/${schedule.id}`, method: 'GET' },
        list: { href: `${host}/activity_schedules`, method: 'GET' },
        create: { href: `${host}/activity_schedules`, method: 'POST' },
        update: { href: `${host}/activity_schedules/${schedule.id}`, method: 'PUT' },
        delete: { href: `${host}/activity_schedules/${schedule.id}`, method: 'DELETE' },
      },
    };
  }    

  @Get()
//   @UseGuards(RolesGuard)
//   @Roles(UserRole.ADMIN)
  async findAll() {
    const schedules = await this.service.findAll();
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
        self: { href: `${host}/activity_schedules/${schedule.id}`, method: 'GET' },
        list: { href: `${host}/activity_schedules`, method: 'GET' },
        create: { href: `${host}/activity_schedules`, method: 'POST' },
        update: { href: `${host}/activity_schedules/${schedule.id}`, method: 'PUT' },
        delete: { href: `${host}/activity_schedules/${schedule.id}`, method: 'DELETE' },
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
        self: { href: `${host}/activity_schedules/${schedule.id}`, method: 'GET' },
        list: { href: `${host}/activity_schedules`, method: 'GET' },
        create: { href: `${host}/activity_schedules`, method: 'POST' },
        update: { href: `${host}/activity_schedules/${schedule.id}`, method: 'PUT' },
        delete: { href: `${host}/activity_schedules/${schedule.id}`, method: 'DELETE' },
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