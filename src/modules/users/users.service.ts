import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
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
import { UserActivity } from '../usersActivity/models/userActivity.model';
import { UserActivityService } from '../usersActivity/usersActivity.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly usersRepo: typeof User,
    private readonly matchesService: MatchesService,
    private readonly activitiesService: UserActivityService,
  ) {}

  public async createUser(dto: CreateUserDTO): Promise<UserResponse> {
    const d1 = new Date();
    const d2 = new Date(dto.dateOfBD);
    const id = nanoid();
    const user = await this.usersRepo.create({
      uid: id,
      dateOfBD: dto.dateOfBD,
      firstName: dto.firstName,
      lastName: dto.lastName,
      gender: dto.gender,
      location: dto.location,
      age: d1.getFullYear() - d2.getFullYear(),
      description: dto.description,
    });

    const activity = this.activitiesService.createActivity(id);

    return {
      uid: id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      gender: dto.gender,
      age: user.age,
      dateOfBD: dto.dateOfBD,
      description: dto.description,
      location: dto.location,
    };
  }

  public async getPublicUsers(
    authUserId: string,
  ): Promise<GetUsersResponse> {
    const users = await this.usersRepo.findAll({
      attributes: {
        exclude: ['dateOfBD', 'location'],
      },
      include: { model: UserActivity, attributes: ['isOnline', 'updatedAt'] },
    });
    const matches = await this.matchesService.getMatches({
      userId: authUserId,
    });

    const mappedUsers = users
      .map((u) => {
        for (const m of matches.rows) {
          if (u.uid === m.receiverId || u.uid === m.userId) {
            return {
              ...u.dataValues,
              matchStatus: m.status,
            };
          }
        }
        return u;
      })
      .filter((u) => u.uid !== authUserId);

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

  public async getUserByAuthId(authId: number): Promise<User> {
    return await this.usersRepo.findOne({
      where: { authId },
      attributes: { exclude: ['createdAt', 'updatedAt'], include: ['uid', 'firstName', 'lastName'] },
    });
  }
}
