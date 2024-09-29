import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { mess: string } {
    return { mess: 'Hello!' };
  }
}
