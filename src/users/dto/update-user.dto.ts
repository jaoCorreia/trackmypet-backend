export type UpdateUserDto = {
  email: string;
  password_hash: string;
  photo?: string;
  name: string;
  birth_date: Date;
  phone_number: string;
};
