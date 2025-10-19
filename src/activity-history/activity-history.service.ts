import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { ActivityHistory } from 'src/database/entities/activity-history.entity';
import { ActivitySchedule } from 'src/database/entities/activity-schedules.entity';
import { CreateActivityHistoryDto, UpdateActivityHistoryDto } from './dto';

@Injectable()
export class ActivityHistoryService {
  constructor(
    @InjectRepository(ActivityHistory)
    private readonly activityHistoryRepository: Repository<ActivityHistory>,
    @InjectRepository(ActivitySchedule)
    private readonly activityScheduleRepository: Repository<ActivitySchedule>
  ) {}

  async create(dto: CreateActivityHistoryDto) {
    const activitySchedule = await this.activityScheduleRepository.findOne({ where: { id: dto.activityScheduleId } });
    if (!activitySchedule) throw new NotFoundException('Activity Schedule not found');

    const activityHistory = this.activityHistoryRepository.create({
    status: dto.status,
    activitySchedule
    });
    
    return await this.activityHistoryRepository.save(activityHistory);
  }

  async findAll(activityScheduleId?: number) {
    const where: any = {};
    if (activityScheduleId) where.activitySchedule = { id: activityScheduleId };

    return await this.activityHistoryRepository.find({
      where,
      relations: ['activitySchedule'],
    });
  }

  async findOne(id: number) {
    const activityHistory = await this.activityHistoryRepository.findOne({ where: { id } });
    if (!activityHistory) throw new NotFoundException('Activity History not found');
    return activityHistory;
  }

  async update(id: number, dto: UpdateActivityHistoryDto = {}) {
    const activityHistory = await this.activityHistoryRepository.findOne({ where: { id } });
        if (!activityHistory) throw new NotFoundException('Activity History not found');
        
    const { activityScheduleId = null, ...rest } = dto;

    if (activityScheduleId) {
      const activitySchedule = await this.activityScheduleRepository.findOne({ where: { id: activityScheduleId } });
      if (!activitySchedule) throw new NotFoundException('Activity Schedule not found');
      activityHistory.activitySchedule = activitySchedule;
        }

        Object.assign(activityHistory, rest);

        return await this.activityHistoryRepository.save(activityHistory);
    }

  async delete(id: number) {
    const activityHistory = await this.activityHistoryRepository.findOne({ where: { id } });
    if (!activityHistory) throw new NotFoundException('Activity History not found');
    return await this.activityHistoryRepository.softDelete(id);
  }
}
