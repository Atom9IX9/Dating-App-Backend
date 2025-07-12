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
import { createMessageDTO, CreateMessageDTO } from './dto';
import z from 'zod';
import { UserHasNotJoinedToRoomError } from './errors/userHasNotJoinedToRoomError';

@WebSocketGateway(5001, { transports: 'websocket' })
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatsService: ChatsService) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: AuthPayloadSocket) {
    await processClientChatRooms(client.user.uid, this.chatsService, (room) => {
      client.join(room);
      client
        .to(room)
        .emit('setUserOnline', { email: client.user.email, isOnline: true });
    });
  }

  async handleDisconnect(client: AuthPayloadSocket) {
    await processClientChatRooms(client.user.uid, this.chatsService, (room) => {
      client.to(room).emit('setUserOnline', {
        email: client.user.email,
        isOnline: false,
      });
      client.leave(room);
    });
  }

  @SubscribeMessage('createMessage')
  async createMessageHandler(
    @MessageBody() body: unknown,
    @ConnectedSocket() client: AuthPayloadSocket,
  ) {
    try {
      const parsedMessage = createMessageDTO.parse(body);

      const isUserInRoom = await this.chatsService.isUserInRoom(
        client.user.uid,
        parsedMessage.room,
      );

      if (isUserInRoom) {
        client.broadcast
          .to(parsedMessage.room)
          .emit('newMessage', parsedMessage);
      } else {
        throw new UserHasNotJoinedToRoomError();
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        client.emit('messageError', { name: "InvalidDataError", error: e.issues });
      } else if (e instanceof UserHasNotJoinedToRoomError) {
        client.emit('messageError', e);
      }
    }
  }
}
