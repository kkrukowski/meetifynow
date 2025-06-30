import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { AddAppointmentDto } from './dto/add-appointment.dto';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';
import {Appointment} from "../schemas/appointment.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log('create user');

    const emailToken = randomBytes(32).toString('hex');

    const userData = {
      ...createUserDto,
      emailToken,
      createdAt: new Date(),
    };

    const newUser = new this.userModel(userData);
    const createdUser = await newUser.save();

    if (!createdUser) {
      return {
        message: 'User not created',
        statusCode: 400,
      };
    }

    await this.mailService.sendMail({
      to: createdUser.email,
      from: 'contact@meetifynow.com',
      subject: 'Welcome to MeetifyNow!',
      text: `Verify your email by clicking on the link: https://meetifynow.com/verify-email?token=${emailToken}`,
      html: `<p>Verify your email by clicking on the link: <a href="https://meetifynow.com/verify-email?token=${emailToken}">Verify Email</a></p>`,
    });

    return {
      message: 'User created',
      statusCode: 201,
    };
  }

  async addAppointment(id: ObjectId, addAppointmentDto: AddAppointmentDto) {
    console.log('add new appointment');

    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      return {
        message: 'User not found!',
        statusCode: 404,
      };
    }

    user.appointments.push(addAppointmentDto.appointmentId);

    await user.save();

    return {
      message: 'Appointment added to user!',
      statusCode: 200,
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findById(id: string) {
    console.log('find user by id');
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      return {
        message: 'User not found!',
        statusCode: 404,
      };
    }

    return {
      message: 'User found!',
      statusCode: 200,
      user: user,
    };
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return {
        message: 'User not found!',
        statusCode: 404,
      };
    }

    return {
      message: 'User found!',
      statusCode: 200,
      user: user,
    };
  }

  async findByEmailToken(token: string) {
    return this.userModel.findOne({ emailToken: token });
  }

  async update(id: string, data: any) {
    console.log('update user');
    return this.userModel.updateOne({ _id: id }, data);
  }
}
