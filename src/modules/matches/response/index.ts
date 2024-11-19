import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Match } from '../models/match.model';
import { ReceivedStatuses } from '../types';

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

export class GetMatchesResponse {
  @ApiProperty({ isArray: true, type: Match })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Match)
  rows: Match[];

  @ApiProperty()
  @IsInt()
  count: number;
}
