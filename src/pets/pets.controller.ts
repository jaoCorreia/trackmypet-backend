import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreatePetDto, UpdatePetDto } from "./dto";
import { PetsService } from "./pets.service";
import { OwnerOrAdminGuard } from "src/common/guard/owner-or-admin.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { User } from "src/database/entities/user.entity";
import { UserRole } from "src/database/entities/user-role.enum";
import { Roles } from "src/common/decorator/roles.decorator";

@Controller('pets')
export class PetController {
    constructor(private readonly service: PetsService){}

  @Post()
//   @UseGuards(OwnerOrAdminGuard)
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
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    const pets = await this.service.findAll();
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
//   @UseGuards(OwnerOrAdminGuard)
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
//   @UseGuards(OwnerOrAdminGuard)
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
//   @UseGuards(OwnerOrAdminGuard)
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