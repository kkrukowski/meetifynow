import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
      console.error('No data provided!');
      throw new BadRequestException('No data provided!');
    }

    const { user, statusCode } = await this.validateUser(loginUserDto);

    if (statusCode !== 200) {
      return {
        message: 'Invalid credentials!',
        statusCode: 401,
      };
    }

    const payload = { email: user.email, sub: user._id };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '20s',
      secret: process.env.JWT_SECRET,
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_TOKEN,
    });

    const userReturnData = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    return {
      message: 'User logged in!',
      statusCode: 200,
      user: userReturnData,
      tokens: { access_token, refresh_token },
    };
  }

  async verifyEmail(token: string) {
    const user = await this.userService.findByEmailToken(token);

    console.log(user);

    if (!user) {
      throw new UnauthorizedException('Invalid token!');
    }

    const userId = user._id.toString();

    await this.userService.update(userId, { isVerified: true, emailToken: null });

    return {
      message: 'Email verified!',
      statusCode: 200,
    };
  }

  async validateUser(loginUserDto: LoginUserDto) {
    console.log(loginUserDto);

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
        user,
      };
    }

    return { message: 'Invalid credentials!', statusCode: 401 };
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
