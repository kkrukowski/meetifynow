import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from '../user/user.service';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

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

    const res = await this.validateUser(loginUserDto);
    const user = res.user;

    if (res.statusCode === 200) {
      const payload = { email: user.email, sub: user._id };

      const userReturnData = {
        _id: user._id,
        email: user.email,
        name: user.name,
      };

      return {
        message: 'User logged in!',
        statusCode: 200,
        user: userReturnData,
        tokens: {
          access_token: this.jwtService.sign(payload, {
            expiresIn: '20s',
            secret: process.env.JWT_SECRET,
          }),
          refresh_token: this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: process.env.JWT_REFRESH_TOKEN,
          }),
        },
      };
    }

    return { message: 'Some error!', statusCode: 400 };
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const res = await this.userService.findByEmail(loginUserDto.email);

    if (res.statusCode === 404) {
      return {
        message: 'User not found!',
        statusCode: 404,
      };
    }

    const user = res.user;

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (isPasswordCorrect) {
      return {
        message: 'Password is correct!',
        statusCode: 200,
        user: user,
      };
    }

    throw new UnauthorizedException('Invalid credentials!');
  }

  async refreshToken(user: any) {
    const payload = { email: user.email, sub: user.sub };

    return {
      tokens: {
        access_token: this.jwtService.sign(payload, {
          expiresIn: '20s',
          secret: process.env.JWT_SECRET,
        }),
        refresh_token: this.jwtService.sign(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_TOKEN,
        }),
      },
    };
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
