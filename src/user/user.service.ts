import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseInterface } from 'src/shared/interfaces/response';
import { CreateAccount } from './create-account.interface';
import { hashPassword } from 'src/bcrypt-manager';
import { UserRepositoryService } from 'src/shared/repositories/user-repository/user-repository.service';
import { PostDTO } from './dto/post.dto';
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

  async updatePost(
    postId: number,
    content: string,
  ): Promise<ResponseInterface> {
    try {
      const dbPost = await this.postRepoService.getPost(postId);
      if (dbPost) {
        const { msg, post } = await this.postRepoService.updatePost(
          dbPost,
          content,
        );
        return { ok: true, data: post, msg, status: 200 };
      } else {
        return {
          ok: false,
          msg: `post with id '${postId}' not found`,
          status: 404,
        };
      }
    } catch (error) {}
  }

  async deletePost(postId: number): Promise<ResponseInterface> {
    try {
      const { msg } = await this.postRepoService.deletePost(postId);
      return { ok: true, msg: msg, status: 200 };
    } catch (error) {
      return { ok: true, msg: error, status: 200 };
    }
  }

  async addLike({ postId, userId, like }): Promise<ResponseInterface> {
    try {
      if (!(await this.userRepoService.checkUserIdExistence(userId))) {
        throw new NotFoundException(`User with id ${userId} doesn't exists`);
      }

      if (!(await this.postRepoService.checkPostExistence(postId))) {
        throw new NotFoundException(`Post with id ${postId} doesn't exists`);
      }
      const { msg } = await this.likeRepoService.updateLikes({
        postId,
        userId,
        like,
      });
      return { ok: true, status: 201, msg };
    } catch (error) {
      return {
        ok: false,
        data: error.response,
        status: error.status,
        msg: error.message,
      };
    }
  }

  async deleteAccount(id: number): Promise<ResponseInterface> {
    try {
      const account = await this.userRepoService.findUserBy({ id });

      if (account) {
        await this.userRepoService.deleteAccount(account.id);
        return {
          ok: true,
          status: 200,
          msg: `Account removed successfully`,
        };
      } else {
        return {
          ok: true,
          status: 404,
          msg: `user account with id '${id}' not found`,
        };
      }
    } catch (error) {
      return { ok: false, status: 500, data: error, msg: '' };
    }
  }
}
