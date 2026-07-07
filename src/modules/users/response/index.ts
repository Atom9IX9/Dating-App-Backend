/*
 * FILE: src/modules/users/response/index.ts
 * PURPOSE: Barrel file re-exporting module members for easier imports.
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Genders } from '../types';
import { ReceivedStatuses } from '@/modules/matches/types';
import { Type } from 'class-transformer';
import { UserActivityResponse } from '@/modules/usersActivity/respoonse';
import { Hobby } from '@/modules/hobbies/models/hobby.model';
import { StorageFolder } from '@/common/storage/storage.constants';

// NestJS class implementing PublicUser.
export class PublicUser {
  @ApiProperty()
  @IsString()
  uid: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsInt()
  age: number;

  @ApiProperty({ enum: Genders })
  @IsString()
  gender: Genders;

  @ApiProperty({ enum: ReceivedStatuses, required: false })
  @IsString()
  @IsOptional()
  matchStatus?: ReceivedStatuses;

  @ApiProperty({ required: false, maxLength: 125 })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ type: UserActivityResponse })
  @Type(() => UserActivityResponse)
  activity: UserActivityResponse;
}

// NestJS class implementing UserResponse.
export class UserResponse {
  @ApiProperty()
  @IsString()
  uid: string;

  @ApiProperty()
  @IsNumber()
  authId: number;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ type: Date })
  @IsDateString()
  dateOfBD: string;

  @ApiProperty()
  @IsInt()
  age: number;

  @ApiProperty({ enum: Genders })
  @IsString()
  gender: Genders;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  genderInfo?: string;

  @ApiProperty({ required: false, maxLength: 300 })
  @IsString()
  @IsOptional()
  description?: string;
}

// NestJS class implementing GetUsersResponse.
export class GetUsersResponse {
  @ApiProperty({ isArray: true, type: PublicUser })
  @IsArray()
  rows: PublicUser[];

  @ApiProperty()
  @IsInt()
  count: number;
}

// NestJS class implementing UpdateUserResponse.
export class UpdateUserResponse {
  @ApiProperty()
  @IsString()
  id: string;

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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  gender?: Genders;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;
}

// NestJS class implementing DeleteUserResponse.
export class DeleteUserResponse {
  @ApiProperty()
  @IsString()
  uid: string;
}

// NestJS class implementing UserDescriptionResponse.
export class UserDescriptionResponse {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: [Hobby] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Hobby)
  hobbies: string[];
}

// NestJS class implementing UserAvatarResponse.
export class UserAvatarResponse {
  @ApiProperty({
    example: StorageFolder.AVATARS + '/avatar123.jpg',
    description: 'Public URL to user avatar',
  })
  @IsString()
  url: string;

  @ApiProperty()
  @IsNumber()
  posX: number;

  @ApiProperty()
  @IsNumber()
  posY: number;

  @ApiProperty()
  @IsNumber()
  scale: number;
}
