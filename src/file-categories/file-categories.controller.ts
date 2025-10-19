import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { OwnerOrAdminGuard } from "src/common/guard/owner-or-admin.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { UserRole } from "src/database/entities/user-role.enum";
import { Roles } from "src/common/decorator/roles.decorator";
import { FileCategoriesService } from "./file-categories.service";
import { CreateFileCategoryDto, UpdateFileCategoryDto } from "./dto";

@Controller('file_categories')
export class FileCategoriesController {
    constructor(private readonly service: FileCategoriesService){}

  @Post()
//   @UseGuards(OwnerOrAdminGuard)
  async create(@Body() dto: CreateFileCategoryDto) {
    const fileCategory = await this.service.create(dto);
    const host = process.env.HOST;
    return {
      data: fileCategory,
      _link: {
        self: { href: `${host}/file_categories/${fileCategory.id}`, method: 'GET' },
        list: { href: `${host}/file_categories`, method: 'GET' },
        create: { href: `${host}/file_categories`, method: 'POST' },
        update: { href: `${host}/file_categories/${fileCategory.id}`, method: 'PUT' },
        delete: { href: `${host}/file_categories/${fileCategory.id}`, method: 'DELETE' },
      },
    };
  }    

  @Get()
//   @UseGuards(RolesGuard)
//   @Roles(UserRole.ADMIN)
  async findAll() {
    const fileCategory = await this.service.findAll();
    const host = process.env.HOST;
    return {
      data: fileCategory,
      _link: {
        self: { href: `${host}/file_categories/:id`, method: 'GET' },
        list: { href: `${host}/file_categories`, method: 'GET' },
        create: { href: `${host}/file_categories`, method: 'POST' },
        update: { href: `${host}/file_categories/:id`, method: 'PUT' },
        delete: { href: `${host}/file_categories/:id`, method: 'DELETE' },
      },
    };
  }

  @Get(':id')
//   @UseGuards(OwnerOrAdminGuard)
  async findOne(@Param('id') id: string) {
    const fileCategory = await this.service.findOne(Number(id));
    const host = process.env.HOST;
    return {
      data: fileCategory,
      _link: {
        self: { href: `${host}/file_categories/${fileCategory.id}`, method: 'GET' },
        list: { href: `${host}/file_categories`, method: 'GET' },
        create: { href: `${host}/file_categories`, method: 'POST' },
        update: { href: `${host}/file_categories/${fileCategory.id}`, method: 'PUT' },
        delete: { href: `${host}/file_categories/${fileCategory.id}`, method: 'DELETE' },
      },
    };
  }
  
  @Put(':id')
//   @UseGuards(OwnerOrAdminGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateFileCategoryDto) {
    const fileCategory = await this.service.update(Number(id), dto);
    const host = process.env.HOST;
    return {
      data: fileCategory,
      _link: {
        self: { href: `${host}/file_categories/${fileCategory.id}`, method: 'GET' },
        list: { href: `${host}/file_categories`, method: 'GET' },
        create: { href: `${host}/file_categories`, method: 'POST' },
        update: { href: `${host}/file_categories/${fileCategory.id}`, method: 'PUT' },
        delete: { href: `${host}/file_categories/${fileCategory.id}`, method: 'DELETE' },
      },
    };
  }

  @Delete(':id')
//   @UseGuards(OwnerOrAdminGuard)
  async remove(@Param('id') id: string) {
    const fileCategory = await this.service.delete(Number(id));
    const host = process.env.HOST;
    return {
      data: fileCategory,
      _link: {
        self: { href: `${host}/file_categories/:id`, method: 'GET' },
        list: { href: `${host}/file_categories`, method: 'GET' },
        create: { href: `${host}/file_categories`, method: 'POST' },
        update: { href: `${host}/file_categories/:id`, method: 'PUT' },
        delete: { href: `${host}/file_categories/:id`, method: 'DELETE' },
      },
    };
  }  
}