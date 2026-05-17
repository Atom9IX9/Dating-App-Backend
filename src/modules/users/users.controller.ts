import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetUsersResponse,
  UpdateUserResponse,
  UserAvatarResponse,
} from './response';
import { UpdateUserDTO } from './dto';
import { AccessAuthGuard, ProfileGuard } from '@/guards';
import { AuthPayloadRequest } from '@/common/types/requests/requests';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '@/common/pipes/fileValidation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @ApiTags('USERS')
  @ApiResponse({
    status: 201,
    type: UserAvatarResponse,
    description: 'Uploads and updates the avatar of the authenticated user.',
  })
  @ApiBearerAuth()
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AccessAuthGuard, ProfileGuard)
  saveAvatar(
    @UploadedFile(
      new FileValidationPipe({
        maxSize: 5 * 1024 * 1024,
        mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      }),
    )
    file: Express.Multer.File,
    @Req() req: AuthPayloadRequest,
  ): Promise<UserAvatarResponse> {
    return this.usersService.saveUserAvatar(req.user.uid, file);
  }
}
