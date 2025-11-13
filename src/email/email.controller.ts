import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendSecurityCodeDto } from './dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-security-code')
  async sendSecurityCode(@Body() sendSecurityCodeDto: SendSecurityCodeDto) {
    const { code } = await this.emailService.sendSecurityCode(
      sendSecurityCodeDto.email,
    );

    return {
      message: 'Email enviado com sucesso',
      code: code,
      email: sendSecurityCodeDto.email,
    };
  }
}
