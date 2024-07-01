import { Controller, Post, Body, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  sendMail() {
    const mailData = {
      to: 'hadekshd@gmail.com',
      from: 'MeetifyNow <contact@meetifynow.com>',
      subject: 'Welcome to MeetifyNow!',
      text: `Welcome to MeetifyNow!`,
    };

    const mail = this.mailService.sendMail(mailData);

    return mail;
  }
}
