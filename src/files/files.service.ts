import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from 'src/database/entities/pet.entity';
import { FileCategory } from 'src/database/entities/file-category.entity';
import { CreateFileDto, UpdateFileDto } from './dto';
import {File} from 'src/database/entities/file.entity'

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,

    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,

    @InjectRepository(FileCategory)
    private readonly fileCategoryRepository: Repository<FileCategory>,
  ) {}

  async create(dto: CreateFileDto) {
    const pet = await this.petRepository.findOne({ where: { id: dto.petId } });
    if (!pet) throw new NotFoundException('Pet not found');

    const fileCategory = await this.fileCategoryRepository.findOne({ where: { id: dto.fileCategoryId } });
    if (!fileCategory) throw new NotFoundException('File Category not found');

    const file = this.fileRepository.create({
    fileUrl: dto.fileUrl,
    name: dto.name,
    pet:pet,
    fileCategory: fileCategory
    });
    
    return await this.fileRepository.save(file);
  }

  async findAll(petId?: number, fileCategoryId?: number) {
    const where: any = {};
    if (petId) where.pet = { id: petId };
    if (fileCategoryId) where.file_category = { id: fileCategoryId };

    return await this.fileRepository.find({
      where,
      relations: ['pet','file_category'],
    });
  }

  async findOne(id: number) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) throw new NotFoundException('File not found');
    return file;
  }

    async update(id: number, dto: UpdateFileDto) {
        const file = await this.fileRepository.findOne({ where: { id } });
        if (!file) throw new NotFoundException('File not found');
        
        const {petId = null, fileCategoryId=null, ...rest} = dto;

        if (petId) {
            const pet = await this.petRepository.findOne({ where: { id: dto.petId } });
            if (!pet) throw new NotFoundException('Pet not found');
            file.pet = pet;
        }

        if (fileCategoryId) {
            const fileCategory = await this.fileCategoryRepository.findOne({ where: { id: dto.fileCategoryId } });
            if (!fileCategory) throw new NotFoundException('File Category not found');
            file.fileCategory = fileCategory;
        }

        Object.assign(file, rest);

        return await this.fileRepository.save(file);
    }

  async delete(id: number) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) throw new NotFoundException('File not found');
    return await this.fileRepository.softDelete(id);
  }
}