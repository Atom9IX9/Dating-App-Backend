import { ApiProperty } from '@nestjs/swagger';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/models/user.model';

@Table
export class UserActivity extends Model {
  @ApiProperty()
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ApiProperty({ type: DataType.BOOLEAN })
  @Column({ type: DataType.BOOLEAN })
  isOnline: boolean;

  @ApiProperty({ type: DataType.DATE })
  @Column({ type: DataType.DATE })
  updatedAt: string;

  @ForeignKey(() => User)
  userId: string;

  @BelongsTo(() => User, 'userId')
  user: User
}
