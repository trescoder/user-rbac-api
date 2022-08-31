import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepositoryService } from 'src/shared/repositories/user-repository/user-repository.service';
import { ProfileDTO } from 'src/user/dto/profile.dto';

@Injectable()
export class AdminService {
  constructor(private userRepoService: UserRepositoryService) {}

  async getUserData(userId: number): Promise<ProfileDTO> {
    if (!(await this.userRepoService.checkUserIdExistence(userId))) {
      throw new BadRequestException('Bad user Id.');
    }
    const user = await this.userRepoService.getUserProfile(userId);
    return user;
  }
}
