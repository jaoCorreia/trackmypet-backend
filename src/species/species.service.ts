import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Specie } from "src/database/entities/specie.entity";
import { Repository } from "typeorm";
import { CreateSpecieDto, UpdateSpecieDto } from "./dto";

@Injectable()
export class SpeciesService {
    constructor(
        @InjectRepository(Specie)
        private readonly specieRepository: Repository<Specie>
    ) {}

    async create(dto:CreateSpecieDto){
        const specie = this.specieRepository.create(dto);
        return await this.specieRepository.save(specie);
    }

    async findAll(){
        const species = await this.specieRepository.find();
        return species;
    }

    async findOne(id: number){
        const specie = await this.specieRepository.findOne({where: {id}});
        if (!specie) throw new NotFoundException('Specie not found');
        return specie;
    }

    async update(id:number, dto:UpdateSpecieDto){
        const specie = await this.specieRepository.findOne({ where: { id } });
        if (!specie) throw new NotFoundException('Specie not found');
        Object.assign(specie, dto);        
        return await this.specieRepository.save(specie);        
    }

    async delete(id: number) {
    const specie = await this.specieRepository.findOne({ where: { id } });
    if (!specie) throw new NotFoundException('Specie not found');
    return await this.specieRepository.softDelete(id);
  }
}