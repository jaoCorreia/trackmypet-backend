import { UserRole } from 'src/database/entities/user-role.enum';

export type CreateUserDto = {
  email: string;
  password: string;
  photo?: string;
  name: string;
  role: UserRole;
  cpf: string;
  birthDate: Date;
  phoneNumber: string;
};
