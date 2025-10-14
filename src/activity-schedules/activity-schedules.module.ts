import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthMiddleware } from "src/common/middleware/jwt-auth.middleware";
import { UsersModule } from "src/users/users.module";
import { Activity } from "src/database/entities/activity.entity";
import { ActivitySchedule } from "src/database/entities/activity-schedules";
import { Pet } from "src/database/entities/pet.entity";
import { ActivityScheduleController } from "./activity-schedules.controller";
import { ActivityScheduleService } from "./activity-schedules.service";
import { ActivitiesModule } from "src/activities/activity.module";

@Module({
    imports: [TypeOrmModule.forFeature([ActivitySchedule, Pet, Activity]), UsersModule, ActivitiesModule],
    controllers: [ActivityScheduleController],
    providers: [ActivityScheduleService],
    exports: [ActivityScheduleService],
})
export class ActivitySchedulesModule {
    configure(consumer:MiddlewareConsumer){
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('activity-schedules');
    }
}