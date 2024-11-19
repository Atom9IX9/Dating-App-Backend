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

export class CreateMatchResponse {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  receiverId: string;

  @ApiProperty()
  @IsString()
  status: 'pending' | 'rejected' | 'accepted';
}

export class GetMatchesResponse {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Match)
  rows: Match[];

  @ApiProperty()
  @IsInt()
  count: number;
}
