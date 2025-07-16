import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsString } from 'class-validator';
import { Message } from 'src/modules/messages/models/message.model';

export class ChatUserResponse {
  @ApiProperty()
  @IsString()
  uid: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;
}

export class ChatResponse {
  @ApiProperty()
  @IsString()
  room: string;

  @ApiProperty()
  @Type(() => ChatUserResponse)
  chatUser: ChatUserResponse;
}

export class GetUserChatsResponse {
  @ApiProperty({ type: ChatResponse })
  @IsArray()
  @Type(() => ChatResponse)
  chats: ChatResponse[];
}
