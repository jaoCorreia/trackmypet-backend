import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
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
    let pet: Pet | undefined = undefined;
    if (dto.petId) {
      const foundPet = await this.petRepository.findOne({
        where: { id: dto.petId },
      });
      if (!foundPet) throw new NotFoundException('Pet not found');
      pet = foundPet;
    }

    const activity = await this.activityRepository.findOne({
      where: { id: dto.activityId },
    });
    if (!activity) throw new NotFoundException('Activity not found');

    const activitySchedule = this.activityScheduleRepository.create({
      weekDays: dto.weekDays,
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
    weekDay?: number[],
    isRecurring?: string,
    startDate?: string,
    endDate?: string,
    userId?: number,
  ) {
    const qb = this.activityScheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.pet', 'pet')
      .leftJoinAndSelect('schedule.activity', 'activity')
      .leftJoinAndSelect('activity.user', 'activityUser');

    if (userId) {
      qb.andWhere('activityUser.id = :userId', { userId });
    }

    if (petId) {
      qb.andWhere('pet.id = :petId', { petId });
    }

    if (activityId) {
      qb.andWhere('activity.id = :activityId', { activityId });
    }

    if (weekDay && weekDay.length > 0) {
      const dayConds: string[] = [];
      const params: Record<string, string> = {};

      weekDay.forEach((d, i) => {
        const key = `day${i}`;
        dayConds.push(`JSON_CONTAINS(schedule.week_days, :${key}, '$') = 1`);
        params[key] = JSON.stringify(d);
      });

      qb.andWhere(`(${dayConds.join(' OR ')})`, params);
    }

    if (isRecurring === 'true') {
      qb.andWhere('schedule.isRecurring = :isRecurring', { isRecurring: true });
    } else if (isRecurring === 'false') {
      qb.andWhere('schedule.isRecurring = :isRecurring', {
        isRecurring: false,
      });
    }

    if (startDate && endDate) {
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T23:59:59.999');
      qb.andWhere('schedule.time BETWEEN :start AND :end', { start, end });
    } else if (startDate) {
      const start = new Date(startDate + 'T00:00:00');
      qb.andWhere('schedule.time >= :start', { start });
    } else if (endDate) {
      const end = new Date(endDate + 'T23:59:59.999');
      qb.andWhere('schedule.time <= :end', { end });
    }

    return await qb.getMany();
  }

  async findForToday(petId?: number, activityId?: number, userId?: number) {
    const today = new Date();
    const jsWeekDay = today.getDay();

    const qb = this.activityScheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.pet', 'pet')
      .leftJoinAndSelect('schedule.activity', 'activity')
      .leftJoinAndSelect('activity.user', 'activityUser')
      .where(
        '(JSON_CONTAINS(schedule.week_days, :weekDayJson, "$") = 1 AND schedule.isRecurring = :notRecurring) OR schedule.isRecurring = :isRecurring',
        {
          weekDayJson: JSON.stringify(jsWeekDay),
          notRecurring: false,
          isRecurring: true,
        },
      );

    if (userId) {
      qb.andWhere('activityUser.id = :userId', { userId });
    }

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
      relations: ['pet', 'activity'],
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
