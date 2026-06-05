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
  USER_INFO = 2
}

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

export class CheckAuthCredentials {
  @ApiProperty()
  @IsInt()
  authId: number;

  @ApiProperty()
  @IsString()
  email: string;
}

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

export class LoginResponse extends CheckAuthResponse {
  @ApiProperty()
  @IsString()
  accessToken: string;
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
