import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(5001, { transports: 'websocket' })
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    this.server.emit('updateOnlineStatus', { status: true, client: client.id });
  }

  handleDisconnect(client: any) {
    this.server.emit('updateOnlineStatus', {
      status: false,
      client: client.id,
    });
  }
}
