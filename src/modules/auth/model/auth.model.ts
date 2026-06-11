/*
 * FILE: src/modules/auth/model/auth.model.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import {
  Column,
  DefaultScope,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { RefreshToken } from '@/modules/auth/model/refreshToken.model';
import { User } from '@/modules/users/models/user.model';

@Table
@DefaultScope(() => ({
  attributes: {
    exclude: ['password'],
  },
}))
// NestJS class implementing Auth.
export class Auth extends Model {
  @ApiProperty()
  @PrimaryKey
  @Column({ type: DataTypes.INTEGER, autoIncrement: true })
  authId: number;

  @ApiProperty()
  @Column({ type: DataTypes.STRING })
  email: string;

  @ApiProperty()
  @Column({ type: DataTypes.STRING })
  password: string;

  @HasOne(() => User)
  user: User;

  @HasOne(() => RefreshToken)
  refreshToken: RefreshToken;
}
