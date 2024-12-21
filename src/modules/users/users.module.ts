import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { MatchesModule } from '../matches/matches.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), MatchesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
