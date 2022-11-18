import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendVerificationCode(email: string, code: string) {
    this.mailerService
      .sendMail({
        from: 'ubereats@gmail.com',
        to: email,
        subject:
          'Welcome to Uber eats use the link below to verify your account',
        text: code,
      })
      .then((r) => r);
  }

  sendEmail(to: string, subject: string, content: any) {
    this.mailerService
      .sendMail({
        from: 'ubereats@gmail.com',
        to,
        subject,
        html: `<body>${content}</body>`,
      })
      .then((r) => r);
  }
}
