/*
 * FILE: src/modules/sockets/gateway.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

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

// NestJS class implementing Gateway.
@WebSocketGateway({ transports: 'websocket' })
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  // Inject required services and repositories for this class.
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
    private readonly usersActivityService: UserActivityService,
  ) {}
  @WebSocketServer()
  server: Server;

  // Handle an incoming event or request and execute the business logic.
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

  // Handle an incoming event or request and execute the business logic.
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

  // Create message handler and save it to the data store.
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
