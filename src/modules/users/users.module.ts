import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { MatchesModule } from '../matches/matches.module';
import { UserActivityModule } from '../usersActivity/usersActivity.module';
import { Auth } from '../auth/model/auth.model';
import { UserHobby } from './models/userHobby.model';
import { HobbiesModule } from '../hobbies/hobbies.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Auth, UserHobby]),
    MatchesModule,
    UserActivityModule,
    HobbiesModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
