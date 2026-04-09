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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthResponse,
  CheckAuthResponse,
  RefreshTokensResponse,
  RegisterAuthCredentialsResponse,
} from './response';
import { AccessAuthGuard, ProfileGuard, RefreshAuthGuard } from 'src/guards';
import { DeleteUserResponse, UserResponse } from '../users/response';
import { UsersService } from '../users/users.service';
import {
  AuthPayloadRequest,
  RefreshAuthPayloadRequest,
} from 'src/common/types/requests/requests';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('refresh')
  @ApiCookieAuth()
  @UseGuards(RefreshAuthGuard)
  @ApiTags('AUTHORIZATION')
  @ApiResponse({
    status: 200,
    type: RefreshTokensResponse,
    description:
      'Refresh access and refresh tokens using refresh token from cookies',
  })
  async refreshTokens(
    @Req() req: RefreshAuthPayloadRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshTokensResponse> {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      req.user.authId,
      req.user.jti,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { accessToken };
  }

  @Post('register/credentials')
  @ApiTags('AUTHORIZATION')
  @ApiResponse({
    status: 201,
    type: RegisterAuthCredentialsResponse,
    description:
      'User registration with email and password, and token generation',
  })
  async registerAuthCredentials(
    @Body() dto: RegisterAuthCredentialsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegisterAuthCredentialsResponse> {
    const credentials = await this.authService.registerAuthCredentials(dto);

    res.cookie('refreshToken', credentials.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return {
      accessToken: credentials.accessToken,
      auth: credentials.auth,
    };
  }

  @ApiTags('AUTHORIZATION')
    @ApiResponse({
      status: 201,
      type: UserResponse,
      description: 'Create new user with auth.',
    })
    @ApiBearerAuth()
    @UseGuards(AccessAuthGuard)
    @Post('register/user-personal')
    createUserWithAuth(
      @Body() createUserDTO: CreateUserDTO,
      @Req() req: AuthPayloadRequest,
    ) {
      return this.usersService.createUser(createUserDTO, req.user.authId);
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
  @UseGuards(AccessAuthGuard, ProfileGuard)
  @ApiTags('AUTHORIZATION')
  @ApiResponse({
    status: 200,
    type: CheckAuthResponse,
    description: 'Check user authentication status',
  })
  @ApiBearerAuth()
  checkAuth(@Req() req: AuthPayloadRequest) {
    return this.authService.checkAuth(req.user.authId);
  }

  // //@Delete()
  // todo: logout
  // @UseGuards(AccessAuthGuard, ProfileGuard)
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
