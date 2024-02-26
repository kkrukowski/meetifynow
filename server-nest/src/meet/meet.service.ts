import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from '../schemas/appointment.schema';
import { CreateMeetDto } from './dto/create-meet.dto';
import { UpdateMeetDto } from './dto/update-meet.dto';

@Injectable()
export class MeetService {
  constructor(
    @InjectModel(Appointment.name) private meetModel: Model<Appointment>,
  ) {}

  async create(@Body() createMeetDto: CreateMeetDto) {
    const createdMeet = await this.meetModel.create(createMeetDto);
  }

  async findAll() {
    const meet = await this.meetModel.find();

    if (meet.length === 0) throw new NotFoundException('No meets found.');

    return meet;
  }

  async findOne(id: string) {
    const meet = await this.meetModel.findOne({ appointmentId: id });

    if (!meet) throw new NotFoundException('Meet not found.');

    return meet;
  }

  update(id: number, updateMeetDto: UpdateMeetDto) {
    return `This action updates a #${id} meet`;
  }

  remove(id: number) {
    return `This action removes a #${id} meet`;
  }
}
