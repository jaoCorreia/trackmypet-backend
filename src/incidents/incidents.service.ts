import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from 'src/database/entities/pet.entity';
import { Incident } from 'src/database/entities/incident.entity';
import { CreateIncidentDto } from './dto';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,

    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
  ) {}

  async create(dto: CreateIncidentDto) {
    const pet = await this.petRepository.findOne({ where: { id: dto.petId } });
    if (!pet) throw new NotFoundException('Pet not found');

    const incident = this.incidentRepository.create({
      phoneNumber: dto.phoneNumber,
      description: dto.description,
      pet,
    });

    return await this.incidentRepository.save(incident);
  }

  async findAll(userId?: number) {
    const queryBuilder = this.incidentRepository
      .createQueryBuilder('incident')
      .leftJoinAndSelect('incident.pet', 'pet')
      .leftJoinAndSelect('pet.user', 'user');

    if (userId) {
      queryBuilder.where('user.id = :userId', { userId });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: number) {
    const incident = await this.incidentRepository.findOne({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found');
    return incident;
  }

  async delete(id: number) {
    const incident = await this.incidentRepository.findOne({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found');
    return await this.incidentRepository.softDelete(id);
  }
}
