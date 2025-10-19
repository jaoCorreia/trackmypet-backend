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
import { CreateBreedDto, UpdateBreedDto } from './dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from 'src/database/entities/user-role.enum';
import { BreedsService } from './breeds.service';

@Controller('breeds')
export class BreedsController {
  constructor(private readonly service: BreedsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateBreedDto) {
    const breed = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      data: breed,
      _link: {
        self: { href: `${host}/breeds/${breed.id}`, method: 'GET' },
        list: { href: `${host}/breeds`, method: 'GET' },
        create: { href: `${host}/breeds`, method: 'POST' },
        update: { href: `${host}/breeds/${breed.id}`, method: 'PUT' },
        delete: { href: `${host}/breeds/${breed.id}`, method: 'DELETE' },
      },
    };
  }

  @Get()
  async findAll() {
    const breeds = await this.service.findAll();
    const host = process.env.HOST;
    return {
      data: breeds,
      _link: {
        self: { href: `${host}/breeds/:id`, method: 'GET' },
        list: { href: `${host}/breeds`, method: 'GET' },
        create: { href: `${host}/breeds`, method: 'POST' },
        update: { href: `${host}/breeds/:id`, method: 'PUT' },
        delete: { href: `${host}/breeds/:id`, method: 'DELETE' },
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const breed = await this.service.findOne(Number(id));
    const host = process.env.HOST;
    return {
      data: breed,
      _link: {
        self: { href: `${host}/breeds/${breed.id}`, method: 'GET' },
        list: { href: `${host}/breeds`, method: 'GET' },
        create: { href: `${host}/breeds`, method: 'POST' },
        update: { href: `${host}/breeds/${breed.id}`, method: 'PUT' },
        delete: { href: `${host}/breeds/${breed.id}`, method: 'DELETE' },
      },
    };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateBreedDto) {
    const breed = await this.service.update(Number(id), dto);
    const host = process.env.HOST;
    return {
      data: breed,
      _link: {
        self: { href: `${host}/breeds/${breed.id}`, method: 'GET' },
        list: { href: `${host}/breeds`, method: 'GET' },
        create: { href: `${host}/breeds`, method: 'POST' },
        update: { href: `${host}/breeds/${breed.id}`, method: 'PUT' },
        delete: { href: `${host}/breeds/${breed.id}`, method: 'DELETE' },
      },
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    const breed = await this.service.delete(Number(id));
    const host = process.env.HOST;
    return {
      data: breed,
      _link: {
        self: { href: `${host}/breeds/:id`, method: 'GET' },
        list: { href: `${host}/breeds`, method: 'GET' },
        create: { href: `${host}/breeds`, method: 'POST' },
        update: { href: `${host}/breeds/:id`, method: 'PUT' },
        delete: { href: `${host}/breeds/:id`, method: 'DELETE' },
      },
    };
  }
}
