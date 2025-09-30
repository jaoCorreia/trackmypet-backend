import { UserRole } from 'src/database/entities/user-role.enum';

export type CreateUserDto = {
  email: string;
  password_hash: string;
  photo?: string;
  name: string;
  role: UserRole;
  cpf: string;
  birth_date: Date;
  phone_number: string;
};
