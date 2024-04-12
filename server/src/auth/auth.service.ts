import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  create(createUserDto: CreateUserDto) {
    if (createUserDto) {
      return { success: 'Registered correctly!' };
    }

    return { error: 'Some error!' };
  }

  login(loginUserDto: LoginUserDto) {
    if (loginUserDto) {
      return { success: 'Logged in correctly!' };
    }

    return { error: 'Some error!' };
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
