/*
 * FILE: src/modules/messages/messages.service.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { createMessageDTO, CreateMessageDTO } from './dto';
import { ChatsService } from '../chats/chats.service';
import { UserHasNotJoinedToRoomError } from './errors/userHasNotJoinedToRoomError';
import { GetUserMessagesFromRoomResponse } from './response';

// NestJS class implementing MessagesService.
@Injectable()
export class MessagesService {
  // Inject required services and repositories for this class.
  constructor(
    @InjectModel(Message) private readonly messagesRepo: typeof Message,
    private readonly chatsService: ChatsService,
  ) {}

  // Create message and save it to the data store.
  public async createMessage(dto: CreateMessageDTO) {
    createMessageDTO.parse(dto);

    const isUserInRoom = await this.chatsService.isUserInRoom(
      dto.authorId,
      dto.chatRoom,
    );

    if (!isUserInRoom) {
      throw new UserHasNotJoinedToRoomError();
    }

    const message = await this.messagesRepo.create({
      authorId: dto.authorId,
      chatRoom: dto.chatRoom,
      text: dto.text,
    });

    return message;
  }

  // Retrieve all messages from room and return the requested data.
  public async getAllMessagesFromRoom(
    chatRoom: string,
  ): Promise<GetUserMessagesFromRoomResponse> {
    const messages = await this.messagesRepo.findAll({ where: { chatRoom } });

    return { messages };
  }
}
