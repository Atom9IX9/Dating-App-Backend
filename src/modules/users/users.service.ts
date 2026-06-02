import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserAvatarDTO,
  UserDescriptionDTO,
} from './dto';
import {
  UserResponse,
  DeleteUserResponse,
  GetUsersResponse,
  UpdateUserResponse,
  UserDescriptionResponse,
  UserAvatarResponse,
} from './response';
import { nanoid } from 'nanoid';
import { MatchesService } from '../matches/matches.service';
import { UserActivity } from '../usersActivity/models/userActivity.model';
import { UserActivityService } from '../usersActivity/usersActivity.service';
import { getAgeByBd } from './utils/getAgeFromBd';
import { HobbiesService } from '../hobbies/hobbies.service';
import { StorageService } from '../storage/storage.service';
import { StorageFolder } from '@/common/storage/storage.constants';
import { Avatar } from './models/avatar.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly usersRepo: typeof User,
    @InjectModel(Avatar) private readonly avatarsRepo: typeof Avatar,
    private readonly matchesService: MatchesService,
    private readonly activitiesService: UserActivityService,
    private readonly hobbiesService: HobbiesService,
    private readonly storageService: StorageService,
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
    const sinhronizedHobbies = await this.hobbiesService.syncHobbies(
      dto.hobbies,
    );
    const user = await this.usersRepo.findOne({ where: { uid: userId } });
    console.log(sinhronizedHobbies, userId);

    await user.$set(
      'hobbies',
      sinhronizedHobbies.map((h) => h.id),
    );
    await user.update({ description: dto.description });

    return {
      description: dto.description,
      hobbies: sinhronizedHobbies.map((h) => h.name),
    };
  }

  public async saveUserAvatar(
    dto: UserAvatarDTO,
    userId: string,
    avatar: Express.Multer.File,
  ): Promise<UserAvatarResponse> {
    const saved = this.storageService.saveFile(avatar, StorageFolder.AVATARS);

    console.log(avatar);

    const createdAvatar = await this.avatarsRepo.create({
      userId,
      url: saved.url,
      posX: Math.round(Number(dto.posX)),
      posY: Math.round(Number(dto.posY)),
      scale: Math.round(Number(dto.scale)),
    });

    return {
      scale: Number(Number(dto.scale).toFixed(3)),
      posX: Math.round(Number(dto.posX)),
      posY: Math.round(Number(dto.posY)),
      url: saved.url,
    };
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
