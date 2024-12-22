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
import { CreateUserResponse } from '../users/response';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: CreateUserDTO): Promise<CreateUserResponse> {
    const userAlreadyExists = !!(await this.usersService.findUserByEmail(
      dto.email,
    ));
    if (userAlreadyExists)
      throw new BadRequestException(ApiErrors.USER_WITH_EMAIL_ALREADY_EXISTS);

    await this.usersService.createUser(dto);

    return {
      dateOfBD: dto.dateOfBD,
      email: dto.email,
      firstName: dto.firstName,
      gender: dto.gender,
      lastName: dto.lastName,
      location: dto.location,
      description: dto.description,
    };
  }

  async login(dto: LoginDTO): Promise<AuthResponse> {
    const userAlreadyExists = await this.usersService.findUserByEmail(
      dto.email,
    );
    if (!userAlreadyExists) {
      throw new NotFoundException(ApiErrors.USER_DOES_NOT_EXIST);
    }

    const isValidPassword = await bcrypt.compare(
      dto.password,
      userAlreadyExists.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException(ApiErrors.WRONG_EMAIL_OR_PASSWORD);
    }

    const userData = {
      uid: userAlreadyExists.uid,
      email: userAlreadyExists.email,
      firstName: userAlreadyExists.firstName,
      gender: userAlreadyExists.gender,
      dateOfBD: userAlreadyExists.dateOfBD,
      lastName: userAlreadyExists.lastName,
      location: userAlreadyExists.location,
      age: userAlreadyExists.age,
      description: userAlreadyExists.description,
    };

    const token = this.tokenService.generateJwtToken(userData);

    return { user: userData, token };
  }
}
