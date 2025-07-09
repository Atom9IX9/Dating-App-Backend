import { Request } from 'express';
import { UserResponse } from 'src/modules/users/response';
import { Socket } from 'socket.io';

export type AuthPayloadRequest = Request & { user: UserResponse };
export type AuthPayloadSocket = Socket & { user: UserResponse };
