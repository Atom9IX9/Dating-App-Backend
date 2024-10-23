import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from '../users/dto';
import { ApiErrors } from 'src/common/constants/errors';
import { LoginDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from './response';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: CreateUserDTO): Promise<CreateUserDTO> {
    const userAlreadyExists = !!(await this.usersService.findUserByEmail(
      dto.email,
    ));
    if (userAlreadyExists)
      throw new BadRequestException(ApiErrors.USER_WITH_EMAIL_ALREADY_EXISTS);

    return this.usersService.createUser(dto);
  }

  async login(dto: LoginDTO): Promise<AuthResponse> {
    const userAlreadyExists = await this.usersService.findUserByEmail(
      dto.email,
    );
    if (!userAlreadyExists) {
      throw new BadRequestException(ApiErrors.USER_DOES_NOT_EXIST);
    }

    const isValidPassword = await bcrypt.compare(
      dto.password,
      userAlreadyExists.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException(ApiErrors.WRONG_EMAIL_OR_PASSWORD);
    }

    const token = this.tokenService.generateJwtToken({ email: dto.email });
    const user = await this.usersService.publicUser(dto.email);

    return { user, token };
  }
}
