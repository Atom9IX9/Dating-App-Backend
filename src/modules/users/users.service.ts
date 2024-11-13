import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import {
  GetUsersResponse,
  PublicUserResponse,
  UpdateUserResponse,
} from './response';

@Injectable()
export class UsersService {
  private privateUserFieldsAttributesExclude: string[];

  constructor(@InjectModel(User) private readonly usersRepo: typeof User) {
    this.privateUserFieldsAttributesExclude = [
      'password',
      'dateOfBD',
      'location',
      'createdAt',
      'updatedAt',
    ];
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async findUserByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    dto.password = await this.hashPassword(dto.password);
    const d1 = new Date();
    const d2 = new Date(dto.dateOfBD);
    await this.usersRepo.create({
      email: dto.email,
      dateOfBD: dto.dateOfBD,
      firstName: dto.firstName,
      lastName: dto.lastName,
      gender: dto.gender,
      location: dto.location,
      password: dto.password,
      age: d1.getFullYear() - d2.getFullYear(),
    });

    return dto;
  }

  async getPublicUsers(): Promise<GetUsersResponse> {
    const users = await this.usersRepo.findAndCountAll({
      attributes: { exclude: this.privateUserFieldsAttributesExclude },
    });
    return users;
  }

  async publicUser(email: string): Promise<PublicUserResponse> {
    const publicUser = await this.usersRepo.findOne({
      where: { email },
      attributes: {
        exclude: this.privateUserFieldsAttributesExclude,
      },
    });

    return publicUser.dataValues;
  }

  async updateUser(
    userId: string,
    dto: UpdateUserDTO,
  ): Promise<UpdateUserResponse> {
    await this.usersRepo.update(dto, {
      where: { id: userId },
    });

    const newUser = {
      id: userId,
      dateOfBD: dto.dateOfBD,
      firstName: dto.firstName,
      gender: dto.gender,
      lastName: dto.lastName,
      location: dto.location,
    };
    return newUser;
  }
}
