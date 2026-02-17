import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard } from 'src/guards';
import { AuthPayloadRequest } from 'src/common/types/requests/requests';
import { ChatResponse, GetUserChatsResponse } from './response';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiTags('CHATS')
  @ApiResponse({
    status: 201,
    type: ChatResponse,
    description: 'Create a private chat with another user',
  })
  @ApiBearerAuth()
  @UseGuards(AccessAuthGuard)
  @Post(':createWithUserId')
  createPrivatChat(
    @Param('createWithUserId') createWithUserId: string,
    @Req() req: AuthPayloadRequest,
  ): Promise<ChatResponse> {
    return this.chatsService.createPrivatChat(req.uid, createWithUserId);
  }

  @ApiTags('CHATS')
  @ApiResponse({
    status: 200,
    type: GetUserChatsResponse,
    description: 'Get all user chats',
  })
  @ApiBearerAuth()
  @UseGuards(AccessAuthGuard)
  @Get()
  getAllUserChats(
    @Req() req: AuthPayloadRequest,
  ): Promise<GetUserChatsResponse> {
    return this.chatsService.getUserChats(req.uid);
  }
}
