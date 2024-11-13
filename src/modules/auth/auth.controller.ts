import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dto';
import { LoginDTO } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse } from './response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('AUTHORIZATION')
  @ApiResponse({ status: 201, type: CreateUserDTO })
  @Post('register')
  register(@Body() dto: CreateUserDTO) {
    return this.authService.register(dto);
  }

  @ApiTags('AUTHORIZATION')
  @ApiResponse({ status: 200, type: AuthResponse })
  @Post('login')
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }
}
