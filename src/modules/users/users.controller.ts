import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUsersResponse } from './response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiTags('API')
  @ApiResponse({ status: 200, type: GetUsersResponse })
  @Get()
  getUsers() {
    return this.usersService.getPublicUsers();
  }
}
