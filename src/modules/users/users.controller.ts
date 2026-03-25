import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUsersResponse, UpdateUserResponse, UserResponse } from './response';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { AccessAuthGuard } from 'src/guards';
import { AuthPayloadRequest } from 'src/common/types/requests/requests';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiTags('USERS')
  @ApiResponse({
    status: 201,
    type: UserResponse,
    description: 'Create new user with auth.',
  })
  @ApiBearerAuth()
  @UseGuards(AccessAuthGuard)
  @Post('create')
  createUserWithAuth(
    @Body() createUserDTO: CreateUserDTO,
    @Req() req: AuthPayloadRequest,
  ) {
    return this.usersService.createUser(createUserDTO, req.user.authId);
  }

  @ApiTags('USERS')
  @ApiResponse({
    status: 200,
    type: GetUsersResponse,
    description:
      'Sends all users who are not "matched" with the authenticated user.',
  })
  @ApiBearerAuth()
  @UseGuards(AccessAuthGuard)
  @Get()
  getUsers(@Req() request: AuthPayloadRequest) {
    return this.usersService.getPublicUsers(request.user.uid);
  }

  @ApiTags('USERS')
  @ApiResponse({
    status: 200,
    type: UpdateUserResponse,
    description: 'Updates the profile of the authenticated user.',
  })
  @ApiBearerAuth()
  @UseGuards(AccessAuthGuard)
  @Patch()
  updateUser(
    @Body() dto: UpdateUserDTO,
    @Req() req: AuthPayloadRequest,
  ): Promise<UpdateUserResponse> {
    return this.usersService.updateUser(req.user.uid, dto);
  }
}
