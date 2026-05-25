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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GetUsersResponse,
  UpdateUserResponse,
  UserAvatarResponse,
} from './response';
import { UpdateUserDTO, UserAvatarDTO } from './dto';
import { AccessAuthGuard, ProfileGuard } from '@/guards';
import { AuthPayloadRequest } from '@/common/types/requests/requests';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '@/common/pipes/fileValidation.pipe';
import { AvatarMimeType } from '@/common/storage/storage.constants';

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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        posX: { type: 'string' },
        posY: { type: 'string' },
        scale: { type: 'string' },
      },
      required: ['file', 'posX', 'posY', 'scale'],
    },
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AccessAuthGuard, ProfileGuard)
  saveAvatar(
    @UploadedFile(
      new FileValidationPipe({
        maxSize: 5 * 1024 * 1024,
        mimeTypes: Object.values(AvatarMimeType),
      }),
    )
    file: Express.Multer.File,
    @Req() req: AuthPayloadRequest,
    @Body() dto: UserAvatarDTO,
  ): Promise<UserAvatarResponse> {
    return this.usersService.saveUserAvatar(dto, req.user.uid, file);
  }
}
