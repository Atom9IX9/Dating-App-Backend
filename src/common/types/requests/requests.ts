import { Request } from 'express';
import { PublicUser } from 'src/modules/users/response';

export type AuthPayloadRequest = Request & { user: PublicUser };
