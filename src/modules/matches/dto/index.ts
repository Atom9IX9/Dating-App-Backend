import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MatchDTO {
  @ApiProperty()
  @IsString()
  receiverId: string;

  @ApiProperty()
  @IsString()
  userId: string;
}
