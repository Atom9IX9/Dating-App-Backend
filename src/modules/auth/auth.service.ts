import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from '../users/dto';
import { ApiErrors } from 'src/common/constants/errors';
import { LoginDTO, RegisterAuthCredentialsDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { AuthResponse, RefreshedTokens, RegisterAuthCredentialsResponse } from './response';
import { TokenService } from '../token/token.service';
import { UserResponse } from '../users/response';
import { Auth } from './model/auth.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    @InjectModel(Auth) private readonly authRepo: typeof Auth,
  ) {}

  public async refreshTokens(authId: number): Promise<RefreshedTokens> {
    // !!! todo: resresh in db

    const accessToken = this.tokenService.generateJwtToken(authId, 'access');
    const refreshToken = this.tokenService.generateJwtToken(authId, 'refresh');

    return { accessToken, refreshToken };
  }

  public async registerAuthCredentials(
    dto: RegisterAuthCredentialsDTO,
  ): Promise<RegisterAuthCredentialsResponse> {
    const userAlreadyExists = !!(await this.findAuthByEmail(dto.email));

    if (userAlreadyExists)
      throw new BadRequestException(ApiErrors.USER_WITH_EMAIL_ALREADY_EXISTS);

    const hashedPassword = await this.hashPassword(dto.password);
    const authCredentials = await this.authRepo.create({
      email: dto.email,
      password: hashedPassword,
    });

    const accessToken = this.tokenService.generateJwtToken(
      authCredentials.authId,
      'access',
    );

    const refreshToken = this.tokenService.generateJwtToken(
      authCredentials.authId,
      'refresh',
    );

    return {
      accessToken,
      refreshToken,
      auth: {
        authId: authCredentials.authId,
        email: authCredentials.email,
      },
    };
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  // public async register(dto: CreateUserDTO): Promise<AuthResponse> {
  //   const userAlreadyExists = !!(await this.findAuthByEmail(dto.email));
  //   if (userAlreadyExists)
  //     throw new BadRequestException(ApiErrors.USER_WITH_EMAIL_ALREADY_EXISTS);

  //   const user = await this.usersService.createUser(dto);

  //   return this.generateAuthResponseWithToken(user, false);
  // }

  // public async login(dto: LoginDTO): Promise<AuthResponse> {
  //   const user = await this.findAuthByEmail(dto.email);
  //   if (!user) {
  //     throw new NotFoundException(ApiErrors.USER_DOES_NOT_EXIST);
  //   }

  //   const isValidPassword = await bcrypt.compare(dto.password, user.password);
  //   if (!isValidPassword) {
  //     throw new BadRequestException(ApiErrors.WRONG_EMAIL_OR_PASSWORD);
  //   }

  //   return this.generateAuthResponseWithToken(
  //     { ...user.dataValues, password: undefined },
  //     dto.rememberMe,
  //   );
  // }

  private async findAuthByEmail(email: string): Promise<Auth> {
    return await this.authRepo.findOne({ where: { email } });
  }

  public async checkAuth(user: UserResponse): Promise<UserResponse> {
    return user;
  }

  // private generateAuthResponseWithToken(
  //   user: UserResponse,
  //   rememberUser: boolean,
  // ): AuthResponse {
  //   const token = this.tokenService.generateJwtToken(user, rememberUser);

  //   return { user, token };
  // }
}
