import { MatchesService } from './matches.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthPayloadRequest } from 'src/common/types/requests/requests';
import { JwtAuthGuard } from 'src/guards';
import { MatchResponse, GetIsMatchedResponse } from './response';
import { ReceiveMatchDTO } from './dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiTags('MATCHES')
  @ApiBearerAuth()
  @ApiResponse({
    type: MatchResponse,
    status: 201,
    description: 'Creates a match.',
  })
  @UseGuards(JwtAuthGuard)
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

  // @ApiTags('MATCHES')
  // @UseGuards(JwtAuthGuard)
  // @ApiResponse({ type: GetMatchesResponse, status: 200 })
  // @ApiQuery({ name: 'user', enum: UserTypeEnum })
  // @Get()
  // getMatches(
  //   @Req() request: AuthPayloadRequest,
  //   @Query('user') userType: UserTypeEnum,
  // ) {
  //   return this.matchesService.getMatches({
  //     userId: request.user.uid,
  //     userType,
  //   });
  // }

  @ApiTags('MATCHES')
  @ApiResponse({
    type: MatchResponse,
    status: 200,
    description: 'Sets the match status by matchId.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':matchId')
  setMatchStatus(
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
  @ApiResponse({
    type: GetIsMatchedResponse,
    status: 200,
    description: 'Checks if the user is matched with another user.',
  })
  @Get(':secondUserId')
  getIsMatched(
    @Req() request: AuthPayloadRequest,
    @Param('secondUserId') secondUserId: string,
  ): Promise<GetIsMatchedResponse> {
    return this.matchesService.getIsMatched(request.user.uid, secondUserId);
  }
}
