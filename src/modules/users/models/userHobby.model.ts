import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';
import { Hobby } from '@/modules/hobbies/models/hobby.model';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class UserHobby extends Model {
  @ApiProperty()
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ApiProperty()
  @ForeignKey(() => Hobby)
  @Column
  hobbyId: number;
}
