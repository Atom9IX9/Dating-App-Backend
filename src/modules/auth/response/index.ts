import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString } from 'class-validator';
import { UserResponse } from 'src/modules/users/response';

export class AuthResponse {
  @ApiProperty()
  @IsObject()
  user: UserResponse;

  @ApiProperty()
  @IsString()
  token: string;
}

export class RegisterAuthCredentialsResponse {
  @ApiProperty()
  @IsNumber()
  authId: number;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
