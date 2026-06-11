/*
 * FILE: src/modules/hobbies/hobbies.service.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Hobby } from './models/hobby.model';
import { Op } from 'sequelize';

// NestJS class implementing HobbiesService.
@Injectable()
export class HobbiesService {
  // Inject required services and repositories for this class.
  constructor(@InjectModel(Hobby) private readonly hobbiesRepo: typeof Hobby) {}

  // Synchronize hobby names with stored hobby records.
  public async syncHobbies(hobbiesNames: string[]) {
    const normalized = [
      ...new Set(hobbiesNames.map((h) => h.trim().toLowerCase())),
    ];

    await this.hobbiesRepo.bulkCreate(
      normalized.map((h) => ({ name: h })),
      { ignoreDuplicates: true },
    );

    const allHobbies = await this.hobbiesRepo.findAll({
      where: { name: { [Op.in]: normalized } },
    });

    return allHobbies;
  }
}
