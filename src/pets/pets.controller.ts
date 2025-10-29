import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePetDto, UpdatePetDto } from './dto';
import { PetsService } from './pets.service';
import { PetOwnerOrAdminGuard } from 'src/common/guard/pet-owner-or-admin.guard';
import { Pet } from 'src/database/entities/pet.entity';
import { UserRole } from 'src/database/entities/user-role.enum';

interface AuthenticatedRequest {
  user: {
    sub: number;
    email: string;
    role: UserRole;
  };
  params: {
    id?: string;
  };
}

@Controller('pets')
export class PetsController {
  constructor(private readonly service: PetsService) {}

  @Post()
  async create(@Body() dto: CreatePetDto) {
    const pet = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      data: pet,
      _link: {
        self: { href: `${host}/pets/${pet.id}`, method: 'GET' },
        list: { href: `${host}/pets`, method: 'GET' },
        create: { href: `${host}/pets`, method: 'POST' },
        update: { href: `${host}/pets/${pet.id}`, method: 'PUT' },
        delete: { href: `${host}/pets/${pet.id}`, method: 'DELETE' },
      },
    };
  }

  @Get()
  async findAll(@Req() request: AuthenticatedRequest) {
    let pets: Pet[] = [];
    if (request.user.role === UserRole.ADMIN) {
      pets = await this.service.findAll();
    } else {
      pets = await this.service.findAll(undefined, request.user.sub);
    }

    const host = process.env.HOST;
    return {
      data: pets,
      _link: {
        self: { href: `${host}/pets/:id`, method: 'GET' },
        list: { href: `${host}/pets`, method: 'GET' },
        create: { href: `${host}/pets`, method: 'POST' },
        update: { href: `${host}/pets/:id`, method: 'PUT' },
        delete: { href: `${host}/pets/:id`, method: 'DELETE' },
      },
    };
  }

  @Get(':id')
  @UseGuards(PetOwnerOrAdminGuard)
  async findOne(@Param('id') id: string) {
    const pet = await this.service.findOne(Number(id));
    const host = process.env.HOST;
    return {
      data: pet,
      _link: {
        self: { href: `${host}/pets/${pet.id}`, method: 'GET' },
        list: { href: `${host}/pets`, method: 'GET' },
        create: { href: `${host}/pets`, method: 'POST' },
        update: { href: `${host}/pets/${pet.id}`, method: 'PUT' },
        delete: { href: `${host}/pets/${pet.id}`, method: 'DELETE' },
      },
    };
  }

  @Put(':id')
  @UseGuards(PetOwnerOrAdminGuard)
  async update(@Param('id') id: string, @Body() dto: UpdatePetDto) {
    const pet = await this.service.update(Number(id), dto);
    const host = process.env.HOST;
    return {
      data: pet,
      _link: {
        self: { href: `${host}/pets/${pet.id}`, method: 'GET' },
        list: { href: `${host}/pets`, method: 'GET' },
        create: { href: `${host}/pets`, method: 'POST' },
        update: { href: `${host}/pets/${pet.id}`, method: 'PUT' },
        delete: { href: `${host}/pets/${pet.id}`, method: 'DELETE' },
      },
    };
  }

  @Delete(':id')
  @UseGuards(PetOwnerOrAdminGuard)
  async remove(@Param('id') id: string) {
    const pet = await this.service.delete(Number(id));
    const host = process.env.HOST;
    return {
      data: pet,
      _link: {
        self: { href: `${host}/pets/:id`, method: 'GET' },
        list: { href: `${host}/pets`, method: 'GET' },
        create: { href: `${host}/pets`, method: 'POST' },
        update: { href: `${host}/pets/:id`, method: 'PUT' },
        delete: { href: `${host}/pets/:id`, method: 'DELETE' },
      },
    };
  }
}
