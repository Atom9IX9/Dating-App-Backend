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
import { CreateMessageDTO } from './dto';

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
  createMessageHandler(
    @MessageBody() message: CreateMessageDTO,
    @ConnectedSocket() client: AuthPayloadSocket,
  ) {
    // TODO: is user in room checking
    client.broadcast.to(message.room).emit('newMessage', message);
  }
}
