import { MatchesService } from './matches.service';
import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthPayloadRequest } from 'src/common/types/requests/requests';
import { JwtAuthGuard } from 'src/guards';
import { CreateMatchResponse, GetMatchesResponse } from './response';
import { UserTypes } from './types';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiTags('MATCHES')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: CreateMatchResponse, status: 201 })
  @Post(':receiverId')
  createMatch(
    @Req() request: AuthPayloadRequest,
    @Param('receiverId') receiverId: string,
  ): Promise<CreateMatchResponse> {
    return this.matchesService.createMatch({
      userId: request.user.uid,
      receiverId,
    });
  }

  @ApiTags('MATCHES')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: GetMatchesResponse, status: 200 })
  @ApiQuery({ name: 'user', enum: UserTypes })
  @Get()
  getMatches(
    @Req() request: AuthPayloadRequest,
    @Query('user') userType: UserTypes,
  ) {
    return this.matchesService.getMatches({
      userId: request.user.uid,
      userType,
    });
  }
}
