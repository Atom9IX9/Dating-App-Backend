import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class GetUsersResponse {
  @ApiProperty()
  @IsArray()
  rows: PublicUser[];

  @ApiProperty()
  @IsInt()
  count: number;
}

export class PublicUser {
  @ApiProperty()
  @IsString()
  uid: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsInt()
  age: number;

  @ApiProperty()
  @IsString()
  gender: string;
}

export class UpdateUserResponse {
  @ApiProperty()
  @IsString()
  id: string;

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

export class DeleteUserResponse {
  @ApiProperty()
  @IsString()
  id: string;
}
