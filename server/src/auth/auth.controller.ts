import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshJwtGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post('/validate')
  async validate(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.validateUser(loginUserDto);
  }

  @Post('/verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('/refresh')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
