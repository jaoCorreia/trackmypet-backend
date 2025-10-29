import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtAuthMiddleware } from 'src/common/middleware/jwt-auth.middleware';
import { UploadController } from './upload.controller';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [],
  exports: [],
})
export class UploadModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtAuthMiddleware).forRoutes('upload');
  }
}
