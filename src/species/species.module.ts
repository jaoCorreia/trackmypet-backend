import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Specie } from "src/database/entities/specie.entity";
import { SpeciesController } from "./species.controller";
import { SpeciesService } from "./species.service";
import { JwtAuthMiddleware } from "src/common/middleware/jwt-auth.middleware";

@Module({
    imports: [TypeOrmModule.forFeature([Specie])],
    controllers: [SpeciesController],
    providers: [SpeciesService],
    exports: [SpeciesService],
})
export class SpeciesModule {
    configure(consumer:MiddlewareConsumer){
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('species');
    }
}