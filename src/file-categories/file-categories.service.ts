import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileCategory } from 'src/database/entities/file-category.entity';
import { User } from 'src/database/entities/user.entity';
import { CreateFileCategoryDto, UpdateFileCategoryDto } from './dto';

@Injectable()
export class FileCategoriesService {
  constructor(
    @InjectRepository(FileCategory)
    private readonly fileCategoryRepository: Repository<FileCategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateFileCategoryDto) {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const fileCategory = this.fileCategoryRepository.create({
      name: dto.name,
      user,
    });

    return await this.fileCategoryRepository.save(fileCategory);
  }

  async findAll(userId?: number) {
    const where: any = {};
    if (userId) where.user = { id: userId };

    return await this.fileCategoryRepository.find({
      where,
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const fileCategory = await this.fileCategoryRepository.findOne({
      where: { id },
    });
    if (!fileCategory) throw new NotFoundException('File Category not found');
    return fileCategory;
  }

  async update(id: number, dto: UpdateFileCategoryDto = {}) {
    const fileCategory = await this.fileCategoryRepository.findOne({
      where: { id },
    });
    if (!fileCategory) throw new NotFoundException('File Category not found');

    const { userId = null, ...rest } = dto;

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      fileCategory.user = user;
    }

    Object.assign(fileCategory, rest);

    return await this.fileCategoryRepository.save(fileCategory);
  }

  async delete(id: number) {
    const fileCategory = await this.fileCategoryRepository.findOne({
      where: { id },
    });
    if (!fileCategory) throw new NotFoundException('File Category not found');
    return await this.fileCategoryRepository.softDelete(id);
  }
}
