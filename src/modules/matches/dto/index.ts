import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserTypes } from '../types';

export class MatchDTO {
  @ApiProperty()
  @IsString()
  receiverId: string;

  @ApiProperty()
  @IsString()
  userId: string;
}

export class GetMatchesDTO {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  userType: UserTypes;
}
