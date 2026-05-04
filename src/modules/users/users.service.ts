import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserDTO, UpdateUserDTO, UserDescriptionDTO } from './dto';
import {
  UserResponse,
  DeleteUserResponse,
  GetUsersResponse,
  UpdateUserResponse,
  UserDescriptionResponse,
} from './response';
import { nanoid } from 'nanoid';
import { MatchesService } from '../matches/matches.service';
import { UserActivity } from '../usersActivity/models/userActivity.model';
import { UserActivityService } from '../usersActivity/usersActivity.service';
import { Auth } from '../auth/model/auth.model';
import { getAgeByBd } from './utils/getAgeFromBd';
import { HobbiesService } from '../hobbies/hobbies.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly usersRepo: typeof User,
    private readonly matchesService: MatchesService,
    private readonly activitiesService: UserActivityService,
    private readonly hobbiesService: HobbiesService,
  ) {}

  public async createUser(
    dto: CreateUserDTO,
    authId: number,
  ): Promise<UserResponse> {
    const id = nanoid();
    const user = await this.usersRepo.create({
      uid: id,
      dateOfBD: dto.dateOfBD,
      firstName: dto.firstName,
      lastName: dto.lastName,
      gender: dto.gender,
      genderInfo: dto.genderInfo,
      authId: authId,
    });

    const activity = this.activitiesService.createActivity(id);

    return {
      uid: id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      gender: dto.gender,
      dateOfBD: dto.dateOfBD,
      genderInfo: dto.genderInfo,
      age: getAgeByBd(dto.dateOfBD),
      authId: authId,
    };
  }

  public async createUserDescription(
    userId: string,
    dto: UserDescriptionDTO,
  ): Promise<UserDescriptionResponse> {
    const sinhronizedHobbies = await this.hobbiesService.syncHobbies(dto.hobbies);
    const user = await this.usersRepo.findOne({ where: { uid: userId } });
    console.log(sinhronizedHobbies, userId);

    await user.$set('hobbies', sinhronizedHobbies.map((h) => h.id));
    await user.update({ description: dto.description });

    return {
      description: dto.description,
      hobbies: sinhronizedHobbies.map((h) => h.name),
    }
  }

  public async getPublicUsers(authUserId: string): Promise<GetUsersResponse> {
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

  public async getUserInfoById(uid: string): Promise<UserResponse> {
    const user = await this.usersRepo.findOne({
      where: { uid },
    });

    return {
      uid,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      dateOfBD: user.dateOfBD,
      genderInfo: user.genderInfo,
      age: getAgeByBd(user.dateOfBD),
      authId: user.authId,
    };
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
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
        include: ['uid', 'firstName', 'lastName'],
      },
    });
  }
}
