/*
 * FILE: src/modules/usersActivity/usersActivity.service.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserActivity } from './models/userActivity.model';

// NestJS class implementing UserActivityService.
@Injectable()
export class UserActivityService {
  // Inject required services and repositories for this class.
  constructor(
    @InjectModel(UserActivity)
    private readonly activitiesRepo: typeof UserActivity,
  ) {}

  // Create activity and save it to the data store.
  async createActivity(userId: string) {
    const activity = await this.activitiesRepo.create({
      userId,
      isOnline: false,
    });

    return activity;
  }

  // Update the user's online status in the activity table.
  async setUserOnlineStatus(userId: string, isOnline: boolean) {
    const activity = await this.activitiesRepo.findOne({ where: { userId } });

    return await activity.update({ isOnline });
  }
}
