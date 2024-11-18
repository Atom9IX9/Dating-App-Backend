import { MatchesService } from './matches.service';
import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthPayloadRequest } from 'src/common/types/requests/requests';
import { JwtAuthGuard } from 'src/guards';
import { CreateMatchResponse } from './response';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiTags('MATCHES')
  @UseGuards(JwtAuthGuard)
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
}
