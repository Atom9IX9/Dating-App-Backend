import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty()
  @IsString()
  gender: 'male' | 'female';

  @ApiProperty()
  @IsString()
  @IsOptional()
  location?: string;
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

  @ApiProperty()
  @IsString()
  gender: 'male' | 'female';

  @ApiProperty()
  @IsString()
  @IsOptional()
  location?: string;
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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  gender?: 'male' | 'female';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;
}
