import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, IsNull } from 'typeorm';
import { Notification } from 'src/database/entities/notification.entity';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsScheduler {
  private readonly logger = new Logger(NotificationsScheduler.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledNotifications() {
    this.logger.debug('Checking for scheduled notifications to send...');

    const now = new Date();

    const pendingNotifications = await this.notificationRepository.find({
      where: {
        scheduledAt: LessThanOrEqual(now),
        sentAt: IsNull(),
      },
      relations: ['user'],
    });

    if (pendingNotifications.length === 0) {
      this.logger.debug('No pending notifications to send');
      return;
    }

    this.logger.log(
      `Found ${pendingNotifications.length} notification(s) to send`,
    );

    for (const notification of pendingNotifications) {
      try {
        await this.notificationsService.sendScheduledNotification(
          notification.id,
        );
        this.logger.log(
          `Successfully sent notification ${notification.id} to user ${notification.user.id}`,
        );
      } catch (error: any) {
        this.logger.error(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `Failed to send notification ${notification.id}: ${error.message}`,
        );
      }
    }
  }
}
