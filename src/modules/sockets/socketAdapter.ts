import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
<<<<<<< HEAD
import { AuthPayload, AuthPayloadSocket, JwtPayload } from 'src/common/types/requests/requests';
=======
import {
  AuthPayload,
  AuthPayloadSocket,
  JwtPayload,
} from 'src/common/types/requests/requests';

// todo: fix sockets
>>>>>>> 0e04e2a2ca4c380b47525dc4f9f8b87d6de8545a

export class WebSocketAuthAdapter extends IoAdapter {
  constructor(private app: INestApplication) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, {
      ...options,
      cors: true,
    });

    const jwtService = this.app.get(JwtService);
    const config = this.app.get(ConfigService);
    const secret = config.get('jwtSecret'); //todo: refactor (not valid)

    server.use(tockenMiddleware(jwtService, secret));

    return server;
  }
}

const tockenMiddleware =
  (jwtService: JwtService, secret: string) =>
  (client: AuthPayloadSocket, next) => {
    const token = client.handshake.headers.authorization?.split(' ')[1];

    try {
      const payload: AuthPayload = jwtService.verify(token, {
        secret,
      });
<<<<<<< HEAD
      client.uid = payload.uid;
=======
      client.user.uid = payload.user.uid;
>>>>>>> 0e04e2a2ca4c380b47525dc4f9f8b87d6de8545a
      next();
    } catch (e) {
      next(new UnauthorizedException(e));
    }
  };
