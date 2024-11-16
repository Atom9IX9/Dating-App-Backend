import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Table,
  Model,
  PrimaryKey,
  DataType,
} from 'sequelize-typescript';

@Table
export class User extends Model {
  @ApiProperty()
  @PrimaryKey
  @Column({ type: DataType.STRING, autoIncrement: false })
  uid: string;

  @ApiProperty()
  @Column
  firstName: string;

  @ApiProperty()
  @Column
  lastName: string;

  @ApiProperty()
  @Column
  email: string;

  @ApiProperty()
  @Column
  password: string;

  @ApiProperty()
  @Column
  dateOfBD: string;

  @ApiProperty()
  @Column
  age: number;

  @ApiProperty()
  @Column
  gender: 'male' | 'female';

  @ApiProperty()
  @Column
  location: string;
}
