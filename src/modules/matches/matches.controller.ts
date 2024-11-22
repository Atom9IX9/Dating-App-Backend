import { MatchesService } from './matches.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthPayloadRequest } from 'src/common/types/requests/requests';
import { JwtAuthGuard } from 'src/guards';
import {
  MatchResponse,
  GetMatchesResponse,
  GetIsMatchedResponse,
} from './response';
import { UserTypeEnum } from './types';
import { ReceiveMatchDTO } from './dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiTags('MATCHES')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: MatchResponse, status: 201 })
  @Post(':receiverId')
  createMatch(
    @Req() request: AuthPayloadRequest,
    @Param('receiverId') receiverId: string,
  ): Promise<MatchResponse> {
    return this.matchesService.createMatch({
      userId: request.user.uid,
      receiverId,
    });
  }

  @ApiTags('MATCHES')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: GetMatchesResponse, status: 200 })
  @ApiQuery({ name: 'user', enum: UserTypeEnum })
  @Get()
  getMatches(
    @Req() request: AuthPayloadRequest,
    @Query('user') userType: UserTypeEnum,
  ) {
    return this.matchesService.getMatches({
      userId: request.user.uid,
      userType,
    });
  }

  @ApiTags('MATCHES')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: MatchResponse, status: 200 })
  @Patch(':matchId')
  acceptMatch(
    @Param('matchId') matchId: number,
    @Req() request: AuthPayloadRequest,
    @Body() dto: ReceiveMatchDTO,
  ): Promise<MatchResponse> {
    return this.matchesService.acceptMatch(
      request.user.uid,
      matchId,
      dto.receive,
    );
  }

  @ApiTags('MATCHES')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: GetIsMatchedResponse, status: 200 })
  @Get(':secondUserId')
  getIsMatched(
    @Req() request: AuthPayloadRequest,
    @Param('secondUserId') secondUserId: string,
  ): Promise<GetIsMatchedResponse> {
    return this.matchesService.getIsMatched(request.user.uid, secondUserId);
  }
}
