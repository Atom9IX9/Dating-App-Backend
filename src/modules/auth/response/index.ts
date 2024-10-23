import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';
import { PublicUserResponse } from 'src/modules/users/response';

export class AuthResponse {
  @ApiProperty()
  @IsObject()
  user: PublicUserResponse;

  @ApiProperty()
  @IsString()
  token: string;
}
