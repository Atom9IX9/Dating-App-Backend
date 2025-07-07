import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards';
import { AuthPayloadRequest } from 'src/common/types/requests/requests';
import { CreatePrivatChatResponse } from './response';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiTags('CHATS')
  @ApiResponse({ status: 201, type: CreatePrivatChatResponse })
  @UseGuards(JwtAuthGuard)
  @Post(':createWithUserId')
  createPrivatChat(
    @Param('createWithUserId') createWithUserId: string,
    @Req() req: AuthPayloadRequest,
  ): Promise<CreatePrivatChatResponse> {
    return this.chatsService.createPrivatChat(req.user.uid, createWithUserId);
  }
}
