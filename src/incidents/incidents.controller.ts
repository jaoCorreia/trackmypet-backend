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
import { CreateIncidentDto, UpdateIncidentDto } from './dto';
import { IncidentsService } from './incidents.service';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly service: IncidentsService) {}

  @Post()
  //   @UseGuards(OwnerOrAdminGuard)
  async create(@Body() dto: CreateIncidentDto) {
    const incident = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      data: incident,
      _link: {
        self: { href: `${host}/incidents/${incident.id}`, method: 'GET' },
        list: { href: `${host}/incidents`, method: 'GET' },
        create: { href: `${host}/incidents`, method: 'POST' },
        update: { href: `${host}/incidents/${incident.id}`, method: 'PUT' },
        delete: { href: `${host}/incidents/${incident.id}`, method: 'DELETE' },
      },
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    const incidents = await this.service.findAll();
    const host = process.env.HOST;
    return {
      data: incidents,
      _link: {
        self: { href: `${host}/incidents/:id`, method: 'GET' },
        list: { href: `${host}/incidents`, method: 'GET' },
        create: { href: `${host}/incidents`, method: 'POST' },
        update: { href: `${host}/incidents/:id`, method: 'PUT' },
        delete: { href: `${host}/incidents/:id`, method: 'DELETE' },
      },
    };
  }

  @Get(':id')
  //   @UseGuards(OwnerOrAdminGuard)
  async findOne(@Param('id') id: string) {
    const incident = await this.service.findOne(Number(id));
    const host = process.env.HOST;
    return {
      data: incident,
      _link: {
        self: { href: `${host}/incidents/${incident.id}`, method: 'GET' },
        list: { href: `${host}/incidents`, method: 'GET' },
        create: { href: `${host}/incidents`, method: 'POST' },
        update: { href: `${host}/incidents/${incident.id}`, method: 'PUT' },
        delete: { href: `${host}/incidents/${incident.id}`, method: 'DELETE' },
      },
    };
  }

  @Delete(':id')
  //   @UseGuards(OwnerOrAdminGuard)
  async remove(@Param('id') id: string) {
    const incident = await this.service.delete(Number(id));
    const host = process.env.HOST;
    return {
      data: incident,
      _link: {
        self: { href: `${host}/incidents/:id`, method: 'GET' },
        list: { href: `${host}/incidents`, method: 'GET' },
        create: { href: `${host}/incidents`, method: 'POST' },
        update: { href: `${host}/incidents/:id`, method: 'PUT' },
        delete: { href: `${host}/incidents/:id`, method: 'DELETE' },
      },
    };
  }
}
