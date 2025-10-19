import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthMiddleware } from "src/common/middleware/jwt-auth.middleware";
import { BreedsController } from "./breeds.controller";
import { BreedsService } from "./breeds.service";
import { Breed } from "src/database/entities/breed.entity";
import { Specie } from 'src/database/entities/specie.entity';
import { SpeciesModule } from "src/species/species.module";

@Module({
    imports: [TypeOrmModule.forFeature([Breed, Specie]), SpeciesModule],
    controllers: [BreedsController],
    providers: [BreedsService],
    exports: [BreedsService],
})
export class BreedsModule {
    configure(consumer:MiddlewareConsumer){
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('breeds');
    }
}