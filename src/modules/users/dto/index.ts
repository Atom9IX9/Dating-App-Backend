import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { Genders } from '../types';

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
