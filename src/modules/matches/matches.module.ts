/*
 * FILE: src/modules/matches/matches.module.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

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
// NestJS class implementing MatchesModule.
export class MatchesModule {}
