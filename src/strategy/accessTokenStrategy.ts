import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/sequelize';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@/common/types/requests/requests';
import { Auth } from '@/modules/auth/model/auth.model';
import { User } from '@/modules/users/models/user.model';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Auth) private readonly authRepository: typeof Auth,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('accessTokenSecret'),
    });
  }

  async validate(payload: JwtPayload) {
    const auth = await this.authRepository.findOne({
      where: { authId: payload.authId },
      include: [
        {
          model: User,
          attributes: ['uid'],
        },
      ],
    });

    if (!auth) {
      throw new UnauthorizedException();
    }

    return { authId: payload.authId, uid: auth.user?.uid || null };
  }
}
