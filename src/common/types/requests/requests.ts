import { Request } from 'express';
import { Socket } from 'socket.io';

export type AuthPayloadRequest = Request & AuthPayload;
export interface AuthSocket extends Socket {
  data: {
    user: {
      authId: number;
      uid: string | null;
    };
  };
}
export type JwtPayload = {
  authId: number;
  jti?: string;
};
export type AuthPayload = {
  user: {
    authId: number;
    uid: string | null;
  };
};
export type RefreshAuthPayload = {
  user: {
    authId: number;
    jti: string;
  };
};
export type RefreshAuthPayloadRequest = Request & RefreshAuthPayload;
