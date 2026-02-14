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
import { LoginDTO, RegisterAuthCredentialsDTO } from './dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse, RegisterAuthCredentialsResponse } from './response';
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

  @Post('register-credentials') // todo: refresh tockens
  @ApiTags('AUTHORIZATION')
  @ApiResponse({
    status: 201,
    type:  RegisterAuthCredentialsResponse,
    description: 'User registration with email and password, and token generation',
  })
  registerAuthCredentials(@Body() dto: RegisterAuthCredentialsDTO) {
    return this.authService.registerAuthCredentials(dto);
  }

  // @Post('login')
  // @ApiTags('AUTHORIZATION')
  // @ApiResponse({
  //   status: 200,
  //   type: AuthResponse,
  //   description: 'User login and token generation',
  // })
  // login(@Body() dto: LoginDTO) {
  //   return this.authService.login(dto);
  // }

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
