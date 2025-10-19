import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthMiddleware } from "src/common/middleware/jwt-auth.middleware";
import { Breed } from "src/database/entities/breed.entity";
import { User } from "src/database/entities/user.entity";
import { UsersModule } from "src/users/users.module";
import { PetsService } from "./pets.service";
import { PetsController } from "./pets.controller";
import { BreedsModule } from "src/breeds/breeds.module";
import { Pet } from "src/database/entities/pet.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Pet, User, Breed]), UsersModule,BreedsModule],
    controllers: [PetsController],
    providers: [PetsService],
    exports: [PetsService],
})
export class PetsModule {
    configure(consumer:MiddlewareConsumer){
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('pets');
    }
}