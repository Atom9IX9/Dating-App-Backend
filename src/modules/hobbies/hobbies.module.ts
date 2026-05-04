import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Hobby } from './models/hobby.model';
import { HobbiesService } from './hobbies.service';

@Module({
  imports: [SequelizeModule.forFeature([Hobby])],
  providers: [HobbiesService],
  exports: [HobbiesService],
})
export class HobbiesModule {}
