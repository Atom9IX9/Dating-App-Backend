import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Auth } from '@/modules/auth/model/auth.model';

@Table
export class RefreshToken extends Model {
  @PrimaryKey
  @Column({ type: DataTypes.STRING, allowNull: false })
  jti: string;

  @ForeignKey(() => Auth)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  authId: number;

  @BelongsTo(() => Auth)
  auth: Auth;
}
