import { Injectable, NotFoundException } from '@nestjs/common';
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

  create(createMeetDto: CreateMeetDto) {
    return 'This action adds a new meet';
  }

  async findAll() {
    const meet = await this.meetModel.find();

    if (!meet) throw new Error('Unexpected error occurred. Please try again.');

    return meet;
  }

  findOne(id: string) {
    return this.meetModel.findOne({ appointmentId: id });
  }

  update(id: number, updateMeetDto: UpdateMeetDto) {
    return `This action updates a #${id} meet`;
  }

  remove(id: number) {
    return `This action removes a #${id} meet`;
  }
}
