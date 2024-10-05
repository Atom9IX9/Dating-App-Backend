import { IsString } from 'class-validator';

export class AuthResponse {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;
}
