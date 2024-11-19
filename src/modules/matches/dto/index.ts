import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserReceives, UserTypeEnum } from '../types';

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
  userType: UserTypeEnum;
}

export class ReceiveMatchDTO {
  @ApiProperty({ enum: UserReceives })
  @IsString()
  receive: UserReceives;
}
