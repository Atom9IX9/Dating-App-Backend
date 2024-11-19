import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Match } from './models/match.model';
import { GetMatchesDTO, MatchDTO } from './dto';
import { MatchResponse, GetMatchesResponse } from './response';
import { UsersService } from '../users/users.service';
import { TGetMatchesWhereObj, UserReceives, UserTypeEnum } from './types';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match) private readonly matchesRepo: typeof Match,
    private readonly usersService: UsersService,
  ) {}

  async createMatch(dto: MatchDTO): Promise<MatchResponse> {
    const receiver = await this.usersService.publicUser(dto.receiverId);
    console.log(receiver);
    if (!receiver) {
      throw new BadRequestException('User with "receiverId" does not exist');
    }
    const match = await this.matchesRepo.create({ ...dto, status: 'pending' });

    return match;
  }

  async getMatches({
    userId,
    userType,
  }: GetMatchesDTO): Promise<GetMatchesResponse> {
    const where: TGetMatchesWhereObj = {};
    if (userType === UserTypeEnum.Sender) {
      where.userId = userId;
    } else {
      where.receiverId = userId;
    }
    const matches = await this.matchesRepo.findAndCountAll({
      where,
    });

    return matches;
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
}
