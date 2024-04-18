import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
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
