/*
 * FILE: src/modules/auth/response/index.ts
 * PURPOSE: Barrel file re-exporting module members for easier imports.
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserResponse } from '@/modules/users/response';
import { Type } from 'class-transformer';

export enum OnboardingStep {
  REGISTERED = 'registered',
  DESCRIPTION = 3,
  AVATAR = 4,
  USER_INFO = 2,
}

// NestJS class implementing AuthCredentials.
export class AuthCredentials {
  @ApiProperty()
  @IsNumber()
  authId: number;

  @ApiProperty()
  @IsString()
  email: string;
}

// NestJS class implementing AuthResponse.
export class AuthResponse {
  @ApiProperty()
  @IsObject()
  user: UserResponse;

  @ApiProperty()
  @IsString()
  token: string;
}

// NestJS class implementing CheckAuthUserAvatar.
export class CheckAuthUserAvatar {
  @ApiProperty()
  @IsInt()
  posX: number;

  @ApiProperty()
  @IsInt()
  posY: number;

  @ApiProperty()
  @IsInt()
  scale: number;

  @ApiProperty()
  @IsString()
  url: string;
}

// NestJS class implementing CheckAuthUser.
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

  @ApiProperty({ type: CheckAuthUserAvatar })
  @ValidateNested()
  @Type(() => CheckAuthUserAvatar)
  avatar: CheckAuthUserAvatar;
}

// NestJS class implementing CheckAuthCredentials.
export class CheckAuthCredentials {
  @ApiProperty()
  @IsInt()
  authId: number;

  @ApiProperty()
  @IsString()
  email: string;
}

// NestJS class implementing CheckAuthResponse.
export class CheckAuthResponse {
  @ApiProperty({ type: CheckAuthUser, nullable: true })
  @ValidateNested()
  @IsOptional()
  @Type(() => CheckAuthUser)
  user?: CheckAuthUser;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckAuthUser)
  authCredentials: CheckAuthCredentials;

  @ApiProperty({ enum: OnboardingStep })
  @IsEnum(OnboardingStep)
  onboardingStep: OnboardingStep;
}

export class FetchOnboardingResponse {
  @ApiProperty({ enum: OnboardingStep })
  @IsEnum(OnboardingStep)
  onboardingStep: OnboardingStep;
}

// NestJS class implementing LoginResponse.
export class LoginResponse extends CheckAuthResponse {
  @ApiProperty()
  @IsString()
  accessToken: string;
}

// NestJS class implementing RefreshedTokens.
export class RefreshedTokens {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsString()
  refreshToken: string;
}

// NestJS class implementing RefreshTokensResponse.
export class RefreshTokensResponse {
  @ApiProperty()
  @IsString()
  accessToken: string;
}

// NestJS class implementing RegisterAuthCredentialsResponse.
export class RegisterAuthCredentialsResponse {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsObject()
  auth: AuthCredentials;
}
