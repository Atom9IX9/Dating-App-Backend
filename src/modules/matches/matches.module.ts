import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Match } from './models/match.model';
import { UserModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Match]), UserModule],
  providers: [MatchesService],
  controllers: [MatchesController],
})
export class MatchesModule {}
