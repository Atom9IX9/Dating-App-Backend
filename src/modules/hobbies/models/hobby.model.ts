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

@Table
export class Hobby extends Model {
  @ApiProperty()
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column({ unique: true })
  name: string;

  @BelongsToMany(() => Hobby, () => UserHobby)
    hobbies: Hobby[];
}
