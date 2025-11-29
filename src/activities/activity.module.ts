import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthMiddleware } from 'src/common/middleware/jwt-auth.middleware';
import { User } from 'src/database/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { ActivitiesController } from './activity.controller';
import { ActivitiesService } from './activity.service';
import { ActivityScheduler } from './activity.scheduler';
import { Activity } from 'src/database/entities/activity.entity';
import { ActivitySchedule } from 'src/database/entities/activity-schedule.entity';
import { ActivityHistory } from 'src/database/entities/activity-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Activity,
      User,
      ActivitySchedule,
      ActivityHistory,
    ]),
    UsersModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivityScheduler],
  exports: [ActivitiesService],
})
export class ActivitiesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtAuthMiddleware).forRoutes('activities');
  }
}
