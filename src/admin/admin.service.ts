import { Injectable } from '@nestjs/common';
import { ResponseInterface } from 'src/shared/interfaces/response';
import { UserRepositoryService } from 'src/shared/repositories/user-repository/user-repository.service';

@Injectable()
export class AdminService {
  constructor(private userRepoService: UserRepositoryService) {}

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
}
