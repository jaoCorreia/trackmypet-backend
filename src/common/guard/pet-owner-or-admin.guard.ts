import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from 'src/database/entities/pet.entity';
import { UserRole } from 'src/database/entities/user-role.enum';
import { Repository } from 'typeorm';

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
export class PetOwnerOrAdminGuard implements CanActivate {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    const petIdParam = request.params.id;

    if (!user || !user.sub) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!petIdParam) {
      throw new ForbiddenException('Pet ID parameter is required');
    }

    const petId = Number(petIdParam);

    if (isNaN(petId)) {
      throw new ForbiddenException('Invalid pet ID');
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const pet = await this.petRepository.findOne({ where: { id: petId } });
    if (!pet) {
      throw new ForbiddenException('Pet not found');
    }

    if (user.sub === pet.user.id) {
      return true;
    }

    throw new ForbiddenException('You can only access your own resources');
  }
}
