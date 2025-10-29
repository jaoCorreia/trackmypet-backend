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
import { SpeciesService } from './species.service';
import { CreateSpecieDto, UpdateSpecieDto } from './dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from 'src/database/entities/user-role.enum';

@Controller('species')
export class SpeciesController {
  constructor(private readonly service: SpeciesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateSpecieDto) {
    const specie = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      data: specie,
      _link: {
        self: { href: `${host}/species/${specie.id}`, method: 'GET' },
        list: { href: `${host}/species`, method: 'GET' },
        create: { href: `${host}/species`, method: 'POST' },
        update: { href: `${host}/species/${specie.id}`, method: 'PUT' },
        delete: { href: `${host}/species/${specie.id}`, method: 'DELETE' },
      },
    };
  }

  @Get()
  async findAll() {
    const species = await this.service.findAll();
    const host = process.env.HOST;
    return {
      data: species,
      _link: {
        self: { href: `${host}/species/:id`, method: 'GET' },
        list: { href: `${host}/species`, method: 'GET' },
        create: { href: `${host}/species`, method: 'POST' },
        update: { href: `${host}/species/:id`, method: 'PUT' },
        delete: { href: `${host}/species/:id`, method: 'DELETE' },
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const specie = await this.service.findOne(Number(id));
    const host = process.env.HOST;
    return {
      data: specie,
      _link: {
        self: { href: `${host}/species/${specie.id}`, method: 'GET' },
        list: { href: `${host}/species`, method: 'GET' },
        create: { href: `${host}/species`, method: 'POST' },
        update: { href: `${host}/species/${specie.id}`, method: 'PUT' },
        delete: { href: `${host}/species/${specie.id}`, method: 'DELETE' },
      },
    };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateSpecieDto) {
    const specie = await this.service.update(Number(id), dto);
    const host = process.env.HOST;
    return {
      data: specie,
      _link: {
        self: { href: `${host}/species/${specie.id}`, method: 'GET' },
        list: { href: `${host}/species`, method: 'GET' },
        create: { href: `${host}/species`, method: 'POST' },
        update: { href: `${host}/species/${specie.id}`, method: 'PUT' },
        delete: { href: `${host}/species/${specie.id}`, method: 'DELETE' },
      },
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    const specie = await this.service.delete(Number(id));
    const host = process.env.HOST;
    return {
      data: specie,
      _link: {
        self: { href: `${host}/species/:id`, method: 'GET' },
        list: { href: `${host}/species`, method: 'GET' },
        create: { href: `${host}/species`, method: 'POST' },
        update: { href: `${host}/species/:id`, method: 'PUT' },
        delete: { href: `${host}/species/:id`, method: 'DELETE' },
      },
    };
  }
}
