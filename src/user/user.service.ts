import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseInterface } from 'src/shared/interfaces/response';
import { UserEntity } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateAccount } from './create-account.interface';
import { hashPassword } from 'src/bcrypt-manager';
import { PostEntity } from 'src/entities/post.entity';
import { UserRepositoryService } from 'src/shared/repositories/user-repository/user-repository.service';
import { PostDTO } from './dto/post.dto';
import { LikeEntity } from 'src/entities/like.entity';
import { LikeRepositoryService } from 'src/shared/repositories/like-repository/like-repository.service';
import { PostRepositoryService } from 'src/shared/repositories/post-repository/post-repository.service';
@Injectable()
export class UserService {
  constructor(
    private userRepoService: UserRepositoryService,
    private likeRepoService: LikeRepositoryService,
    private postRepoService: PostRepositoryService,
  ) {}

  async createAccount(accountData: CreateAccount): Promise<ResponseInterface> {
    // encrypt password before store
    accountData.password = hashPassword(accountData.password);

    try {
      await this.userRepoService.saveUser(accountData);
      return { status: 200, ok: true, msg: 'User Account Created' };
    } catch (e) {
      return { status: 400, ok: false, msg: e.detail };
    }
  }

  async getUserProfile(user): Promise<ResponseInterface> {
    try {
      const userWithPosts = await this.userRepoService.getUserProfile(user);
      return { ok: true, status: 200, data: userWithPosts };
    } catch (error) {
      return { ok: false, status: 500, msg: error.detail };
    }
  }

  async savePost(user: any, postContent: string): Promise<ResponseInterface> {
    try {
      const userPosts = await this.userRepoService.findUserWithPost(user.id);
      // creates a new post
      const post = await this.postRepoService.createPost({
        content: postContent,
        owner: userPosts, // binds this post with this user
        likes: [],
      });

      await this.postRepoService.savePost(post); // save the post
      userPosts.posts.push(post); // bind this user with this post
      await this.userRepoService.saveUser(userPosts);
      const newPost = new PostDTO(post);

      return {
        status: 201,
        ok: true,
        data: { newPost },
      };
    } catch (error) {
      return { ok: false, status: 500, msg: error.detail };
    }
  }

  async addLike({ postId, userId, like }): Promise<ResponseInterface> {
    try {
      if (!(await this.userRepoService.checkUserIdExistence(userId))) {
        throw new Error(`User with id ${userId} doesn't exists`);
      }
      await this.likeRepoService.savePost({ postId, userId, like });
      return { ok: true, status: 201, msg: 'like/dislike added successfully' };
    } catch (error) {
      return { ok: false, data: error, status: 500 };
    }
  }
}
