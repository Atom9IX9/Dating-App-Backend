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
  @ApiProperty({ isArray: true, type: MatchResponse })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchResponse)
  rows: MatchResponse[];

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
