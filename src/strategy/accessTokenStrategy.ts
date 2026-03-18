<<<<<<< HEAD
import { Injectable } from '@nestjs/common';
=======
import { Injectable, UnauthorizedException } from '@nestjs/common';
>>>>>>> 0e04e2a2ca4c380b47525dc4f9f8b87d6de8545a
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/sequelize';
import { ExtractJwt, Strategy } from 'passport-jwt';
<<<<<<< HEAD
import { AuthPayload, JwtPayload } from 'src/common/types/requests/requests';
=======
import { JwtPayload } from 'src/common/types/requests/requests';
>>>>>>> 0e04e2a2ca4c380b47525dc4f9f8b87d6de8545a
import { Auth } from 'src/modules/auth/model/auth.model';
import { User } from 'src/modules/users/models/user.model';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
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

<<<<<<< HEAD
    return { authId: payload.authId, uid: auth?.user?.uid || null };
=======
    if (!auth) {
      throw new UnauthorizedException();
    }

    return { authId: payload.authId, uid: auth.user.uid };
>>>>>>> 0e04e2a2ca4c380b47525dc4f9f8b87d6de8545a
  }
}
