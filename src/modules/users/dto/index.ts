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

  @ApiProperty({ type: "file", format: 'binary', description: "Profile photo" })
  file: any
}
