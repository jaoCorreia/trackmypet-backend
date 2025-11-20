import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Notification } from 'src/database/entities/notification.entity';
import { ActivitySchedule } from 'src/database/entities/activity-schedule.entity';
import { ActivityHistory } from 'src/database/entities/activity-history.entity';
import { Pet } from 'src/database/entities/pet.entity';
import { NotificationsService } from './notifications.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class NotificationsScheduler {
  private readonly logger = new Logger(NotificationsScheduler.name);
  private isProcessingNotifications = false;
  private isSendingNotifications = false;
  private processedSchedulesToday = new Map<number, string>();

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(ActivitySchedule)
    private readonly activityScheduleRepository: Repository<ActivitySchedule>,
    @InjectRepository(ActivityHistory)
    private readonly activityHistoryRepository: Repository<ActivityHistory>,
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    private readonly notificationsService: NotificationsService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleScheduledNotifications() {
    if (this.isProcessingNotifications) {
      return;
    }

    this.isProcessingNotifications = true;
    try {
      const today = new Date().toDateString();
      this.cleanOldProcessedSchedules(today);

      const pendingSchedules = await this.getPendingSchedulesForNotification();

      if (pendingSchedules.length === 0) {
        return;
      }

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      for (const schedule of pendingSchedules) {
        try {
          if (this.processedSchedulesToday.has(schedule.id)) {
            continue;
          }

          const notificationExists = await this.notificationRepository
            .createQueryBuilder('notification')
            .where('notification.activity_schedule_id = :scheduleId', {
              scheduleId: schedule.id,
            })
            .andWhere('notification.created_at BETWEEN :start AND :end', {
              start: todayStart,
              end: todayEnd,
            })
            .getCount();

          if (notificationExists > 0) {
            this.processedSchedulesToday.set(schedule.id, today);
            continue;
          }

          const alreadyCompleted = await this.isActivityCompletedToday(
            schedule.id,
          );

          if (alreadyCompleted) {
            this.processedSchedulesToday.set(schedule.id, today);
            continue;
          }

          await this.createNotification(schedule);
          this.processedSchedulesToday.set(schedule.id, today);
          this.logger.log(`Notification created for schedule ${schedule.id}`);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Erro desconhecido';
          this.logger.error(
            `Failed to create notification for schedule ${schedule.id}: ${errorMessage}`,
          );
        }
      }
    } finally {
      this.isProcessingNotifications = false;
    }
  }

  private cleanOldProcessedSchedules(today: string): void {
    for (const [scheduleId, date] of this.processedSchedulesToday.entries()) {
      if (date !== today) {
        this.processedSchedulesToday.delete(scheduleId);
      }
    }
  }

  @Cron('*/15 * * * * *')
  async sendPendingNotifications() {
    if (this.isSendingNotifications) {
      return;
    }

    this.isSendingNotifications = true;
    try {
      const now = new Date();

      const pendingNotifications = await this.notificationRepository
        .createQueryBuilder('notification')
        .leftJoinAndSelect('notification.user', 'user')
        .leftJoinAndSelect('notification.activitySchedule', 'activitySchedule')
        .where('notification.sentAt IS NULL')
        .andWhere('notification.scheduledAt <= :now', { now })
        .getMany();

      if (pendingNotifications.length === 0) {
        return;
      }

      for (const notification of pendingNotifications) {
        try {
          const updated = await this.notificationRepository
            .createQueryBuilder()
            .update(Notification)
            .set({ sentAt: new Date() })
            .where('id = :id', { id: notification.id })
            .andWhere('sentAt IS NULL')
            .execute();

          if (updated.affected === 0) {
            continue;
          }

          try {
            const user = notification.user;
            if (!user) {
              continue;
            }

            interface UserWithToken {
              deviceToken?: string;
            }
            const deviceToken = (user as unknown as UserWithToken).deviceToken;

            if (deviceToken) {
              await this.firebaseService.sendPushNotification(
                String(deviceToken),
                notification.title,
                notification.message,
                {
                  notificationId: notification.id.toString(),
                  type: 'notification',
                },
              );
              this.logger.log(
                `Notification ${notification.id} sent to user ${user.id}`,
              );
            }
          } catch (firebaseError) {
            await this.notificationRepository
              .createQueryBuilder()
              .update(Notification)
              .set({ sentAt: () => 'NULL' })
              .where('id = :id', { id: notification.id })
              .execute();
            throw firebaseError;
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Erro desconhecido';
          this.logger.error(
            `Failed to send notification ${notification.id}: ${errorMessage}`,
          );
        }
      }
    } finally {
      this.isSendingNotifications = false;
    }
  }

  private async getPendingSchedulesForNotification(): Promise<
    ActivitySchedule[]
  > {
    const now = new Date();
    const jsWeekDay = now.getDay();

    const schedules = await this.activityScheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.pet', 'pet')
      .leftJoinAndSelect('pet.user', 'user')
      .leftJoinAndSelect('schedule.activity', 'activity')
      .where(
        '(JSON_CONTAINS(schedule.week_days, :weekDayJson, "$") = 1 AND schedule.isRecurring = :notRecurring) OR schedule.isRecurring = :isRecurring',
        {
          weekDayJson: JSON.stringify(jsWeekDay),
          notRecurring: false,
          isRecurring: true,
        },
      )
      .getMany();

    const pendingSchedules: ActivitySchedule[] = [];

    for (const schedule of schedules) {
      let scheduleHour = 0;
      let scheduleMinute = 0;

      try {
        const timeValue = schedule.time as string | Date;
        if (typeof timeValue === 'string') {
          const timeParts = String(timeValue).split(':');
          scheduleHour = parseInt(timeParts[0], 10);
          scheduleMinute = parseInt(timeParts[1], 10);
        } else {
          const scheduleTime = new Date(timeValue);
          scheduleHour = scheduleTime.getUTCHours();
          scheduleMinute = scheduleTime.getUTCMinutes();
        }
      } catch (error) {
        this.logger.error(
          `Failed to parse time for schedule ${schedule.id}: ${error}`,
        );
        continue;
      }

      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const scheduledTimeInMinutes = scheduleHour * 60 + scheduleMinute;
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const minutesDiff = currentTimeInMinutes - scheduledTimeInMinutes;

      if (minutesDiff >= 0 && minutesDiff <= 30) {
        pendingSchedules.push(schedule);
      }
    }

    return pendingSchedules;
  }

  private async isActivityCompletedToday(scheduleId: number): Promise<boolean> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const history = await this.activityHistoryRepository.findOne({
      where: {
        activitySchedule: { id: scheduleId },
        status: true,
        createdAt: Between(todayStart, todayEnd),
      },
    });

    return !!history;
  }

  private async createNotification(schedule: ActivitySchedule): Promise<void> {
    if (!schedule.pet) {
      return;
    }

    const petWithUser = await this.petRepository.findOne({
      where: { id: schedule.pet.id },
      relations: ['user'],
    });

    if (!petWithUser || !petWithUser.user) {
      return;
    }

    const user = petWithUser.user;

    let scheduleHour = 0;
    let scheduleMinute = 0;
    try {
      const timeValue = schedule.time as string | Date;
      if (typeof timeValue === 'string') {
        const timeParts = String(timeValue).split(':');
        scheduleHour = parseInt(timeParts[0], 10);
        scheduleMinute = parseInt(timeParts[1], 10);
      } else {
        const scheduleTime = new Date(timeValue);
        scheduleHour = scheduleTime.getUTCHours();
        scheduleMinute = scheduleTime.getUTCMinutes();
      }
    } catch (error) {
      this.logger.error(
        `Failed to parse time for schedule ${schedule.id}: ${error}`,
      );
      return;
    }

    const timeFormatted = `${scheduleHour.toString().padStart(2, '0')}:${scheduleMinute.toString().padStart(2, '0')}`;

    await this.notificationsService.create({
      userId: user.id,
      title: `⏰ ${schedule.activity.name}`,
      message: `Não esqueça! ${schedule.pet.name} tem "${schedule.activity.name}" agendado para ${timeFormatted}.`,
      scheduledAt: new Date(),
      activityScheduleId: schedule.id,
    });
  }
}
