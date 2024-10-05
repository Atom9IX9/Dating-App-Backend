import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  dateOfBD: string;

  @IsString()
  gender: 'male' | 'female';

  @IsString()
  @IsOptional()
  location?: string;
}
