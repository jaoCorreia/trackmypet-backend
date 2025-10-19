import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthMiddleware } from "src/common/middleware/jwt-auth.middleware";
import { UsersModule } from "src/users/users.module";
import { Activity } from "src/database/entities/activity.entity";
import { ActivitySchedule } from "src/database/entities/activity-schedule.entity";
import { Pet } from "src/database/entities/pet.entity";
import { ActivitySchedulesController } from "./activity-schedules.controller";
import { ActivitySchedulesService } from "./activity-schedules.service";
import { ActivitiesModule } from "src/activities/activity.module";

@Module({
    imports: [TypeOrmModule.forFeature([ActivitySchedule, Pet, Activity]), UsersModule, ActivitiesModule],
    controllers: [ActivitySchedulesController],
    providers: [ActivitySchedulesService],
    exports: [ActivitySchedulesService],
})
export class ActivitySchedulesModule {
    configure(consumer:MiddlewareConsumer){
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('activity_schedules');
    }
}