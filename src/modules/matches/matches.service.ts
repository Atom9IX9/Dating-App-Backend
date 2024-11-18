import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Match } from './models/match.model';
import { MatchDTO } from './dto';
import { CreateMatchResponse } from './response';
import { UsersService } from '../users/users.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match) private readonly matchesRepo: typeof Match,
    private readonly usersService: UsersService,
  ) {}

  async createMatch(dto: MatchDTO): Promise<CreateMatchResponse> {
    const receiver = await this.usersService.publicUser(dto.receiverId);
    console.log(receiver);
    if (!receiver) {
      throw new BadRequestException('User with "receiverId" does not exist');
    }
    const match = await this.matchesRepo.create({ ...dto, status: 'pending' });

    return match;
  }
}
