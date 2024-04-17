import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from '../user/user.service';
import { hash, compare } from 'bcrypt';

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

  async login(loginUserDto: LoginUserDto) {
    if (!loginUserDto) {
      throw new Error('No data provided!');
    }

    const user = await this.validateUser(loginUserDto);

    return user;

    return { error: 'Some error!', statusCode: 400 };
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.findByEmail(loginUserDto.email);

    if (user.statusCode === 404) {
      return {
        message: 'User not found!',
        statusCode: 404,
      };
    }

    const userData = user.userData;

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      userData.password,
    );

    if (isPasswordCorrect) {
      return {
        message: 'Password is correct!',
        statusCode: 200,
      };
    }

    throw new UnauthorizedException('Invalid credentials!');
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
