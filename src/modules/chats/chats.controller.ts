/*
 * FILE: src/modules/chats/chats.controller.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard, ProfileGuard } from '@/guards';
import { AuthPayloadRequest } from '@/common/types/requests/requests';
import { ChatResponse, GetUserChatsResponse } from './response';

// NestJS class implementing ChatsController.
@Controller('chats')
export class ChatsController {
  // Inject required services and repositories for this class.
  constructor(private readonly chatsService: ChatsService) {}

  @ApiTags('CHATS')
  @ApiResponse({
    status: 201,
    type: ChatResponse,
    description: 'Create a private chat with another user',
  })
  // Create privat chat and save it to the data store.
  @ApiBearerAuth()
  @UseGuards(AccessAuthGuard, ProfileGuard)
  @Post(':createWithUserId')
  createPrivatChat(
    @Param('createWithUserId') createWithUserId: string,
    @Req() req: AuthPayloadRequest,
  ): Promise<ChatResponse> {
    return this.chatsService.createPrivatChat(req.user.uid, createWithUserId);
  }

  @ApiTags('CHATS')
  @ApiResponse({
    status: 200,
    type: GetUserChatsResponse,
    description: 'Get all user chats',
  })
  // Retrieve all user chats and return the requested data.
  @ApiBearerAuth()
  @UseGuards(AccessAuthGuard, ProfileGuard)
  @Get()
  getAllUserChats(
    @Req() req: AuthPayloadRequest,
  ): Promise<GetUserChatsResponse> {
    return this.chatsService.getUserChats(req.user.uid);
  }
}
