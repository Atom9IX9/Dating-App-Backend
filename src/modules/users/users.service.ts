import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import {
  UserResponse,
  DeleteUserResponse,
  GetUsersResponse,
  PublicUser,
  UpdateUserResponse,
} from './response';
import { nanoid } from 'nanoid';
import { MatchesService } from '../matches/matches.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly usersRepo: typeof User,
    private readonly matchesService: MatchesService,
  ) {}

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  public async findUserByEmail(
    email: string,
  ): Promise<User & { password: string }> {
    return await this.usersRepo.scope('login').findOne({ where: { email } });
  }

  public async createUser(dto: CreateUserDTO): Promise<UserResponse> {
    dto.password = await this.hashPassword(dto.password);
    const d1 = new Date();
    const d2 = new Date(dto.dateOfBD);
    const id = nanoid();
    const user = await this.usersRepo.create({
      uid: id,
      email: dto.email,
      dateOfBD: dto.dateOfBD,
      firstName: dto.firstName,
      lastName: dto.lastName,
      gender: dto.gender,
      location: dto.location,
      password: dto.password,
      age: d1.getFullYear() - d2.getFullYear(),
      description: dto.description,
    });

    return {
      uid: id,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      gender: dto.gender,
      age: user.age,
      dateOfBD: dto.dateOfBD,
      description: dto.description,
      location: dto.location,
    };
  }

  public async getPublicUsers(authUser: PublicUser): Promise<GetUsersResponse> {
    const users = await this.usersRepo.findAll({
      attributes: {
        exclude: ['dateOfBD', 'location'],
      },
    });
    const matches = await this.matchesService.getMatches({
      userId: authUser.uid,
    });

    const mappedUsers = users
      .map((u) => {
        for (const m of matches.rows) {
          if (u.uid === m.receiverId || u.uid === m.userId) {
            return { ...u.dataValues, matchStatus: m.status };
          }
        }
        return u;
      })
      .filter((u) => u.uid !== authUser.uid);

    return { rows: mappedUsers, count: mappedUsers.length };
  }

  public async getFullUserInfoById(uid: string): Promise<UserResponse> {
    const user = await this.usersRepo.findOne({
      where: { uid },
    });

    return user;
  }

  public async updateUser(
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

  public async deleteUser(userId: string): Promise<DeleteUserResponse> {
    await this.usersRepo.destroy({ where: { uid: userId } });
    return { uid: userId };
  }
}
