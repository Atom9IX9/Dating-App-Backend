/*
 * FILE: src/modules/usersActivity/models/userActivity.model.ts
 * PURPOSE: Module file with defined behavior.
 */

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
import { User } from '@/modules/users/models/user.model';

// NestJS class implementing UserActivity.
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
  user: User;
}
