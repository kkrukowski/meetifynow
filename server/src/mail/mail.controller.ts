import { Controller, Post, Body, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  async sendMail(mailData: SendMailDto) {
    return this.mailService.sendMail(mailData);
  }
}
