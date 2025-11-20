import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: Number(this.configService.get<number>('MAIL_PORT')),
      secure: false, // Para porta 587 use false (STARTTLS)
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false, // Para desenvolvimento, aceitar certificados auto-assinados
      },
    });
  }

  generateSecurityCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendSecurityCode(email: string): Promise<{ code: string }> {
    const code = this.generateSecurityCode();
    const fromName = this.configService.get<string>('MAIL_FROM_NAME');
    const fromEmail = this.configService.get<string>('MAIL_FROM_EMAIL');

    await this.transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: email,
      subject: 'Código de Segurança - TrackMyPet',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Código de Segurança - TrackMyPet</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 100% !important; padding: 0 !important; }
              .header { padding: 30px 20px !important; }
              .content { padding: 30px 20px !important; }
              .code-box { padding: 20px 15px !important; margin: 20px 0 !important; }
              .code { font-size: 32px !important; letter-spacing: 8px !important; }
              .footer { padding: 20px 15px !important; }
            }
            @media only screen and (max-width: 480px) {
              .code { font-size: 28px !important; letter-spacing: 6px !important; }
              h1 { font-size: 24px !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #04BF9D 0%, #04BF9D 100%); font-family: 'Segoe UI', Arial, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="padding: 40px 20px;">
                <table class="container" role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                  
                  <!-- Header -->
                  <tr>
                    <td class="header" style="background: #F27457; padding: 40px 30px; text-align: center;">
                      <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">TrackMyPet</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Código de Verificação</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td class="content" style="padding: 40px 30px;">
                      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                        Use o código abaixo para concluir sua verificação:
                      </p>
                      
                      <!-- Code Box -->
                      <table class="code-box" role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #04BF9D; padding: 30px; text-align: center; border-radius: 12px; margin: 30px 0; box-shadow: 0 6px 20px rgba(4, 191, 157, 0.3);">
                        <tr>
                          <td align="center">
                            <div style="background-color: rgba(255,255,255,0.15); border-radius: 8px; padding: 20px; display: inline-block;">
                              <span class="code" style="font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #FFFFFF; font-family: 'Courier New', monospace; display: inline-block;">
                                ${code}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Alert Box -->
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FFF5F3; border-left: 4px solid #F27457; border-radius: 6px; margin: 30px 0;">
                        <tr>
                          <td style="padding: 15px 20px;">
                            <p style="color: #F27457; font-weight: 600; font-size: 14px; margin: 0;">
                              ⏱️ Este código expira em 5min.
                            </p>
                            <p style="color: #666; font-size: 13px; margin: 8px 0 0 0;">
                              Por segurança, utilize-o nos próximos minutos.
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Info -->
                      <p style="color: #888; font-size: 13px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                        Se você não solicitou este código, ignore este email.<br>
                        Sua conta permanece segura.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td class="footer" style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.6;">
                        © 2025 TrackMyPet. Cuidando do seu pet com tecnologia.<br>
                        <span style="color: #04BF9D; font-weight: 600;">${fromEmail}</span>
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `Seu código de segurança é: ${code}`,
    });

    return { code };
  }
}
