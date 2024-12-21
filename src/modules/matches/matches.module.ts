import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Match } from './models/match.model';

@Module({
  imports: [SequelizeModule.forFeature([Match])],
  providers: [MatchesService],
  controllers: [MatchesController],
  exports: [MatchesService],
})
export class MatchesModule {}
