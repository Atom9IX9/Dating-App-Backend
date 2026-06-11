/*
 * FILE: src/modules/messages/response/index.ts
 * PURPOSE: Barrel file re-exporting module members for easier imports.
 */

import { ApiProperty } from '@nestjs/swagger';
import { Message } from '../models/message.model';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';

// NestJS class implementing GetUserMessagesFromRoomResponse.
export class GetUserMessagesFromRoomResponse {
  @ApiProperty({ type: Message, isArray: true })
  @IsArray()
  @Type(() => Message)
  messages: Message[];
}
