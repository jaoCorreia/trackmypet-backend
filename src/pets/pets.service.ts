import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePetDto, UpdatePetDto } from './dto';
import { Breed } from 'src/database/entities/breed.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from 'src/database/entities/pet.entity';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
  ) {}

  async create(dto: CreatePetDto) {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const breed = await this.breedRepository.findOne({ where: { id: dto.breedId } });
    if (!breed) throw new NotFoundException('Breed not found');

    const pet = this.petRepository.create({
      name: dto.name,
      sex: dto.sex,
      photo: dto.photo,
      age: dto.age,
      bio: dto.bio,
      user,
      breed, 
    });
    
    return await this.petRepository.save(pet);
  }

  async findAll(name?: string, userId?: number, breedId?: number) {
    const where: any = {};
    if (name) where.name = () => `LOWER(name) LIKE LOWER('%${name}%')`;
    if (userId) where.user = { id: userId };
    if (breedId) where.breed = { id: breedId };

    return await this.petRepository.find({
      where,
      relations: ['user', 'breed'],
    });
  }

  async findOne(id: number) {
    const pet = await this.petRepository.findOne({ where: { id } });
    if (!pet) throw new NotFoundException('Pet not found');
    return pet;
  }

  async update(id: number, dto: UpdatePetDto) {
    const pet = await this.petRepository.findOne({ where: { id } });
    if (!pet) throw new NotFoundException('Pet not found');

    if (dto.name) pet.name = dto.name;

    if (dto.userId) {
      const user = await this.userRepository.findOne({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException('User not found');
      pet.user = user;
    }

    if (dto.breedId) {
      const breed = await this.breedRepository.findOne({ where: { id: dto.breedId } });
      if (!breed) throw new NotFoundException('Breed not found');
      pet.breed = breed;
    }

    return await this.petRepository.save(pet);
  }

  async delete(id: number) {
    const pet = await this.petRepository.findOne({ where: { id } });
    if (!pet) throw new NotFoundException('Pet not found');
    return await this.petRepository.softDelete(id);
  }
}
