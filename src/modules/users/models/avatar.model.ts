/*
 * FILE: src/modules/users/models/avatar.model.ts
 * PURPOSE: Module file with defined behavior.
 */

import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from 'sequelize-typescript';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';

// NestJS class implementing Avatar.
@Table
export class Avatar extends Model {
  @PrimaryKey
  @Column({ type: DataTypes.INTEGER, autoIncrement: true })
  id: number;

  @ApiProperty()
  @ForeignKey(() => User)
  @Column({ type: DataTypes.STRING })
  userId: string;

  @ApiProperty()
  @Column({ type: DataTypes.STRING })
  url: string;

  @ApiProperty()
  @Column({ type: DataTypes.INTEGER })
  posX: number;

  @ApiProperty()
  @Column({ type: DataTypes.INTEGER })
  posY: number;

  @ApiProperty()
  @Column({ type: DataTypes.FLOAT })
  scale: number;

  @BelongsTo(() => User)
  user: User;
}
