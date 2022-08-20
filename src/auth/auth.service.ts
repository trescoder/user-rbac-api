import { Injectable } from '@nestjs/common';
import { comparePasswords } from 'src/bcrypt-manager';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUserCredential(email: string, password: string) {
    const { user } = await this.userService.findUser(email);
    if (!user || !comparePasswords(password, user.password)) {
      return null;
    }
    return user;
  }
}
