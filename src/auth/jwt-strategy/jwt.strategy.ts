import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // instructs jwt from where it will extract the token
      ignoreExpiration: false,
      secretOrKey: 'supersecret',
    });
  }

  // this method is calling when using the (in this case) JwtGuard
  async validate(payload) {
    const { email, password } = payload;
    // after the token have been decoded we will have a user in payload, we only want the email, and password
    return { email, password };
  }
}
