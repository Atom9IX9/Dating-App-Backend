/*
 * FILE: src/modules/matches/matches.service.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Match } from './models/match.model';
import { GetMatchesDTO, MatchDTO } from './dto';
import {
  GetIsMatchedResponse,
  GetMatchesResponse,
  MatchResponse,
} from './response';
import { UserReceives, UserTypeEnum } from './types';

// NestJS class implementing MatchesService.
@Injectable()
export class MatchesService {
  // Inject required services and repositories for this class.
  constructor(@InjectModel(Match) private readonly matchesRepo: typeof Match) {}

  // Create match and save it to the data store.
  async createMatch(dto: MatchDTO): Promise<MatchResponse> {
    const match = await this.matchesRepo.create({ ...dto, status: 'pending' });

    return match;
  }

  // Retrieve matches and return the requested data.
  async getMatches(dto: GetMatchesDTO): Promise<GetMatchesResponse> {
    let matches: GetMatchesResponse;
    switch (dto.userType) {
      case UserTypeEnum.Receiver: {
        matches = await this.matchesRepo.findAndCountAll({
          where: { receiverId: dto.userId },
        });
        break;
      }

      case UserTypeEnum.Sender: {
        matches = await this.matchesRepo.findAndCountAll({
          where: { userId: dto.userId },
        });
        break;
      }

      default: {
        const asReceiverPromise = this.matchesRepo.findAndCountAll({
          where: { receiverId: dto.userId },
        });
        const asSenderPromise = this.matchesRepo.findAndCountAll({
          where: { userId: dto.userId },
        });
        const [asReceiver, asSender] = await Promise.all([
          asReceiverPromise,
          asSenderPromise,
        ]);

        matches = {
          rows: [...asReceiver.rows, ...asSender.rows],
          count: asReceiver.count + asSender.count,
        };
      }
    }

    return matches;
  }

  // Retrieve is matched and return the requested data.
  async getIsMatched(
    userId: string,
    secondUserId: string,
  ): Promise<GetIsMatchedResponse> {
    let match: Match;

    match = await Match.findOne({
      where: { userId, receiverId: secondUserId },
    });
    if (!match) {
      match = await Match.findOne({
        where: { userId: secondUserId, receiverId: userId },
      });
    }

    return { status: match ? match.status : undefined, isMatched: !!match };
  }

  // Confirm the receiver's response and update match status accordingly.
  async acceptMatch(
    userId: string,
    matchId: number,
    receive: UserReceives,
  ): Promise<MatchResponse> {
    const match = await this.matchesRepo.findOne({ where: { id: matchId } });

    if (match.receiverId !== userId) {
      throw new BadRequestException('User is not receiver');
    }

    // Confirm the receiver's response and update match status accordingly.
    match.update({ status: receive });

    return match;
  }
}
