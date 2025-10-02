import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtAuthMiddleware } from './jwt-auth.middleware';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtAuthMiddleware).forRoutes('*');
  }
}
