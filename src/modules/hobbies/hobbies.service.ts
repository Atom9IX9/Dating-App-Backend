import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Hobby } from './models/hobby.model';
import { Op } from 'sequelize';

@Injectable()
export class HobbiesService {
  constructor(@InjectModel(Hobby) private readonly hobbiesRepo: typeof Hobby) {}

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
