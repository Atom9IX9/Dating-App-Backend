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
import { Auth } from 'src/modules/auth/model/auth.model';

@Table
export class RefreshToken extends Model {
  @ApiProperty()
  @PrimaryKey
  @Column({ type: DataTypes.INTEGER, autoIncrement: true })
  refreshTokenId: number;

  @Column({ type: DataTypes.STRING, allowNull: false })
  jti: string;

  @ForeignKey(() => Auth)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  authId: number;

  @BelongsTo(() => Auth)
  auth: Auth;
}
