import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
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
}
