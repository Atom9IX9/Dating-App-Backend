import { Request } from 'express';
import { UserResponse } from 'src/modules/users/response';
import { Socket } from 'socket.io';

export type AuthPayloadRequest = Request & AuthPayload;
export type AuthPayloadSocket = Socket & AuthPayload;
export type JwtPayload = {
  authId: number;
};
export type AuthPayload = {
  authId: number;
  uid: string | null;
};
