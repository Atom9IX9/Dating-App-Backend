import { ApiProperty } from '@nestjs/swagger';
import { IsArray, isArray, IsInt, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { UserResponse } from '@/modules/users/response';
import { Hobby } from '@/modules/hobbies/models/hobby.model';
import { Type } from 'class-transformer';

export class AuthCredentials {
  @ApiProperty()
  @IsNumber()
  authId: number;

  @ApiProperty()
  @IsString()
  email: string;
}

export class AuthResponse {
  @ApiProperty()
  @IsObject()
  user: UserResponse;

  @ApiProperty()
  @IsString()
  token: string;
}

export class CheckAuthUser {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  uid: string;
}

export class CheckAuthCredentials {
  @ApiProperty()
  @IsInt()
  authId: number;

  @ApiProperty()
  @IsString()
  email: string;
}

export class CheckAuthResponse {
  @ApiProperty()
  @IsObject()
  user: CheckAuthUser;

  @ApiProperty()
  @IsObject()
  authCredentials: CheckAuthCredentials;

  @ApiProperty()
  @IsInt()
  onboardingStep: number;
}

export class RefreshedTokens {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class RefreshTokensResponse {
  @ApiProperty()
  @IsString()
  accessToken: string;
}

export class RegisterAuthCredentialsResponse {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsObject()
  auth: AuthCredentials;
}