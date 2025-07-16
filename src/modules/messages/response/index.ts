import { ApiProperty } from "@nestjs/swagger";
import { Message } from "../models/message.model";
import { IsArray } from "class-validator";
import { Type } from "class-transformer";

export class GetUserMessagesFromRoomResponse {
  @ApiProperty({ type: Message, isArray: true })
  @IsArray()
  @Type(() => Message)
  messages: Message[];
}