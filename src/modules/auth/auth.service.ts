/*
 * FILE: src/modules/auth/auth.service.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiErrors } from '@/common/constants/errors';
import { LoginDTO, RegisterAuthCredentialsDTO } from './dto';
import * as bcrypt from 'bcrypt';
import {
  AuthCredentials,
  CheckAuthResponse,
  FetchOnboardingResponse,
  LoginResponse,
  OnboardingStep,
  RefreshedTokens,
} from './response';
import { TokenService } from '../token/token.service';
import { Auth } from './model/auth.model';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshToken } from './model/refreshToken.model';
import { User } from '../users/models/user.model';
import { Avatar } from '../users/models/avatar.model';

// NestJS class implementing AuthService.
@Injectable()
export class AuthService {
  // Inject required services and repositories for this class.
  constructor(
    private readonly tokenService: TokenService,

    @InjectModel(Auth) private readonly authRepo: typeof Auth,
    @InjectModel(RefreshToken)
    private readonly refreshTokensRepo: typeof RefreshToken, //todo: just service
  ) {}

  // Refresh token data and return new authentication tokens.
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

  // Register a new user or auth record and return authentication details.
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

  // Hash the provided password before storing it.
  private async hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  // Find existing auth credentials by email address.
  private async findAuthByEmail(email: string): Promise<Auth> {
    return await this.authRepo.findOne({
      where: { email },
      attributes: { include: ['password'] },
    });
  }

  // Validate auth and return whether the condition holds.
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

    const onboardingStep = this.getOnboardingStep(
      auth.user,
      auth.user ? auth.user.avatar : null,
    );

    return {
      authCredentials: {
        authId: auth.authId,
        email: auth.email,
      },
      user: {
        firstName: auth.user.firstName,
        lastName: auth.user.lastName,
        uid: auth.user.uid,
        avatar:
          auth.user && auth.user.avatar
            ? {
                posX: auth.user.avatar.posX,
                posY: auth.user.avatar.posY,
                scale: auth.user.avatar.scale,
                url: auth.user.avatar.url,
              }
            : null,
      },
      onboardingStep,
    };
  }

  // Authenticate the user and return access and refresh tokens.
  public async login(
    dto: LoginDTO,
  ): Promise<LoginResponse & { refreshToken: string }> {
    const auth = await this.authRepo.findOne({
      where: { email: dto.email },
      attributes: { include: ['password'] },
      include: [
        {
          model: User,
          include: [{ model: Avatar, attributes: { exclude: ["userId", "id", "createdAt", "updatedAt"] } }],
        },
        { model: RefreshToken },
      ],
    });

    if (!auth || !auth.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, auth.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const onboardingStep = this.getOnboardingStep(
      auth.user,
      auth.user ? auth.user.avatar : null,
    );

    const { accessToken, refreshToken } = await this.refreshTokens(
      auth.authId,
      auth.refreshToken.jti,
    );

    return {
      authCredentials: {
        authId: auth.authId,
        email: auth.email,
      },
      user: auth.user
        ? {
            avatar: auth.user.avatar || null,
            firstName: auth.user.firstName,
            lastName: auth.user.lastName,
            uid: auth.user.uid,
          }
        : null,
      onboardingStep,
      accessToken,
      refreshToken,
    };
  }

  public async fetchOnboardingStep(authId: number): Promise<FetchOnboardingResponse> {
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

    const onboardingStep = this.getOnboardingStep(
      auth.user,
      auth.user ? auth.user.avatar : null,
    );

    return { onboardingStep }
  }

  // Retrieve onboarding step and return the requested data.
  private getOnboardingStep(
    user: User | null,
    avatar: Avatar | null,
  ): OnboardingStep {
    let onboardingStep: OnboardingStep;

    if (!user) {
      onboardingStep = OnboardingStep.USER_INFO;
    } else if (!user.description) {
      onboardingStep = OnboardingStep.DESCRIPTION;
    } else if (!avatar) {
      onboardingStep = OnboardingStep.AVATAR;
    } else {
      onboardingStep = OnboardingStep.REGISTERED;
    }

    return onboardingStep;
  }
}
