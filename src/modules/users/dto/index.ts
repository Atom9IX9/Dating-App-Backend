/*
 * FILE: src/modules/users/dto/index.ts
 * PURPOSE: Barrel file re-exporting module members for easier imports.
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Genders } from '../types';

// NestJS class implementing CreateUserDTO.
export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ type: Date })
  @IsDateString()
  dateOfBD: string;

  @ApiProperty({ enum: Genders })
  @IsString()
  gender: Genders;

  @ApiProperty()
  @IsOptional()
  @IsString()
  genderInfo?: string;
}

// NestJS class implementing UpdateUserDTO.
export class UpdateUserDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false, type: Date })
  @IsDateString()
  @IsOptional()
  dateOfBD?: string;

  @ApiProperty({ required: false, enum: Genders })
  @IsString()
  @IsOptional()
  gender?: Genders;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;
}

// NestJS class implementing UserDescriptionDTO.
export class UserDescriptionDTO {
  @ApiProperty({ maxLength: 300 })
  @IsString()
  description: string;

  @ApiProperty({
    type: [String],
    maxItems: 7,
    items: {
      type: 'string',
      maxLength: 20,
    },
  })
  @IsArray()
  @ArrayMaxSize(7)
  @IsString({ each: true })
  @MaxLength(20, { each: true })
  hobbies: string[];
}

// NestJS class implementing UserAvatarDTO.
export class UserAvatarDTO {
  @ApiProperty()
  @IsString()
  posX: string;

  @ApiProperty()
  @IsString()
  posY: string;

  @ApiProperty()
  @IsString()
  scale: string;
}
