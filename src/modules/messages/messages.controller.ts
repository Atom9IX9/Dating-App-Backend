import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserMessagesFromRoomResponse } from './response';
import { JwtAuthGuard } from 'src/guards';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiTags('MESSAGES')
  @ApiResponse({
    status: 201,
    type: GetUserMessagesFromRoomResponse,
    description: 'Get all messages from a specific chat room',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':room')
  getMessagesFromRoom(
    @Param('room') room: string,
  ): Promise<GetUserMessagesFromRoomResponse> {
    return this.messagesService.getAllMessagesFromRoom(room);
  }
}
