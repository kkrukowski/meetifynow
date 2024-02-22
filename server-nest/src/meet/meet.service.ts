import { Injectable } from '@nestjs/common';
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

  findAll() {
    return this.meetModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} meet`;
  }

  update(id: number, updateMeetDto: UpdateMeetDto) {
    return `This action updates a #${id} meet`;
  }

  remove(id: number) {
    return `This action removes a #${id} meet`;
  }
}
