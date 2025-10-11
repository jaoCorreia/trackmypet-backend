import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthMiddleware } from "src/common/middleware/jwt-auth.middleware";
import { User } from "src/database/entities/user.entity";
import { UsersModule } from "src/users/users.module";
import { Address } from "src/database/entities/address.entity";
import { ActivityController } from "./activity.controller";
import { ActivityService } from "./activity.service";
import { Activity } from "src/database/entities/activity.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Activity, User]), UsersModule],
    controllers: [ActivityController],
    providers: [ActivityService],
    exports: [ActivityService],
})
export class ActivitiesModule {
    configure(consumer:MiddlewareConsumer){
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('activities');
    }
}