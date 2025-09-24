import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { PlanosService } from './planos.service';
import { CreatePlanoDto, UpdatePlanoDto } from './dto';

@Controller('planos')
export class PlanosController {
  constructor(private readonly service: PlanosService) {}

  @Post()
  async create(@Body() dto: CreatePlanoDto) {
    const plano = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      plano,
      _link: {
        self: { href: `${host}/planos/${plano.id}`, method: 'GET' },
        list: { href: `${host}/planos`, method: 'GET' },
        create: { href: `${host}/planos`, method: 'POST' },
        update: { href: `${host}/planos/${plano.id}`, method: 'PUT' },
        delete: { href: `${host}/planos/${plano.id}`, method: 'DELETE' },
      },
    };
  }

  @Get()
  async findAll() {
    const planos = await this.service.findAll();
    const host = process.env.HOST;
    return {
      planos,
      _link: {
        self: { href: `${host}/planos/:id`, method: 'GET' },
        list: { href: `${host}/planos`, method: 'GET' },
        create: { href: `${host}/planos`, method: 'POST' },
        update: { href: `${host}/planos/:id`, method: 'PUT' },
        delete: { href: `${host}/planos/:id`, method: 'DELETE' },
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const plano = await this.service.findOne(Number(id));
    const host = process.env.HOST;
    return {
      plano,
      _link: {
        self: { href: `${host}/planos/${id}`, method: 'GET' },
        list: { href: `${host}/planos`, method: 'GET' },
        create: { href: `${host}/planos`, method: 'POST' },
        update: { href: `${host}/planos/${id}`, method: 'PUT' },
        delete: { href: `${host}/planos/${id}`, method: 'DELETE' },
      },
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePlanoDto) {
    const plano = await this.service.update(Number(id), dto);
    const host = process.env.HOST;
    return {
      plano,
      _link: {
        self: { href: `${host}/planos/${id}`, method: 'GET' },
        list: { href: `${host}/planos`, method: 'GET' },
        create: { href: `${host}/planos`, method: 'POST' },
        update: { href: `${host}/planos/${id}`, method: 'PUT' },
        delete: { href: `${host}/planos/${id}`, method: 'DELETE' },
      },
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const plano = await this.service.remove(Number(id));
    const host = process.env.HOST;
    return {
      plano,
      _link: {
        self: { href: `${host}/planos/:id`, method: 'GET' },
        list: { href: `${host}/planos`, method: 'GET' },
        create: { href: `${host}/planos`, method: 'POST' },
        update: { href: `${host}/planos/:id`, method: 'PUT' },
        delete: { href: `${host}/planos/:id`, method: 'DELETE' },
      },
    };
  }
}
