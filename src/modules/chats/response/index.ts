/*
 * FILE: src/modules/chats/response/index.ts
 * PURPOSE: Barrel file re-exporting module members for easier imports.
 */

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

// NestJS class implementing ChatUserResponse.
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

// NestJS class implementing ChatResponse.
export class ChatResponse {
  @ApiProperty()
  @IsString()
  room: string;

  @ApiProperty()
  @Type(() => ChatUserResponse)
  chatUser: ChatUserResponse;
}

// NestJS class implementing GetUserChatsResponse.
export class GetUserChatsResponse {
  @ApiProperty({ type: ChatResponse })
  @IsArray()
  @Type(() => ChatResponse)
  chats: ChatResponse[];
}
