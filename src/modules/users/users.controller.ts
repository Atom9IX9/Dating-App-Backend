import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUsersResponse, UpdateUserResponse } from './response';
import { UpdateUserDTO } from './dto';
import { JwtAuthGuard } from 'src/guards';
import { AuthPayloadRequest } from 'src/common/types/requests/requests';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiTags('USERS')
  @ApiResponse({ status: 200, type: GetUsersResponse })
  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers(@Req() request: AuthPayloadRequest) {
    return this.usersService.getPublicUsers(request.user);
  }

  @ApiTags('USERS')
  @ApiResponse({ status: 200, type: UpdateUserResponse })
  @UseGuards(JwtAuthGuard)
  @Patch()
  updateUser(
    @Body() dto: UpdateUserDTO,
    @Req() req: AuthPayloadRequest,
  ): Promise<UpdateUserResponse> {
    return this.usersService.updateUser(req.user.uid, dto);
  }
}
