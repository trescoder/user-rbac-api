import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateAccount } from 'src/user/create-account.interface';
import { ProfileDTO } from 'src/user/dto/profile.dto';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private dataSource: DataSource,
  ) {}

  async saveUser(account: CreateAccount) {
    await this.userRepository.save(account);
  }

  async findUserBy(constrain: any) {
    try {
      return this.userRepository.findBy(constrain);
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
      const postWithLikes = await this.postRepository.find({
        relations: { likes: true },
        where: { id: In(postIds) },
      });

      userWithPosts.posts = postWithLikes;
      return new ProfileDTO(userWithPosts);
    } catch (error) {
      throw new Error(error);
    }
  }
}
