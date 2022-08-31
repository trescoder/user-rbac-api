import { Injectable } from '@nestjs/common';
import { Roles } from 'src/roles';
import { ResponseInterface } from 'src/shared/interfaces/response';
import { UserRepositoryService } from 'src/shared/repositories/user-repository/user-repository.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    private userRepoService: UserRepositoryService,
    private userService: UserService,
  ) {}

  async getUserData(userId: number): Promise<ResponseInterface> {
    try {
      if (await this.userRepoService.checkUserIdExistence(userId)) {
        const user = await this.userRepoService.getUserProfile(userId);
        return { data: user, ok: true, status: 200 };
      }
      return { data: {}, ok: true, status: 404 };
    } catch (error) {
      console.log(error);

      return { ok: false, status: 500, msg: error.detail };
    }
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
