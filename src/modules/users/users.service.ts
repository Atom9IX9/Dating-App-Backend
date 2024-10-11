import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userRepo: typeof User) {}

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async findUserByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    dto.password = await this.hashPassword(dto.password);
    const d1 = new Date();
    const d2 = new Date(dto.dateOfBD);
    await this.userRepo.create({
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

  async getUsers() {
    const users = await this.userRepo.findAndCountAll();
    return users;
  }
}
