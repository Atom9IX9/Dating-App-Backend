/*
 * FILE: src/modules/hobbies/hobbies.module.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Hobby } from './models/hobby.model';
import { HobbiesService } from './hobbies.service';

@Module({
  imports: [SequelizeModule.forFeature([Hobby])],
  providers: [HobbiesService],
  exports: [HobbiesService],
})
// NestJS class implementing HobbiesModule.
export class HobbiesModule {}
