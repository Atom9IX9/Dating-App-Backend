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
import { AuthPayloadSocket } from 'src/common/types/requests/requests';
import { processClientChatRooms } from './helpers/processClientChatRooms';
import z from 'zod';
import { MessagesService } from '../messages/messages.service';
import { CreateSocketMessage } from './dto';
import { UserActivityService } from '../usersActivity/usersActivity.service';

@WebSocketGateway(5001, { transports: 'websocket' })
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
    private readonly usersActivityService: UserActivityService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: AuthPayloadSocket) {
    await processClientChatRooms(client.user.uid, this.chatsService, (room) => {
      client.join(room);
      client
        .to(room)
        .emit('setUserOnline', { email: client.user.email, isOnline: true });
    });

    await this.usersActivityService.setUserOnlineStatus(client.user.uid, true)
  }

  async handleDisconnect(client: AuthPayloadSocket) {
    await processClientChatRooms(client.user.uid, this.chatsService, (room) => {
      client.to(room).emit('setUserOnline', {
        email: client.user.email,
        isOnline: false,
      });
      client.leave(room);
    });

    await this.usersActivityService.setUserOnlineStatus(client.user.uid, false)
  }

  @SubscribeMessage('createMessage')
  async createMessageHandler(
    @MessageBody() body: CreateSocketMessage,
    @ConnectedSocket() client: AuthPayloadSocket,
  ) {
    try {
      const createdMessage = await this.messagesService.createMessage({
        chatRoom: body.chatRoom,
        text: body.text,
        authorId: client.user.uid,
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
