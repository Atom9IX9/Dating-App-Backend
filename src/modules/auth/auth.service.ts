import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ApiErrors } from '@/common/constants/errors';
import { RegisterAuthCredentialsDTO } from './dto';
import * as bcrypt from 'bcrypt';
import {
  AuthCredentials,
  CheckAuthResponse,
  OnboardingStep,
  RefreshedTokens,
} from './response';
import { TokenService } from '../token/token.service';
import { Auth } from './model/auth.model';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshToken } from './model/refreshToken.model';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/user.model';
import { Avatar } from '../users/models/avatar.model';

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

  public async checkAuth(authId: number): Promise<CheckAuthResponse> {
    const auth = await this.authRepo.findOne({
      where: { authId },
      include: [
        {
          model: User,
          include: [Avatar],
          attributes: ['uid', 'firstName', 'lastName', 'description'],
        },
      ],
    });

    let onboardingStep: OnboardingStep;

    if (!auth.user.description) {
      onboardingStep = OnboardingStep.DESCRIPTION;
    } else if (!auth.user.avatar) {
      onboardingStep = OnboardingStep.AVATAR;
    } else {
      onboardingStep = OnboardingStep.REGISTERED;
    }

    return {
      authCredentials: {
        authId: auth.authId,
        email: auth.email,
      },
      user: {
        firstName: auth.user.firstName,
        lastName: auth.user.lastName,
        uid: auth.user.uid,
        avatar: {
          posX: auth.user.avatar.posX,
          posY: auth.user.avatar.posY,
          scale: auth.user.avatar.scale,
          url: auth.user.avatar.url,
        },
      },
      onboardingStep,
    };
  }

  // private generateAuthResponseWithToken(
  //   user: UserResponse,
  //   rememberUser: boolean,
  // ): AuthResponse {
  //   const token = this.tokenService.generateJwtToken(user, rememberUser);

  //   return { user, token };
  // }
}
