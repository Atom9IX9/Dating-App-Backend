/*
 * FILE: src/modules/users/users.module.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

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
import { StorageModule } from '../storage/storage.module';
import { Avatar } from './models/avatar.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Auth, UserHobby, Avatar]),
    MatchesModule,
    UserActivityModule,
    HobbiesModule,
    StorageModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
// NestJS class implementing UserModule.
export class UserModule {}
