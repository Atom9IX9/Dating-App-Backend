import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from '../users/dto';
import { ApiErrors } from 'src/common/constants/errors';
import { LoginDTO, RegisterAuthCredentialsDTO } from './dto';
import * as bcrypt from 'bcrypt';
import {
  AuthCredentials,
  AuthResponse,
  RefreshedTokens,
  RegisterAuthCredentialsResponse,
} from './response';
import { TokenService } from '../token/token.service';
import { UserResponse } from '../users/response';
import { Auth } from './model/auth.model';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshToken } from './model/refreshToken.model';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/types/requests/requests';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,

    @InjectModel(Auth) private readonly authRepo: typeof Auth,
    @InjectModel(RefreshToken)
    private readonly refreshTokensRepo: typeof RefreshToken,
  ) {}

  public async refreshTokens(
    authId: number,
    jti: string,
  ): Promise<RefreshedTokens> {
    const dbToken = await this.refreshTokensRepo.findOne({
      where: { authId, jti },
    });

    if (!dbToken) {
      throw new UnauthorizedException();
    }

    const accessToken = this.tokenService.generateJwtToken(authId, 'access');
    const newRefreshToken = this.tokenService.generateJwtToken(
      authId,
      'refresh',
    );

    const newDBRefreshToken = await this.refreshTokensRepo.update(
      { jti: newRefreshToken.jti },
      { where: { authId } },
    );

    return {
      accessToken: accessToken.token,
      refreshToken: newRefreshToken.token,
    };
  }

  public async registerAuthCredentials(
    dto: RegisterAuthCredentialsDTO,
  ): Promise<{ auth: AuthCredentials } & RefreshedTokens> {
    const userAlreadyExists = !!(await this.findAuthByEmail(dto.email));

    if (userAlreadyExists)
      throw new BadRequestException(ApiErrors.USER_WITH_EMAIL_ALREADY_EXISTS);

    const hashedPassword = await this.hashData(dto.password);

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

    const newDBToken = await this.refreshTokensRepo.create({
      authId: authCredentials.authId,
      jti: refreshToken.jti,
    });

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      auth: {
        authId: authCredentials.authId,
        email: authCredentials.email,
      },
    };
  }

  private async hashData(data: string) {
    return bcrypt.hash(data, 10);
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

  public async checkAuth(userId: string): Promise<UserResponse> {
    const user = await this.usersService.getFullUserInfoById(userId);

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
