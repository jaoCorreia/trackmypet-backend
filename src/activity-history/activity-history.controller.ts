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
import { CreateActivityHistoryDto, UpdateActivityHistoryDto } from './dto';
import { OwnerOrAdminGuard } from 'src/common/guard/owner-or-admin.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UserRole } from 'src/database/entities/user-role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ActivityHistoryService } from './activity-history.service';

@Controller('activity_history')
export class ActivityHistoryController {
  constructor(private readonly service: ActivityHistoryService) {}

  @Post()
  //   @UseGuards(OwnerOrAdminGuard)
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
  //   @UseGuards(RolesGuard)
  //   @Roles(UserRole.ADMIN)
  async findAll() {
    const history = await this.service.findAll();
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
  //   @UseGuards(OwnerOrAdminGuard)
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
  //   @UseGuards(OwnerOrAdminGuard)
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
  //   @UseGuards(OwnerOrAdminGuard)
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
