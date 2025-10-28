import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mailer.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendEmail(@Body() body: { to: string }) {
    console.log('Received email request:', body);
    await this.mailService.sendWelcomeEmail(body.to);
    return { message: 'Email đã được gửi thành công!' };
  }
}
