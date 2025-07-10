import { IsString } from 'class-validator';

export class CreateMessageDTO {
  @IsString()
  room: string;

  @IsString()
  userId: string;

  @IsString()
  text: string;
}
