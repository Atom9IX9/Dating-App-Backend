import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreatePrivatChatResponse {
  @ApiProperty()
  @IsNumber()
  room: string;
}
