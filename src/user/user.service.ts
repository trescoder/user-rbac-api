import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccount } from './create-account.interface';
import { UserRepositoryService } from 'src/shared/repositories/user-repository/user-repository.service';
import { PostDTO } from './dto/post.dto';
import { LikeRepositoryService } from 'src/shared/repositories/like-repository/like-repository.service';
import { PostRepositoryService } from 'src/shared/repositories/post-repository/post-repository.service';
import { Page, PaginationOptions } from 'src/shared/decorators/with-pagination';
import { FindManyOptions } from 'typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    private userRepoService: UserRepositoryService,
    private likeRepoService: LikeRepositoryService,
    private postRepoService: PostRepositoryService,
  ) {}

  async createAccount(accountData: CreateAccount) {
    const account = new UserEntity();
    account.email = accountData.email;
    account.password = accountData.password;
    account.role = accountData.role;
    account.username = accountData.username;
    await this.userRepoService.createAccount(account);
    return { msg: 'User Account Created' };
  }

  async getUserProfile(userId: number) {
    return this.userRepoService.getUserProfile(userId);
  }

  async findAndPaginatePosts(
    pagination: PaginationOptions<PostDTO>,
  ): Promise<Page<PostDTO>> {
    const findManyOptions: FindManyOptions<PostEntity> = {
      take: pagination.pageSize,
      skip: pagination.pageNumber * pagination.pageSize,
    };

    if (pagination.sortByColumn) {
      findManyOptions.order = {};
      findManyOptions.order[pagination.sortByColumn] =
        pagination.sortDirection as never;
    }

    const [assets, count] = await this.postRepoService.findAndCount(
      findManyOptions,
    );

    return {
      items: assets.map((r) => new PostDTO(r)),
      count,
    };
  }

  async addPost(userData: { email: string; id: number }, postContent: string) {
    // we need the user and its posts to bind the new post
    const userPosts = await this.userRepoService.getUserWithPost(
      userData.id,
      {},
    );

    // creates a new post
    const post = await this.postRepoService.createPost({
      content: postContent,
      owner: userPosts, // binds this post with this user
    });

    await this.postRepoService.savePost(post); // save the post

    userPosts.posts.push(post); // bind this user with this post
    await this.userRepoService.saveUser(userPosts);

    return new PostDTO(post);
  }

  async updatePost(postId: number, content: string) {
    const dbPost = await this.postRepoService.getPost(postId);
    dbPost.content = content;
    return this.postRepoService.savePost(dbPost);
  }

  async deletePost(postId: number) {
    return this.postRepoService.deletePost(postId);
  }

  async addLike({ postId, userId, like }) {
    if (!(await this.userRepoService.checkUserIdExistence(userId))) {
      throw new HttpException(
        `User with id ${userId} doesn't exists`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!(await this.postRepoService.checkPostExistence(postId))) {
      throw new HttpException(
        `Post with id ${postId} doesn't exists`,
        HttpStatus.NOT_FOUND,
      );
    }
    const { msg } = await this.likeRepoService.updateLikes({
      postId,
      userId,
      like,
    });
    return { ok: true, status: 201, msg };
  }

  async deleteAccount(id: number) {
    const account = await this.userRepoService.findUserBy({ id });
    if (!account) {
      throw new HttpException(
        'Account with id ' + id + ' Not found',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userRepoService.deleteAccount(account.id);
    return { msg: `Account removed successfully` };
  }
}
