import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
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

  @ApiProperty({ enum: UserTypeEnum, required: false })
  @IsString()
  @IsOptional()
  userType?: UserTypeEnum;
}

export class ReceiveMatchDTO {
  @ApiProperty({ enum: UserReceives })
  @IsString()
  receive: UserReceives;
}
