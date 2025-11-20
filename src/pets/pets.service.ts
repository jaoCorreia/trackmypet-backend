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
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const breed = await this.breedRepository.findOne({
      where: { id: dto.breedId },
    });
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
    const qb = this.petRepository
      .createQueryBuilder('pet')
      .leftJoinAndSelect('pet.user', 'user')
      .leftJoinAndSelect('pet.breed', 'breed')
      .leftJoinAndSelect('breed.specie', 'specie');

    if (name) {
      qb.andWhere('LOWER(pet.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (userId) {
      qb.andWhere('user.id = :userId', { userId });
    }

    if (breedId) {
      qb.andWhere('breed.id = :breedId', { breedId });
    }

    return await qb.getMany();
  }

  async findOne(id: number) {
    const pet = await this.petRepository.findOne({
      where: { id },
      relations: ['user', 'breed', 'breed.species'],
    });
    if (!pet) throw new NotFoundException('Pet not found');
    return pet;
  }

  async update(id: number, dto: UpdatePetDto) {
    const pet = await this.petRepository.findOne({ where: { id } });
    if (!pet) throw new NotFoundException('Pet not found');

    const { userId, breedId, ...rest } = dto;

    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException('User not found');
      pet.user = user;
    }

    if (breedId) {
      const breed = await this.breedRepository.findOne({
        where: { id: breedId },
      });
      if (!breed) throw new NotFoundException('Breed not found');
      pet.breed = breed;
    }

    Object.assign(pet, rest);

    return await this.petRepository.save(pet);
  }

  async delete(id: number) {
    const pet = await this.petRepository.findOne({ where: { id } });
    if (!pet) throw new NotFoundException('Pet not found');
    return await this.petRepository.softDelete(id);
  }

  async updatePhoto(id: number, photoUrl: string) {
    const pet = await this.petRepository.findOne({ where: { id } });
    if (!pet) throw new NotFoundException('Pet not found');

    pet.photo = photoUrl;
    return await this.petRepository.save(pet);
  }
}
