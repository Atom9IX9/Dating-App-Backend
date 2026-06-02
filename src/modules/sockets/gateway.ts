import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatsService } from '../chats/chats.service';
import { AuthSocket } from '@/common/types/requests/requests';
import { processClientChatRooms } from './helpers/processClientChatRooms';
import z from 'zod';
import { MessagesService } from '../messages/messages.service';
import { CreateSocketMessage } from './dto';
import { UserActivityService } from '../usersActivity/usersActivity.service';

@WebSocketGateway({ transports: 'websocket' })
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
    private readonly usersActivityService: UserActivityService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: AuthSocket) {
    await processClientChatRooms(
      client.data.user.uid,
      this.chatsService,
      (room) => {
        client.join(room);
        client.to(room).emit('setUserOnline', { isOnline: true });
      },
    );

    await this.usersActivityService.setUserOnlineStatus(
      client.data.user.uid,
      true,
    );
  }

  async handleDisconnect(client: AuthSocket) {
    await processClientChatRooms(
      client.data.user.uid,
      this.chatsService,
      (room) => {
        client.to(room).emit('setUserOnline', {
          isOnline: false,
        });
        client.leave(room);
      },
    );

    await this.usersActivityService.setUserOnlineStatus(
      client.data.user.uid,
      false,
    );
  }

  @SubscribeMessage('createMessage')
  async createMessageHandler(
    @MessageBody() body: CreateSocketMessage,
    @ConnectedSocket() client: AuthSocket,
  ) {
    try {
      const createdMessage = await this.messagesService.createMessage({
        chatRoom: body.chatRoom,
        text: body.text,
        authorId: client.data.user.uid,
      });
      client.broadcast.to(body.chatRoom).emit('newMessage', createdMessage);
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        client.emit('messageError', {
          name: 'InvalidDataError',
          error: e.issues,
        });
      } else {
        client.emit('messageError', e);
      }
    }
  }
}
