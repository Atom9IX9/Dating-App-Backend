import { Request } from 'express';
import { Socket } from 'socket.io';

export type AuthPayloadRequest = Request & AuthPayload;
export type AuthPayloadSocket = Socket & AuthPayload;
export type JwtPayload = {
  authId: number;
  jti?: string;
};
export type AuthPayload = {
  user: {
    authId: number;
<<<<<<< HEAD
    uid: string | null;
=======
    uid: string;
>>>>>>> 0e04e2a2ca4c380b47525dc4f9f8b87d6de8545a
  };
};
export type RefreshAuthPayload = {
  user: {
    authId: number;
    jti: string;
  };
};
export type RefreshAuthPayloadRequest = Request & RefreshAuthPayload;
