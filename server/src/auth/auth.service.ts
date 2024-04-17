import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from '../user/user.service';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(createUserDto: CreateUserDto) {
    if (!createUserDto) {
      throw new Error('No data provided!');
    }

    const isUserExists = await this.userService.findByEmail(
      createUserDto.email,
    );

    if (isUserExists.statusCode === 404) {
      const newUser = await this.userService.create({
        ...createUserDto,
        password: await hash(createUserDto.password, 10),
      });

      return newUser;
    }

    if (isUserExists.statusCode === 200) {
      return {
        message: 'User already exists!',
        statusCode: 400,
      };
    }

    return { error: 'Some error!' };
  }

  login(loginUserDto: LoginUserDto) {
    if (loginUserDto) {
      return { success: 'Logged in correctly!' };
    }

    return { error: 'Some error!' };
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
