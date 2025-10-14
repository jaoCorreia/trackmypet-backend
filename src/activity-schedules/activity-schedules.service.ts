import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/database/entities/activity.entity';
import { CreateScheduleDto, UpdateScheduleDto } from './dto';
import { ActivitySchedule } from 'src/database/entities/activity-schedules';
import { Pet } from 'src/database/entities/pet.entity';

@Injectable()
export class ActivityScheduleService {
  constructor(
    @InjectRepository(ActivitySchedule)
    private readonly activityScheduleRepository: Repository<ActivitySchedule>,

    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}
   
  async create(dto: CreateScheduleDto) {
    const pet = await this.petRepository.findOne({ where: { id: dto.petId } });
    if (!pet) throw new NotFoundException('Pet not found');

    const activity = await this.activityRepository.findOne({ where: { id: dto.activityId } });
    if (!activity) throw new NotFoundException('Activity not found');

    const activitySchedule = this.activityScheduleRepository.create({
    weekDay: dto.weekDay,
    time: dto.time,
    isRecurring: dto.isRecurring,
    activity,
    pet
    });
    
    return await this.activityScheduleRepository.save(activitySchedule);
  }

  async findAll(petId?: number, activityId?: number) {
    const where: any = {};
    if (petId) where.pet = { id: petId };
    if (activityId) where.activity = { id: activityId };

    return await this.activityScheduleRepository.find({
      where,
      relations: ['pet','activity'],
    });
  }

  async findOne(id: number) {
    const activitySchedule = await this.activityScheduleRepository.findOne({ where: { id } });
    if (!activitySchedule) throw new NotFoundException('Activity Schedule not found');
    return activitySchedule;
  }

  async update(id: number, dto: UpdateScheduleDto = {}) {
    const activitySchedule = await this.activityScheduleRepository.findOne({ where: { id } });
        if (!activitySchedule) throw new NotFoundException('Activity Schedule not found');
        
    const { petId = null, activityId = null, ...rest } = dto;

    if (petId) {
      const pet = await this.petRepository.findOne({ where: { id: petId } });
            if (!pet) throw new NotFoundException('Pet not found');
            activitySchedule.pet = pet;
        }

    if (activityId) {
      const activity = await this.activityRepository.findOne({ where: { id: activityId } });
            if (!activity) throw new NotFoundException('Activity not found');
            activitySchedule.activity = activity;
        }

        Object.assign(activitySchedule, rest);

        return await this.activityScheduleRepository.save(activitySchedule);
    }

  async delete(id: number) {
    const activitySchedule = await this.activityScheduleRepository.findOne({ where: { id } });
    if (!activitySchedule) throw new NotFoundException('Activity Schedule not found');
    return await this.activityScheduleRepository.softDelete(id);
  }
}