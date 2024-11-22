import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ReceivedStatuses } from '../types';
import { PublicUser } from 'src/modules/users/response';

export class MatchResponse {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  receiverId: string;

  @ApiProperty({ enum: ReceivedStatuses })
  @IsString()
  status: ReceivedStatuses;
}

export class GetMatchResponse {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  receiverId: string;

  @ApiProperty({ enum: ReceivedStatuses })
  @IsString()
  status: ReceivedStatuses;

  @ApiProperty()
  @Type(() => PublicUser)
  secondUser: PublicUser;
}

export class GetMatchesResponse {
  @ApiProperty({ isArray: true, type: GetMatchResponse })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetMatchResponse)
  rows: GetMatchResponse[];

  @ApiProperty()
  @IsInt()
  count: number;
}

export class GetIsMatchedResponse {
  @ApiProperty()
  @IsBoolean()
  isMatched: boolean;

  @ApiProperty({ enum: ReceivedStatuses, required: false })
  @IsString()
  @IsOptional()
  status?: ReceivedStatuses;
}
