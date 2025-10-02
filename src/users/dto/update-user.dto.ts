import { UserRole } from 'src/database/entities/user-role.enum';

export class UpdateUserDto {
  email?: string;
  password?: string;
  photo?: string;
  name?: string;
  role?: UserRole;
  birth_date?: Date;
  phone_number?: string;
}
