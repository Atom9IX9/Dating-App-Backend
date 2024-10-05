import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto';
import { ApiErrors } from 'src/common/errors';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userRepo: typeof User) {}

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async findUserByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    const userAlreadyExists = !!(await this.findUserByEmail(dto.email));

    if (userAlreadyExists)
      throw new BadRequestException(ApiErrors.USER_WITH_EMAIL_ALREADY_EXISTS);

    dto.password = await this.hashPassword(dto.password);
    await this.userRepo.create({
      email: dto.email,
      dateOfDB: dto.dateOfBD,
      firstName: dto.firstName,
      lastName: dto.lastName,
      gender: dto.gender,
      location: dto.location,
    });
    return dto;
  }
}
