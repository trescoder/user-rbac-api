import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from 'src/bcrypt-manager';
import { UserRepositoryService } from 'src/shared/repositories/user-repository/user-repository.service';

@Injectable()
export class AuthService {
  constructor(
    private userRepoService: UserRepositoryService,
    private jwtService: JwtService,
  ) {}

  async validateUserCredential(email: string, password: string) {
    const user = await this.userRepoService.findUserBy({ email });
    if (!user || !comparePasswords(password, user.password)) {
      return null;
    }
    return user;
  }

  // this method sign some user information that will be later use to authenticate this user
  async login(userData: any) {
    const access_token = this.jwtService.sign(userData);
    return { access_token };
  }
}
