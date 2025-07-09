import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChatUser } from './models/chatUser.model';
import { Chat } from './models/chat.model';
import { CreatePrivatChatResponse } from './response';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ChatUser) private readonly chatUsersRepo: typeof ChatUser,
    @InjectModel(Chat) private readonly chatsRepo: typeof Chat,
  ) {}

  public async findAllUserChats(userId: string) {
    const chats = await this.chatUsersRepo.findAll({ where: { userId } });

    const chatRooms = chats.map((c) => c.room);

    return chatRooms;
  }

  public async createPrivatChat(
    user1: string,
    user2: string,
  ): Promise<CreatePrivatChatResponse> {
    const [chats1, chats2] = await Promise.all([
      this.chatUsersRepo.findAll({ where: { userId: user1 } }),
      this.chatUsersRepo.findAll({ where: { userId: user2 } }),
    ]);

    const allChatRoomsOfUsers = [...chats1, ...chats2].map((c) => c.room);
    const uniqueChatRoomsOfUser = new Set(allChatRoomsOfUsers);

    if (user1 === user2) {
      throw new BadRequestException("User can't create chat with himself");
    }

    if (allChatRoomsOfUsers.length !== uniqueChatRoomsOfUser.size) {
      throw new BadRequestException('Chat has already created.');
    }

    const chat = await Chat.create();

    await chat.$set('chatUsers', [user1, user2]);

    return chat;
  }
}
