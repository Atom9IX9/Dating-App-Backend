import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import { AuthPayloadSocket } from 'src/common/types/requests/requests';

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
    const secret = config.get('jwtSecret');

    server.use(tockenMiddleware(jwtService, secret));

    return server;
  }
}

const tockenMiddleware =
  (jwtService: JwtService, secret: string) =>
  (client: AuthPayloadSocket, next) => {
    const token = client.handshake.headers.authorization?.split(' ')[1];

    try {
      const payload = jwtService.verify(token, {
        secret,
      });
      client.user = payload.user;
      next();
    } catch (e) {
      next(new UnauthorizedException(e));
    }
  };
