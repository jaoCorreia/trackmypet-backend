import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshToken } from '../database/entities/refresh_token.entity';
import { PasswordReset } from '../database/entities/password-reset.entity';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { JwtAuthMiddleware } from '../common/middleware/jwt-auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken, PasswordReset]),
    UsersModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes({ path: 'auth/me', method: RequestMethod.GET });
  }
}
