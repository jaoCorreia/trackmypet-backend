import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';
import { Notification } from 'src/database/entities/notification.entity';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly firebaseService: FirebaseService,
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
      user,
    });

    const savedNotification =
      await this.notificationRepository.save(notification);
    return savedNotification;
  }

  async sendScheduledNotification(notificationId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
      relations: ['user'],
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.sentAt) {
      this.logger.warn(
        `Notification ${notificationId} was already sent at ${notification.sentAt}`,
      );
      return notification;
    }

    const user = notification.user;

    if ((user as any).deviceToken) {
      try {
        const deviceToken = (user as any).deviceToken;
        await this.firebaseService.sendPushNotification(
          deviceToken,
          notification.title,
          notification.message,
          {
            notificationId: notification.id.toString(),
            type: 'notification',
          },
        );

        notification.sentAt = new Date();
        await this.notificationRepository.save(notification);

        this.logger.log(
          `Push notification sent to user ${user.id} for notification ${notification.id}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send push notification to user ${user.id}: ${error.message}`,
        );
        throw error;
      }
    } else {
      this.logger.warn(
        `User ${user.id} does not have a device token registered. Push notification not sent.`,
      );
    }

    return notification;
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
