import { ForeignKey, Table, Model } from 'sequelize-typescript';
import { Chat } from './chat.model';
import { User } from 'src/modules/users/models/user.model';

@Table
export class ChatUser extends Model {
  @ForeignKey(() => Chat)
  room: string;

  @ForeignKey(() => User)
  userId: string;
}
