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
