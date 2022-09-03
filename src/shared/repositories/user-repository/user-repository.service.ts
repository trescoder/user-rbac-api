import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/bcrypt-manager';
import { UserEntity } from 'src/entities/user.entity';
import { CreateAccount } from 'src/user/create-account.interface';
import { ProfileDTO } from 'src/user/dto/profile.dto';
import { Repository } from 'typeorm';
import { PostRepositoryService } from '../post-repository/post-repository.service';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private postRepoService: PostRepositoryService,
  ) {}

  async saveUser(user: any) {
    this.userRepository.save(user);
  }

  async createAccount(account: CreateAccount) {
    // encrypt password before store
    account.password = hashPassword(account.password);
    await this.userRepository.save(account);
    return { msg: 'Account created successfully' };
  }

  async checkUserIdExistence(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user !== null;
  }

  async findUserBy(constrain: any) {
    return this.userRepository.findOneBy(constrain);
  }

  async getUserWithPost(userId: number, constrain: any) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'post')
      .where('user.id = :id', { id: userId })
      .getOne();
  }

  async getUserProfile(userId: number) {
    // retrieve user, posts and likes
    const userProfile = await this.getUserWithPost(userId, {});

    const postIds = userProfile.posts.map((post) => post.id);

    let posts = [];
    if (postIds.length > 0)
      posts = await this.postRepoService.getPostsWithLikes(postIds);

    userProfile.posts = posts;
    return new ProfileDTO(userProfile);
  }

  async deleteAccount(id: number) {
    await this.userRepository.delete(id);
  }
}
