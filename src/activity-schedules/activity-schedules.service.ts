import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/database/entities/activity.entity';
import { CreateScheduleDto, UpdateScheduleDto } from './dto';
import { ActivitySchedule } from 'src/database/entities/activity-schedule.entity';
import { Pet } from 'src/database/entities/pet.entity';

@Injectable()
export class ActivitySchedulesService {
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

    const activity = await this.activityRepository.findOne({
      where: { id: dto.activityId },
    });
    if (!activity) throw new NotFoundException('Activity not found');

    const activitySchedule = this.activityScheduleRepository.create({
      weekDay: dto.weekDay,
      time: dto.time,
      isRecurring: dto.isRecurring,
      activity,
      pet,
    });

    return await this.activityScheduleRepository.save(activitySchedule);
  }

  async findAll(
    petId?: number,
    activityId?: number,
    weekDay?: number,
    isRecurring?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const where: FindOptionsWhere<ActivitySchedule> =
      {} as FindOptionsWhere<ActivitySchedule>;

    if (petId) where.pet = { id: petId };
    if (activityId) where.activity = { id: activityId };
    if (weekDay) where.weekDay = weekDay;
    if (isRecurring == 'true') {
      where.isRecurring = true;
    } else if (isRecurring == 'false') {
      where.isRecurring = false;
    }

    if (startDate && endDate) {
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T23:59:59.999');
      where.time = Between(start, end);
    } else if (startDate) {
      const start = new Date(startDate + 'T00:00:00');
      where.time = Between(start, new Date('9999-12-31T23:59:59.999'));
    } else if (endDate) {
      const end = new Date(endDate + 'T23:59:59.999');
      where.time = Between(new Date('0001-01-01T00:00:00'), end);
    }

    return await this.activityScheduleRepository.find({
      where,
      relations: ['pet', 'activity'],
    });
  }

  async findForToday(petId?: number, activityId?: number) {
    const today = new Date();
    const jsWeekDay = today.getDay(); // 0 (domingo) - 6 (sábado)

    const qb = this.activityScheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.pet', 'pet')
      .leftJoinAndSelect('schedule.activity', 'activity')
      .where(
        'schedule.weekDay = :weekDay OR schedule.isRecurring = :isRecurring',
        {
          weekDay: jsWeekDay,
          isRecurring: true,
        },
      );

    if (petId) {
      qb.andWhere('pet.id = :petId', { petId });
    }

    if (activityId) {
      qb.andWhere('activity.id = :activityId', { activityId });
    }

    return await qb.getMany();
  }

  async findOne(id: number) {
    const activitySchedule = await this.activityScheduleRepository.findOne({
      where: { id },
    });
    if (!activitySchedule)
      throw new NotFoundException('Activity Schedule not found');
    return activitySchedule;
  }

  async update(id: number, dto: UpdateScheduleDto = {}) {
    const activitySchedule = await this.activityScheduleRepository.findOne({
      where: { id },
    });
    if (!activitySchedule)
      throw new NotFoundException('Activity Schedule not found');

    const { petId = null, activityId = null, ...rest } = dto;

    if (petId) {
      const pet = await this.petRepository.findOne({ where: { id: petId } });
      if (!pet) throw new NotFoundException('Pet not found');
      activitySchedule.pet = pet;
    }

    if (activityId) {
      const activity = await this.activityRepository.findOne({
        where: { id: activityId },
      });
      if (!activity) throw new NotFoundException('Activity not found');
      activitySchedule.activity = activity;
    }

    Object.assign(activitySchedule, rest);

    return await this.activityScheduleRepository.save(activitySchedule);
  }

  async delete(id: number) {
    const activitySchedule = await this.activityScheduleRepository.findOne({
      where: { id },
    });
    if (!activitySchedule)
      throw new NotFoundException('Activity Schedule not found');
    return await this.activityScheduleRepository.softDelete(id);
  }
}
