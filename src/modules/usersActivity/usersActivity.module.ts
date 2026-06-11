/*
 * FILE: src/modules/usersActivity/usersActivity.module.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserActivityService } from './usersActivity.service';
import { UserActivity } from './models/userActivity.model';

@Module({
  imports: [SequelizeModule.forFeature([UserActivity])],
  providers: [UserActivityService],
  exports: [UserActivityService],
})
// NestJS class implementing UserActivityModule.
export class UserActivityModule {}
