import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserActivityService } from './usersActivity.service';
import { UserActivity } from './models/userActivity.model';

@Module({
  imports: [SequelizeModule.forFeature([UserActivity])],
  providers: [UserActivityService],
  exports: [UserActivityService],
})
export class UserActivityModule {}
