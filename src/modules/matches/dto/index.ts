/*
 * FILE: src/modules/matches/dto/index.ts
 * PURPOSE: Barrel file re-exporting module members for easier imports.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UserReceives, UserTypeEnum } from '../types';

// NestJS class implementing MatchDTO.
export class MatchDTO {
  @ApiProperty()
  @IsString()
  receiverId: string;

  @ApiProperty()
  @IsString()
  userId: string;
}

// NestJS class implementing GetMatchesDTO.
export class GetMatchesDTO {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ enum: UserTypeEnum, required: false })
  @IsString()
  @IsOptional()
  userType?: UserTypeEnum;
}

// NestJS class implementing ReceiveMatchDTO.
export class ReceiveMatchDTO {
  @ApiProperty({ enum: UserReceives })
  @IsString()
  receive: UserReceives;
}
