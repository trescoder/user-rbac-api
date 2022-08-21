import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from 'src/bcrypt-manager';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUserCredential(email: string, password: string) {
    const { user } = await this.userService.findUser(email);
    if (!user || !comparePasswords(password, user.password)) {
      return null;
    }
    return user;
  }

  // this method sign some user information that will be later use to authenticate this user
  async login(user: { password: string; email: string }) {
    const token = this.jwtService.sign(user);
    return { token };
  }
}
