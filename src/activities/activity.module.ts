import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthMiddleware } from "src/common/middleware/jwt-auth.middleware";
import { User } from "src/database/entities/user.entity";
import { UsersModule } from "src/users/users.module";
import { ActivitiesController } from "./activity.controller";
import { ActivitiesService } from "./activity.service";
import { Activity } from "src/database/entities/activity.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Activity, User]), UsersModule],
    controllers: [ActivitiesController],
    providers: [ActivitiesService],
    exports: [ActivitiesService],
})
export class ActivitiesModule {
    configure(consumer:MiddlewareConsumer){
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('activities');
    }
}