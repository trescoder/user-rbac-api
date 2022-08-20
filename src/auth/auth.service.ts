import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUserCredential(email: string) {
    const user = await this.userService.findUser(email);
    return user;
  }
}
