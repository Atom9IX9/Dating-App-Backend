import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';
import { PublicUser } from 'src/modules/users/response';

export class AuthResponse {
  @ApiProperty()
  @IsObject()
  user: PublicUser;

  @ApiProperty()
  @IsString()
  token: string;
}
