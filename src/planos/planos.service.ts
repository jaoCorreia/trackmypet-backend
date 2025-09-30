import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plano, PlanoEntity } from 'src/database/entities/plano.entity';
import { Repository } from 'typeorm';
import { CreatePlanoDto, UpdatePlanoDto } from './dto';

@Injectable()
export class PlanosService {
  constructor(
    @InjectRepository(PlanoEntity)
    private readonly planoRepository: Repository<Plano>,
  ) {}

  async create(dto: CreatePlanoDto) {
    const plano = this.planoRepository.create({
      ...dto,
      created_at: new Date().toISOString(),
    });
    return await this.planoRepository.create(plano);
  }

  async findAll() {
    return await this.planoRepository.find();
  }

  async findOne(id: number) {
    const plano = await this.planoRepository.findOne({ where: { id } });
    if (!plano) throw new NotFoundException('Plano not found');
    return plano;
  }

  async update(id: number, dto: UpdatePlanoDto) {
    const plano = await this.planoRepository.findOne({ where: { id } });
    if (!plano) throw new NotFoundException('Plano not found');
    Object.assign(plano, dto);
    return await this.planoRepository.save(plano);
  }

  async remove(id: number) {
    const plano = await this.planoRepository.findOne({ where: { id } });
    if (!plano) throw new NotFoundException('Plano not found');
    await this.planoRepository.remove(plano);
    return plano;
  }
}
