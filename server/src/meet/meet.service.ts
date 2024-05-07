import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { Appointment, DateData } from '../schemas/appointment.schema';
import { CreateMeetDto } from './dto/create-meet.dto';
import { NewAnswerDto } from './dto/new-answer.dto';
import { UserService } from '../user/user.service';
import { AddAppointmentDto } from '../user/dto/add-appointment.dto';
const { ObjectId } = require('mongodb');

const nanoid = customAlphabet(
  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  7,
);

@Injectable()
export class MeetService {
  constructor(
    @InjectModel(Appointment.name) private meetModel: Model<Appointment>,
    readonly userService: UserService,
  ) {}

  async create(@Body() createMeetDto: CreateMeetDto): Promise<Appointment> {
    const meetData = {
      ...createMeetDto,
      appointmentId: nanoid(),
      createdAt: new Date(),
    };

    console.log(meetData);

    const createdMeet = await this.meetModel.create(meetData);

    if (meetData.authorId) {
      const meetId: AddAppointmentDto = {
        appointmentId: createdMeet.id,
      };

      await this.userService.addAppointment(meetData.authorId, meetId);
    }

    return createdMeet;
  }

  async findAll(): Promise<Appointment[]> {
    const meet = await this.meetModel.find();

    if (meet.length === 0) throw new NotFoundException('No meets found.');

    return meet;
  }

  async findOne(id: string): Promise<Appointment> {
    const meet = await this.meetModel.findOne({ appointmentId: id });

    if (!meet) throw new NotFoundException('Meet not found.');

    return meet;
  }

  async addAnswer(
    meetId: string,
    @Body() newAnswerDto: NewAnswerDto,
  ): Promise<Appointment> {
    try {
      const newAnswerData = newAnswerDto;

      if (newAnswerData.dates.length === 0) {
        throw new BadRequestException('No dates provided.');
      }

      // Convert dates to DateData[]
      let dates: DateData[];
      dates = newAnswerData.dates.map((date) => {
        if (date.meetDate == null || !date.isOnline == null) {
          throw new BadRequestException('Invalid date data.');
        }

        const newDate: DateData = {
          meetDate: date.meetDate,
          isOnline: date.isOnline,
        };
        return newDate;
      });

      newAnswerDto.dates = dates;

      const filter = { appointmentId: meetId };
      const update = { $push: { answers: newAnswerData } };
      const updatedMeet = await this.meetModel.findOneAndUpdate(filter, update);

      if (!updatedMeet) throw new NotFoundException('Meet not found.');

      return updatedMeet;
    } catch (error) {
      return error;
    }
  }
}
