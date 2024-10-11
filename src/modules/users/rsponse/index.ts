import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { User } from '../models/user.model';

export class GetUsersResponse {
  @ApiProperty({ type: [User] })
  @IsArray()
  @ValidateNested({ each: true })
  rows: User[];

  @ApiProperty()
  @IsInt()
  count: number;
}
