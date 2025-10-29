import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBreedDto, UpdateBreedDto } from './dto';
import { Breed } from 'src/database/entities/breed.entity';
import { Specie } from 'src/database/entities/specie.entity';

@Injectable()
export class BreedsService {
  constructor(
    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
    @InjectRepository(Specie)
    private readonly specieRepository: Repository<Specie>,
  ) {}

  async create(dto: CreateBreedDto) {
    // verificar se existe o specie id
    const specie = await this.specieRepository.findOne({
      where: { id: dto.specieId },
    });
    if (!specie) throw new NotFoundException('Specie not found');
    const breed = this.breedRepository.create({
      name: dto.name,
      specie: specie,
    });
    return await this.breedRepository.save(breed);
  }

  async findAll(name?: string, specieId?: number) {
    const where: any = {};
    if (name) {
      where.name = () => `LOWER(name) LIKE LOWER('%${name}%')`;
    }
    if (specieId) {
      where.specie = { id: specieId };
    }
    return await this.breedRepository.find({
      where,
      relations: ['specie'],
    });
  }

  async findOne(id: number) {
    const breed = await this.breedRepository.findOne({ where: { id } });
    if (!breed) throw new NotFoundException('Breed not found');
    return breed;
  }

  async update(id: number, dto: UpdateBreedDto) {
    const breed = await this.breedRepository.findOne({
      where: { id },
      relations: ['specie'],
    });
    if (!breed) throw new NotFoundException('Breed not found');

    if (dto.name) {
      breed.name = dto.name;
    }

    if (dto.specieId) {
      const specie = await this.specieRepository.findOne({
        where: { id: dto.specieId },
      });
      if (!specie) throw new NotFoundException('Specie not found');
      breed.specie = specie;
    }

    return await this.breedRepository.save(breed);
  }

  async delete(id: number) {
    const breed = await this.breedRepository.findOne({ where: { id } });
    if (!breed) throw new NotFoundException('Breed not found');
    return await this.breedRepository.softDelete(id);
  }
}
