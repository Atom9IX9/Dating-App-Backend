import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsInt, IsOptional, IsString } from 'class-validator';
import { Genders } from '../types';
import { ReceivedStatuses } from 'src/modules/matches/types';

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
}

export class CreateUserResponse {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  dateOfBD: Date;

  @ApiProperty({ enum: Genders })
  @IsString()
  gender: Genders;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false, maxLength: 125 })
  @IsString()
  @IsOptional()
  description?: string;
}

export class GetUsersResponse {
  @ApiProperty({ isArray: true, type: PublicUser })
  @IsArray()
  rows: PublicUser[];

  @ApiProperty()
  @IsInt()
  count: number;
}

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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  dateOfBD?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  gender?: Genders;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;
}

export class DeleteUserResponse {
  @ApiProperty()
  @IsString()
  id: string;
}
