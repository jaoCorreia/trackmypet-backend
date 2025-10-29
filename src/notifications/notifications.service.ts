import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { CreateNotificationDto, UpdateNotificationDto,  } from './dto';
import { Notification } from 'src/database/entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateNotificationDto) {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const notification = this.notificationRepository.create({
        title: dto.title,
        message: dto.message,
        scheduledAt: dto.scheduledAt,
        sentAt: dto.sentAt,
        readAt: dto.readAt,
        user
    });

    return await this.notificationRepository.save(notification);
  }

  async findAll(userId?: number) {
    const where: any = {};
    if (userId) where.user = { id: userId };

    return await this.notificationRepository.find({
      where,
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async update(id: number, dto: UpdateNotificationDto = {}) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) throw new NotFoundException('Notification not found');

    const { userId = null, ...rest } = dto;

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      notification.user = user;
    }

    Object.assign(notification, rest);

    return await this.notificationRepository.save(notification);
  }

  async delete(id: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    return await this.notificationRepository.softDelete(id);
  }
}
