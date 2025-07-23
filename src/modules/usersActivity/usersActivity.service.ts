import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserActivity } from './models/userActivity.model';

@Injectable()
export class UserActivityService {
  constructor(
    @InjectModel(UserActivity)
    private readonly activitiesRepo: typeof UserActivity,
  ) {}

  async createActivity(userId: string) {
    const activity = await this.activitiesRepo.create({
      userId,
      isOnline: false,
    });

    return activity;
  }

  async setUserOnlineStatus(userId: string, isOnline: boolean) {
    const activity = await this.activitiesRepo.findOne({ where: { userId } });

    return await activity.update({ isOnline });
  }
}
