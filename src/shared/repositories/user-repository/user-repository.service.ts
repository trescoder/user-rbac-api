import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    try {
      this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async createAccount(account: CreateAccount) {
    try {
      await this.userRepository.save(account);
      return { msg: 'Account crated successfully' };
    } catch (error) {
      if (error.detail.includes(' already exists')) {
        throw new HttpException(
          'Email or username already taken',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }
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
      .innerJoinAndSelect('user.posts', 'post')
      .where('user.id = :id', { id: userId })
      .andWhere('post.ownerId = :userId', { userId })
      .limit(constrain.limit ?? 15)
      .skip(constrain.skip ?? 0)
      .orderBy({ 'post.creation_date': 'DESC' })
      .getOneOrFail();
  }

  async getUserProfile(userId: number) {
    // retrieve user, posts and likes
    const userProfile = await this.getUserWithPost(userId, {});
    const postIds = userProfile.posts.map((post) => post.id);
    const posts = await this.postRepoService.getPostsWithLikes(postIds);
    userProfile.posts = posts;
    return new ProfileDTO(userProfile);
  }

  async deleteAccount(id: number) {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
