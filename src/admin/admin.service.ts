import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepositoryService } from 'src/shared/repositories/user-repository/user-repository.service';
import { ProfileDTO } from 'src/user/dto/profile.dto';
import { Roles } from 'src/roles';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    private userRepoService: UserRepositoryService,
    private userService: UserService,
  ) {}

  async getUserData(userId: number): Promise<ProfileDTO> {
    if (!(await this.userRepoService.checkUserIdExistence(userId))) {
      throw new BadRequestException('Bad user Id.');
    }
    const user = await this.userRepoService.getUserProfile(userId);
    return user;
  }

  async createAdminUser() {
    return this.userService.createAccount({
      username: process.env.ADMIN_USERNAME,
      role: Roles[process.env.ADMIN_ROLE],
      password: process.env.ADMIN_PASSWORD,
      email: process.env.ADMIN_EMAIL,
    });
  }
}
