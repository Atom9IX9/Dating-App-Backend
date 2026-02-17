import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dto';
import { LoginDTO, RegisterAuthCredentialsDTO } from './dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse, RefreshTokensResponse, RegisterAuthCredentialsResponse } from './response';
import { AccessAuthGuard, RefreshAuthGuard } from 'src/guards';
import { DeleteUserResponse, UserResponse } from '../users/response';
import { UsersService } from '../users/users.service';
import { AuthPayloadRequest } from 'src/common/types/requests/requests';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  @ApiTags('AUTHORIZATION')
  @ApiResponse({
    status: 200,
    type: RefreshTokensResponse,
    description:
      'Refresh access and refresh tokens using refresh token from cookies',
  })
  async refreshTokens(@Req() req: AuthPayloadRequest, @Res({ passthrough: true }) res: Response): Promise<RefreshTokensResponse> {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(req.authId);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { accessToken };
  }

  @Post('register-credentials')
  @ApiTags('AUTHORIZATION')
  @ApiResponse({
    status: 201,
    type: RegisterAuthCredentialsResponse,
    description:
      'User registration with email and password, and token generation',
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

  // @Get()
  // @UseGuards(AccessAuthGuard)
  // @ApiTags('AUTHORIZATION')
  // @ApiResponse({
  //   status: 200,
  //   type: UserResponse,
  //   description: 'Check user authentication status',
  // })
  // @ApiBearerAuth()
  // checkAuth(@Req() req: AuthPayloadRequest) {
  //   return this.authService.checkAuth(req.user);
  // }

  // @Delete()
  // @UseGuards(AccessAuthGuard)
  // @ApiTags('AUTHORIZATION')
  // @ApiResponse({
  //   status: 204,
  //   type: DeleteUserResponse,
  //   description: 'Delete user account',
  // })
  // @ApiBearerAuth()
  // deleteUser(@Req() req: AuthPayloadRequest) {
  //   return this.usersService.deleteUser(req.user.uid);
  // }
}
