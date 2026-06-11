/*
 * FILE: src/modules/messages/messages.controller.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserMessagesFromRoomResponse } from './response';
import { AccessAuthGuard } from '@/guards';

// NestJS class implementing MessagesController.
@Controller('messages')
export class MessagesController {
  // Inject required services and repositories for this class.
  constructor(private readonly messagesService: MessagesService) {}

  @ApiTags('MESSAGES')
  @ApiResponse({
    status: 201,
    type: GetUserMessagesFromRoomResponse,
    description: 'Get all messages from a specific chat room',
  })
  // Retrieve messages from room and return the requested data.
  @ApiBearerAuth()
  @UseGuards(AccessAuthGuard)
  @Get(':room')
  getMessagesFromRoom(
    @Param('room') room: string,
  ): Promise<GetUserMessagesFromRoomResponse> {
    return this.messagesService.getAllMessagesFromRoom(room);
  }
}
