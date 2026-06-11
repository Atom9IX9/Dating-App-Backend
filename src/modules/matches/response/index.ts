/*
 * FILE: src/modules/matches/response/index.ts
 * PURPOSE: Barrel file re-exporting module members for easier imports.
 */

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

// NestJS class implementing MatchResponse.
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

// NestJS class implementing GetMatchesResponse.
export class GetMatchesResponse {
  @ApiProperty({ isArray: true, type: MatchResponse })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchResponse)
  rows: MatchResponse[];

  @ApiProperty()
  @IsInt()
  count: number;
}

// NestJS class implementing GetIsMatchedResponse.
export class GetIsMatchedResponse {
  @ApiProperty()
  @IsBoolean()
  isMatched: boolean;

  @ApiProperty({ enum: ReceivedStatuses, required: false })
  @IsString()
  @IsOptional()
  status?: ReceivedStatuses;
}
