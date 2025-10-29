import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/database/entities/activity.entity';
import { CreateActivityDto, UpdateActivityDto } from './dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateActivityDto) {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const activity = this.activityRepository.create({
      name: dto.name,
      icon: dto.icon,
      user,
    });

    return await this.activityRepository.save(activity);
  }

  async findAll(userId?: number) {
    const where: any = {};
    if (userId) where.user = { id: userId };

    return await this.activityRepository.find({
      where,
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const activity = await this.activityRepository.findOne({ where: { id } });
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  async update(id: number, dto: UpdateActivityDto) {
    const activity = await this.activityRepository.findOne({ where: { id } });
    if (!activity) throw new NotFoundException('Activity not found');

    const { userId = null, ...rest } = dto;

    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: dto.userId },
      });
      if (!user) throw new NotFoundException('User not found');
      activity.user = user;
    }

    Object.assign(activity, rest);

    return await this.activityRepository.save(activity);
  }

  async delete(id: number) {
    const activity = await this.activityRepository.findOne({ where: { id } });
    if (!activity) throw new NotFoundException('Activity not found');
    return await this.activityRepository.softDelete(id);
  }
}
