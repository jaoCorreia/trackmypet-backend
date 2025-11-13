import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateIncidentDto } from './dto';
import { IncidentsService } from './incidents.service';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { UserRole } from 'src/database/entities/user-role.enum';

interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly service: IncidentsService) {}

  @Post()
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
  async findAll(@CurrentUser() user: JwtPayload) {
    const userId = user.role === UserRole.ADMIN ? undefined : Number(user.sub);
    const incidents = await this.service.findAll(userId);
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
