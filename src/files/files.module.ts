import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthMiddleware } from "src/common/middleware/jwt-auth.middleware";
import { Pet } from "src/database/entities/pet.entity";
import { FileCategory } from "src/database/entities/file-category.entity";
import { PetsModule } from "src/pets/pets.module";
import { FileCategoriesModule } from "src/file-categories/file-categories.module";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";

@Module({
    imports: [TypeOrmModule.forFeature([File, Pet, FileCategory]), PetsModule,FileCategoriesModule],
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService],
})
export class FilesModule {
    configure(consumer:MiddlewareConsumer){
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('files');
    }
}