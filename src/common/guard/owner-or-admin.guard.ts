import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/database/entities/user-role.enum';

interface AuthenticatedRequest {
  user?: {
    sub: number;
    email: string;
    role: UserRole;
  };
  params: {
    id?: string;
  };
}

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    const userIdParam = request.params.id;

    if (!user || !user.sub) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!userIdParam) {
      throw new ForbiddenException('User ID parameter is required');
    }

    const userId = Number(userIdParam);

    if (isNaN(userId)) {
      throw new ForbiddenException('Invalid user ID');
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    if (user.sub === userId) {
      return true;
    }

    throw new ForbiddenException('You can only access your own resources');
  }
}
