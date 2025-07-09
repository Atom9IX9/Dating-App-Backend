import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatsService } from '../chats/chats.service';
import { AuthPayloadSocket } from 'src/common/types/requests/requests';

@WebSocketGateway(5001, { transports: 'websocket' })
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatsService: ChatsService) {}
  @WebSocketServer()
  server: Server;

  logger = new Logger();

  async handleConnection(client: AuthPayloadSocket) {
    const clientChatRooms = await this.chatsService.findAllUserChats(
      client.user.uid,
    );

    for (let i = 0; i < clientChatRooms.length; i++) {
      client.join(`r-${clientChatRooms[i]}`);
    }
  }

  handleDisconnect(client: any) {
    this.server.emit('updateOnlineStatus', {
      status: false,
      client: client.id,
    });
  }
}
