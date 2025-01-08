import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';
import { UserResponse } from 'src/modules/users/response';

export class AuthResponse {
  @ApiProperty()
  @IsObject()
  user: UserResponse;

  @ApiProperty()
  @IsString()
  token: string;
}
