import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Genders } from '../types';

export class CreateUserDTO {
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
  password: string;

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

export class UpdateUserDTO {
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

  @ApiProperty({ required: false, enum: Genders })
  @IsString()
  @IsOptional()
  gender?: Genders;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;
}
