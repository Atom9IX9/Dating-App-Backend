import { IsNumber, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  age: number;

  @IsString()
  gender: 'male' | 'female';

  @IsString()
  location: string;
}
