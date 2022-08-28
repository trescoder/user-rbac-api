import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { CreateAccount } from 'src/user/create-account.interface';
import { ProfileDTO } from 'src/user/dto/profile.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async saveUser(account: CreateAccount) {
    await this.userRepository.save(account);
  }

  async checkUserIdExistence(userId: number) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      return user !== null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUserBy(constrain: any) {
    try {
      return this.userRepository.findOneBy(constrain);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUserWithPost(userId: number) {
    return this.userRepository.findOne({
      relations: { posts: true },
      where: { id: userId },
    });
  }

  async getUserProfile(userId: number) {
    // retrieve user, posts and likes
    // TODO: Limit the number of posts
    const userProfile = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'post')
      .leftJoinAndSelect('post.likes', 'likes')
      .where('user.id = :userId', { userId: userId })
      .getOne();
    if (!userProfile) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
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
