/*
 * FILE: src/modules/usersActivity/respoonse/index.ts
 * PURPOSE: Barrel file re-exporting module members for easier imports.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString } from 'class-validator';

// NestJS class implementing UserActivityResponse.
export class UserActivityResponse {
  @ApiProperty()
  @IsBoolean()
  isOnline: boolean;

  @IsDateString()
  lastSeen: string;
}
