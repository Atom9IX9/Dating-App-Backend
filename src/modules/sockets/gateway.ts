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

@WebSocketGateway({ transports: 'websocket' })
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
    private readonly usersActivityService: UserActivityService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: AuthPayloadSocket) {
    await processClientChatRooms(client.uid, this.chatsService, (room) => {
      client.join(room);
<<<<<<< HEAD
      client
        .to(room)
        .emit('setUserOnline', { isOnline: true });
    });

    await this.usersActivityService.setUserOnlineStatus(client.uid, true)
=======
      client.to(room).emit('setUserOnline', { isOnline: true });
    });

    await this.usersActivityService.setUserOnlineStatus(client.user.uid, true);
>>>>>>> 0e04e2a2ca4c380b47525dc4f9f8b87d6de8545a
  }

  async handleDisconnect(client: AuthPayloadSocket) {
    await processClientChatRooms(client.uid, this.chatsService, (room) => {
      client.to(room).emit('setUserOnline', {
        isOnline: false,
      });
      client.leave(room);
    });

<<<<<<< HEAD
    await this.usersActivityService.setUserOnlineStatus(client.uid, false)
=======
    await this.usersActivityService.setUserOnlineStatus(client.user.uid, false);
>>>>>>> 0e04e2a2ca4c380b47525dc4f9f8b87d6de8545a
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
        authorId: client.uid,
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
