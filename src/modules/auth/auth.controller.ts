import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dto';
import { LoginDTO } from './dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse } from './response';
import { JwtAuthGuard } from 'src/guards';
import { DeleteUserResponse, UserResponse } from '../users/response';
import { UsersService } from '../users/users.service';
import { AuthPayloadRequest } from 'src/common/types/requests/requests';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiTags('AUTHORIZATION')
  @ApiResponse({
    status: 201,
    type: AuthResponse,
    description: 'User registration and token generation',
  })
  @ApiBody({ type: CreateUserDTO })
  register(@Body() dto: CreateUserDTO) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiTags('AUTHORIZATION')
  @ApiResponse({
    status: 200,
    type: AuthResponse,
    description: 'User login and token generation',
  })
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiTags('AUTHORIZATION')
  @ApiResponse({
    status: 200,
    type: UserResponse,
    description: 'Check user authentication status',
  })
  @ApiBearerAuth()
  checkAuth(@Req() req: AuthPayloadRequest) {
    return this.authService.checkAuth(req.user);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiTags('AUTHORIZATION')
  @ApiResponse({
    status: 204,
    type: DeleteUserResponse,
    description: 'Delete user account',
  })
  @ApiBearerAuth()
  deleteUser(@Req() req: AuthPayloadRequest) {
    return this.usersService.deleteUser(req.user.uid);
  }
}
