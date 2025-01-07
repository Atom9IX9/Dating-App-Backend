import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from '../users/dto';
import { ApiErrors } from 'src/common/constants/errors';
import { LoginDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from './response';
import { TokenService } from '../token/token.service';
import { User } from '../users/models/user.model';
import { CreateUserResponse, PublicUser } from '../users/response';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  public async register(dto: CreateUserDTO): Promise<AuthResponse> {
    const userAlreadyExists = !!(await this.usersService.findUserByEmail(
      dto.email,
    ));
    if (userAlreadyExists)
      throw new BadRequestException(ApiErrors.USER_WITH_EMAIL_ALREADY_EXISTS);

    const user = await this.usersService.createUser(dto);

    return this.generateAuthResponse(user, false);
  }

  public async login(dto: LoginDTO): Promise<AuthResponse> {
    const user = await this.usersService.findUserByEmail(dto.email);
    if (!user) {
      throw new NotFoundException(ApiErrors.USER_DOES_NOT_EXIST);
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException(ApiErrors.WRONG_EMAIL_OR_PASSWORD);
    }

    return this.generateAuthResponse(user, dto.rememberMe);
  }

  public async checkAuth(user: PublicUser): Promise<PublicUser> {
    return user;
  }

  private generateAuthResponse(
    user: User | CreateUserResponse,
    rememberUser: boolean,
  ): AuthResponse {
    const userData = {
      uid: user.uid,
      email: user.email,
      firstName: user.firstName,
      gender: user.gender,
      dateOfBD: user.dateOfBD,
      lastName: user.lastName,
      location: user.location,
      age: user.age,
      description: user.description,
    };

    const token = this.tokenService.generateJwtToken(userData, rememberUser);

    return { user: userData, token };
  }
}
