import { Request } from 'express';
import { UserResponse } from 'src/modules/users/response';

export type AuthPayloadRequest = Request & { user: UserResponse };
