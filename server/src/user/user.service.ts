import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { AddAppointmentDto } from './dto/add-appointment.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto) {
    const userData = {
      ...createUserDto,
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
}
