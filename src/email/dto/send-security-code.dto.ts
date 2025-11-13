import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendSecurityCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
