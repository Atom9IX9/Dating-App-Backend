/*
 * FILE: src/modules/matches/models/match.model.ts
 * PURPOSE: Module file with defined behavior.
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  ForeignKey,
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '@/modules/users/models/user.model';
import { ReceivedStatuses } from '../types';

// NestJS class implementing Match.
@Table
export class Match extends Model {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiProperty()
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId: string;

  @ApiProperty()
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  receiverId: string;

  @ApiProperty({ enum: ReceivedStatuses })
  @AllowNull(false)
  @Column
  status: ReceivedStatuses;

  @BelongsTo(() => User)
  user: User;
}
