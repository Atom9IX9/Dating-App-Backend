import { Injectable } from '@nestjs/common';
import { users } from 'src/mocks';

@Injectable()
export class UsersService {
  getUsers() {
    return users;
  }
}
