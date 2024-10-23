import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString } from 'class-validator';

export class GetUsersResponse {
  @ApiProperty()
  @IsArray()
  rows: PublicUserResponse[];

  @ApiProperty()
  @IsInt()
  count: number;
}

export class PublicUserResponse {
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
