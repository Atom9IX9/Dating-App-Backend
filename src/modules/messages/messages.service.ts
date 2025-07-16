import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { createMessageDTO, CreateMessageDTO } from './dto';
import { ChatsService } from '../chats/chats.service';
import { UserHasNotJoinedToRoomError } from './errors/userHasNotJoinedToRoomError';
import { GetUserMessagesFromRoomResponse } from './response';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message) private readonly messagesRepo: typeof Message,
    private readonly chatsService: ChatsService,
  ) {}

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

  public async getAllMessagesFromRoom(
    chatRoom: string,
  ): Promise<GetUserMessagesFromRoomResponse> {
    const messages = await this.messagesRepo.findAll({ where: { chatRoom } });

    return { messages };
  }
}
