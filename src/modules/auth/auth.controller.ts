import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, CreateUserResponse } from '../users/dto';
import { LoginDTO } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse } from './response';
import { JwtAuthGuard } from 'src/guards';
import { DeleteUserResponse } from '../users/response';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiTags('AUTHORIZATION')
  @ApiResponse({ status: 201, type: CreateUserResponse })
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

  @ApiTags('AUTHORIZATION')
  @ApiResponse({ status: 200, type: DeleteUserResponse })
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@Req() req) {
    return this.usersService.deleteUser(req.user.id);
  }
}
