import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateIncidentDto } from './dto';
import { IncidentsService } from './incidents.service';

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
