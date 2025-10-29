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
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UserRole } from 'src/database/entities/user-role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { AddressesService } from './addresses.service';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly service: AddressesService) {}

  @Post()
  async create(@Body() dto: CreateAddressDto) {
    const address = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      data: address,
      _link: {
        self: { href: `${host}/addresses/${address.id}`, method: 'GET' },
        list: { href: `${host}/addresses`, method: 'GET' },
        create: { href: `${host}/addresses`, method: 'POST' },
        update: { href: `${host}/addresses/${address.id}`, method: 'PUT' },
        delete: { href: `${host}/addresses/${address.id}`, method: 'DELETE' },
      },
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    const addresses = await this.service.findAll();
    const host = process.env.HOST;
    return {
      data: addresses,
      _link: {
        self: { href: `${host}/addresses/:id`, method: 'GET' },
        list: { href: `${host}/addresses`, method: 'GET' },
        create: { href: `${host}/addresses`, method: 'POST' },
        update: { href: `${host}/addresses/:id`, method: 'PUT' },
        delete: { href: `${host}/addresses/:id`, method: 'DELETE' },
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const address = await this.service.findOne(Number(id));
    const host = process.env.HOST;
    return {
      data: address,
      _link: {
        self: { href: `${host}/addresses/${address.id}`, method: 'GET' },
        list: { href: `${host}/addresses`, method: 'GET' },
        create: { href: `${host}/addresses`, method: 'POST' },
        update: { href: `${host}/addresses/${address.id}`, method: 'PUT' },
        delete: { href: `${host}/addresses/${address.id}`, method: 'DELETE' },
      },
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
    const address = await this.service.update(Number(id), dto);
    const host = process.env.HOST;
    return {
      data: address,
      _link: {
        self: { href: `${host}/addresses/${address.id}`, method: 'GET' },
        list: { href: `${host}/addresses`, method: 'GET' },
        create: { href: `${host}/addresses`, method: 'POST' },
        update: { href: `${host}/addresses/${address.id}`, method: 'PUT' },
        delete: { href: `${host}/addresses/${address.id}`, method: 'DELETE' },
      },
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const address = await this.service.delete(Number(id));
    const host = process.env.HOST;
    return {
      data: address,
      _link: {
        self: { href: `${host}/addresses/:id`, method: 'GET' },
        list: { href: `${host}/addresses`, method: 'GET' },
        create: { href: `${host}/addresses`, method: 'POST' },
        update: { href: `${host}/addresses/:id`, method: 'PUT' },
        delete: { href: `${host}/addresses/:id`, method: 'DELETE' },
      },
    };
  }
}
