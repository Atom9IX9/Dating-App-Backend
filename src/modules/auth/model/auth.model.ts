import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Column, DefaultScope, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
@DefaultScope(() => ({
  attributes: {
    exclude: ['password'],
  },
}))
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
