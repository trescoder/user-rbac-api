import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateAccount } from 'src/user/create-account.interface';
import { ProfileDTO } from 'src/user/dto/profile.dto';
import { DataSource, In, Repository } from 'typeorm';
import { PostRepositoryService } from '../post-repository/post-repository.service';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private postRepoService: PostRepositoryService,
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

  async findUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });
      return user;
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

  // TODO: Don't return entities but DTOs
  async getUserProfile(userData: any) {
    try {
      // retrieve user and posts
      const userWithPosts = await this.findUserWithPost(userData.id);
      // extract the posts ids
      const postIds = userWithPosts.posts.map((p) => p.id);

      // retrieve all posts that belong to this user with its likes/dislikes
      const postWithLikes = await this.postRepoService.getPostsWithLikes(
        postIds,
      );

      userWithPosts.posts = postWithLikes;
      return new ProfileDTO(userWithPosts);
    } catch (error) {
      throw new Error(error);
    }
  }
}
