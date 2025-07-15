import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

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
  @ApiProperty({ type: ChatResponse, isArray: true })
  @IsArray()
  @Type(() => ChatResponse)
  chats: ChatResponse[];
}
