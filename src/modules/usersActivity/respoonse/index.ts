import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString } from "class-validator";

export class UserActivityResponse {
    @ApiProperty()
    @IsBoolean()
    isOnline: boolean;

    @IsDateString()
    lastSeen: string;
}