import { UserGender } from 'src/database/entities/user-gender.enum';
import { UserRole } from 'src/database/entities/user-role.enum';

export class UpdateUserDto {
  email?: string;
  password?: string;
  photo?: string;
  name?: string;
  role?: UserRole;
  cpf?: string;
  birthDate?: Date;
  phoneNumber?: string;
  gender?: UserGender;
  deviceToken?: string;
}
