import { Injectable } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  sendMail(sendMailDto: SendMailDto) {
    return this.mailService.sendMail({
      to: sendMailDto.to,
      from: sendMailDto.from,
      subject: sendMailDto.subject,
      text: sendMailDto.text,
    });
  }
}
