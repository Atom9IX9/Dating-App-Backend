/*
 * FILE: src/modules/hobbies/models/hobby.model.ts
 * PURPOSE: Module file with defined behavior.
 */

import { User } from '@/modules/users/models/user.model';
import { UserHobby } from '@/modules/users/models/userHobby.model';
import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  PrimaryKey,
  Table,
  Model,
  DataType,
  HasMany,
} from 'sequelize-typescript';

// NestJS class implementing Hobby.
@Table
export class Hobby extends Model {
  @ApiProperty()
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @ApiProperty()
  @Column({ unique: true, type: DataType.STRING(20), allowNull: false })
  name: string;

  @BelongsToMany(() => User, () => UserHobby)
  users: User[];
}
