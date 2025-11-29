import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivitySchedule } from 'src/database/entities/activity-schedule.entity';
import { ActivityHistory } from 'src/database/entities/activity-history.entity';

@Injectable()
export class ActivityScheduler {
  private readonly logger = new Logger(ActivityScheduler.name);
  private isProcessingMissedActivities = false;

  constructor(
    @InjectRepository(ActivitySchedule)
    private readonly activityScheduleRepository: Repository<ActivitySchedule>,
    @InjectRepository(ActivityHistory)
    private readonly activityHistoryRepository: Repository<ActivityHistory>,
  ) {}

  @Cron('0 4 * * *', {
    timeZone: 'UTC',
  })
  async handleMissedActivities() {
    if (this.isProcessingMissedActivities) {
      return;
    }

    this.isProcessingMissedActivities = true;
    this.logger.log('Starting missed activities check...');

    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStart = new Date(yesterday);
      yesterdayStart.setHours(0, 0, 0, 0);
      const yesterdayEnd = new Date(yesterday);
      yesterdayEnd.setHours(23, 59, 59, 999);

      const yesterdayWeekDay = yesterday.getDay();

      const schedulesForYesterday = await this.activityScheduleRepository
        .createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.activity', 'activity')
        .leftJoinAndSelect('schedule.pet', 'pet')
        .where(
          '(JSON_CONTAINS(schedule.week_days, :weekDayJson, "$") = 1 OR schedule.isRecurring = :isRecurring)',
          {
            weekDayJson: JSON.stringify(yesterdayWeekDay),
            isRecurring: true,
          },
        )
        .andWhere('schedule.deleted_at IS NULL')
        .getMany();

      if (schedulesForYesterday.length === 0) {
        this.logger.debug('No schedules found for yesterday');
        return;
      }

      this.logger.log(
        `Found ${schedulesForYesterday.length} schedule(s) for yesterday`,
      );

      let missedCount = 0;

      for (const schedule of schedulesForYesterday) {
        try {
          const existingHistory = await this.activityHistoryRepository
            .createQueryBuilder('history')
            .where('history.activity_schedule_id = :scheduleId', {
              scheduleId: schedule.id,
            })
            .andWhere('history.created_at BETWEEN :start AND :end', {
              start: yesterdayStart,
              end: yesterdayEnd,
            })
            .getOne();

          if (existingHistory) {
            this.logger.debug(
              `Schedule ${schedule.id} already has history for yesterday`,
            );
            continue;
          }

          const missedHistory = this.activityHistoryRepository.create({
            status: false,
            activitySchedule: schedule,
            createdAt: yesterdayEnd,
          });

          await this.activityHistoryRepository.save(missedHistory);
          missedCount++;

          this.logger.log(
            `Created missed activity history for schedule ${schedule.id} (${schedule.activity?.name || 'Unknown'})`,
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          this.logger.error(
            `Failed to create missed history for schedule ${schedule.id}: ${errorMessage}`,
          );
        }
      }

      this.logger.log(
        `Missed activities check completed. Created ${missedCount} missed history record(s).`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to process missed activities: ${errorMessage}`);
    } finally {
      this.isProcessingMissedActivities = false;
    }
  }
}
