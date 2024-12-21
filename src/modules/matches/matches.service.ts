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

@Injectable()
export class MatchesService {
  constructor(@InjectModel(Match) private readonly matchesRepo: typeof Match) {}

  async createMatch(dto: MatchDTO): Promise<MatchResponse> {
    const match = await this.matchesRepo.create({ ...dto, status: 'pending' });

    return match;
  }

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

  async acceptMatch(
    userId: string,
    matchId: number,
    receive: UserReceives,
  ): Promise<MatchResponse> {
    const match = await this.matchesRepo.findOne({ where: { id: matchId } });

    if (match.receiverId !== userId) {
      throw new BadRequestException('User is not receiver');
    }

    match.update({ status: receive });

    return match;
  }

  // private async getSecondUsersByUserTypeAndMatches(
  //   userType: UserTypeEnum,
  //   matches: Match[],
  // ): Promise<GetMatchResponse[]> {
  //   let secondUserIds: string[];
  //   let secondUsers: GetUsersResponse;
  //   let result: GetMatchResponse[];

  //   if (userType === UserTypeEnum.Receiver) {
  //     secondUserIds = matches.map((m) => m.userId);
  //     secondUsers = await this.usersService.getPublicUsers(secondUserIds);
  //     result = matches.map((m) => {
  //       for (const u of secondUsers.rows) {
  //         if (u.uid === m.userId) {
  //           return { ...m.dataValues, secondUser: u };
  //         }
  //       }
  //     });
  //   } else {
  //     secondUserIds = matches.map((m) => m.receiverId);
  //     secondUsers = await this.usersService.getPublicUsers(secondUserIds);
  //     result = matches.map((m) => {
  //       for (const u of secondUsers.rows) {
  //         if (u.uid === m.receiverId) {
  //           return { ...m.dataValues, secondUser: u };
  //         }
  //       }
  //     });
  //   }

  //   return result;
  // }
}
