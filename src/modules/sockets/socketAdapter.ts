/*
 * FILE: src/modules/sockets/socketAdapter.ts
 * PURPOSE: Custom adapter for WebSocket setup and authentication integration.
 */

import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import {
  AuthPayload,
  AuthSocket,
} from '@/common/types/requests/requests';

// todo: fix sockets

export class WebSocketAuthAdapter extends IoAdapter {
  // Inject required services and repositories for this class.
  constructor(private app: INestApplication) {
    super(app);
  }

  // Create ioserver and save it to the data store.
  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, {
      ...options,
      cors: true,
    });

    const jwtService = this.app.get(JwtService);
    const config = this.app.get(ConfigService);
    const secret = config.get('accessTokenSecret'); 

    server.use(tockenMiddleware(jwtService, secret));

    return server;
  }
}

const tockenMiddleware =
  (jwtService: JwtService, secret: string) =>
  (client: AuthSocket, next) => {
    const token = client.handshake.headers.authorization?.split(' ')[1];

    try {
      const payload: AuthPayload = jwtService.verify(token, {
        secret,
      });
      client.data.user.uid = payload.user.uid;
      next();
    } catch (e) {
      next(new UnauthorizedException(e));
    }
  };
