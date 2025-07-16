import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards';
import { AuthPayloadRequest } from 'src/common/types/requests/requests';
import {
  ChatResponse,
  GetUserChatsResponse,
} from './response';

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
  ) {}

  @ApiTags('CHATS')
  @ApiResponse({ status: 201, type: ChatResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':createWithUserId')
  createPrivatChat(
    @Param('createWithUserId') createWithUserId: string,
    @Req() req: AuthPayloadRequest,
  ): Promise<ChatResponse> {
    return this.chatsService.createPrivatChat(req.user.uid, createWithUserId);
  }

  @ApiTags('CHATS')
  @ApiResponse({ status: 200, type: GetUserChatsResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUserChats(
    @Req() req: AuthPayloadRequest,
  ): Promise<GetUserChatsResponse> {
    return this.chatsService.getUserChats(req.user.uid);
  }
}
