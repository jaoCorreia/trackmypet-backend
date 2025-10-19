import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthMiddleware } from 'src/common/middleware/jwt-auth.middleware';
import { FileCategory } from 'src/database/entities/file-category.entity';
import { User } from 'src/database/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { FileCategoriesController } from './file-categories.controller';
import { FileCategoriesService } from './file-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileCategory, User]), UsersModule],
  controllers: [FileCategoriesController],
  providers: [FileCategoriesService],
  exports: [FileCategoriesService],
})
export class FileCategoriesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtAuthMiddleware).forRoutes('file_categories');
  }
}
