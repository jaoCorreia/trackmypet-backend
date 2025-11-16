import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { ActivityHistory } from 'src/database/entities/activity-history.entity';
import { ActivitySchedule } from 'src/database/entities/activity-schedule.entity';
import { CreateActivityHistoryDto, UpdateActivityHistoryDto } from './dto';

@Injectable()
export class ActivityHistoryService {
  constructor(
    @InjectRepository(ActivityHistory)
    private readonly activityHistoryRepository: Repository<ActivityHistory>,
    @InjectRepository(ActivitySchedule)
    private readonly activityScheduleRepository: Repository<ActivitySchedule>,
  ) {}

  async create(dto: CreateActivityHistoryDto) {
    const activitySchedule = await this.activityScheduleRepository.findOne({
      where: { id: dto.activityScheduleId },
    });
    if (!activitySchedule)
      throw new NotFoundException('Activity Schedule not found');

    const activityHistory = this.activityHistoryRepository.create({
      status: dto.status,
      activitySchedule,
    });

    return await this.activityHistoryRepository.save(activityHistory);
  }

  async findAll(
    activityScheduleId?: number,
    startDate?: string,
    endDate?: string,
  ) {
    const where: FindOptionsWhere<ActivityHistory> =
      {} as FindOptionsWhere<ActivityHistory>;
    if (activityScheduleId) where.activitySchedule = { id: activityScheduleId };
    if (startDate && endDate) {
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T23:59:59.999');
      where.createdAt = Between(start, end);
    } else if (startDate) {
      const start = new Date(startDate + 'T00:00:00');
      where.createdAt = Between(start, new Date('9999-12-31T23:59:59.999'));
    } else if (endDate) {
      const end = new Date(endDate + 'T23:59:59.999');
      where.createdAt = Between(new Date('0001-01-01T00:00:00'), end);
    }

    return await this.activityHistoryRepository.find({
      where,
      relations: ['activitySchedule'],
    });
  }

  async findOne(id: number) {
    const activityHistory = await this.activityHistoryRepository.findOne({
      where: { id },
    });
    if (!activityHistory)
      throw new NotFoundException('Activity History not found');
    return activityHistory;
  }

  async update(id: number, dto: UpdateActivityHistoryDto = {}) {
    const activityHistory = await this.activityHistoryRepository.findOne({
      where: { id },
    });
    if (!activityHistory)
      throw new NotFoundException('Activity History not found');

    const { activityScheduleId = null, ...rest } = dto;

    if (activityScheduleId) {
      const activitySchedule = await this.activityScheduleRepository.findOne({
        where: { id: activityScheduleId },
      });
      if (!activitySchedule)
        throw new NotFoundException('Activity Schedule not found');
      activityHistory.activitySchedule = activitySchedule;
    }

    Object.assign(activityHistory, rest);

    return await this.activityHistoryRepository.save(activityHistory);
  }

  async delete(id: number) {
    const activityHistory = await this.activityHistoryRepository.findOne({
      where: { id },
    });
    if (!activityHistory)
      throw new NotFoundException('Activity History not found');
    return await this.activityHistoryRepository.softDelete(id);
  }
}
