import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepositoryService } from 'src/shared/repositories/user-repository/user-repository.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserRepositoryService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // instructs jwt from where it will extract the token
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  // this method is calling when using the (in this case) JwtGuard
  async validate(payload) {
    const { email, id } = payload;

    const user = await this.userService.findUserBy({ id });
    if (!user) {
      throw new NotFoundException({
        message: 'Seems like this account does not exists',
      });
    }

    if (user.blocked) {
      throw new UnauthorizedException({
        message: 'Seems like this account have been blocked',
      });
    }
    // after the token have been decoded we will have the user email available in the payload
    return { email, id };
  }
}
