import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthMiddleware } from "src/common/middleware/jwt-auth.middleware";
import { ActivitySchedule } from "src/database/entities/activity-schedule.entity";
import { ActivityHistory } from "src/database/entities/activity-history.entity";
import { ActivityHistoryService } from "./activity-history.service";
import { ActivityHistoryController } from "./activity-history.controller";
import { ActivitySchedulesModule } from "src/activity-schedules/activity-schedules.module";

@Module({
    imports: [TypeOrmModule.forFeature([ActivityHistory, ActivitySchedule]), ActivitySchedulesModule],
    controllers: [ActivityHistoryController],
    providers: [ActivityHistoryService],
    exports: [ActivityHistoryService],
})
export class ActivityHistoryModule {
    configure(consumer:MiddlewareConsumer){
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('activity_history');
    }
}