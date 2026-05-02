import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Hobby } from './models/hobby.model';

@Module({
  imports: [SequelizeModule.forFeature([Hobby])],
})
export class HobbiesModule {}
