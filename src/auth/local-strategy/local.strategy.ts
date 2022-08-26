import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    // here we have to validate the user credential
    const user = await this.authService.validateUserCredential(email, password);
    if (!user) {
      throw new BadRequestException({
        message: 'Email or password incorrect',
      });
    }
    // this object will be store in req.user
    return { email: user.email, id: user.id };
  }
}
