import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseInterface } from 'src/shared/interfaces/response';
import { UserEntity } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateAccount } from './create-account.interface';
import { hashPassword } from 'src/bcrypt-manager';
import { PostEntity } from 'src/entities/post.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private dataSource: DataSource,
  ) {}

  // TODO: Refactor and/or documentation
  async createAccount(accountData: CreateAccount): Promise<ResponseInterface> {
    // encrypt password before store
    accountData.password = hashPassword(accountData.password);

    try {
      await this.userRepository.save(accountData);
      return { status: 200, ok: true, msg: 'User Account Created' };
    } catch (e) {
      return { status: 400, ok: false, msg: e.detail };
    }
  }

  // TODO: Refactor and/or documentation
  //? This method may be move to another service
  /**
   * @param email this can be either a string or an object with a email property
   * @returns an object containing a user entity or an error
   */
  async findUser(email: any) {
    try {
      let user;
      if (typeof email === 'string') {
        user = await this.userRepository.findOneBy({ email });
      } else {
        user = await this.userRepository.findOneBy({ email: email.email });
      }
      return { user };
    } catch (error) {
      return { error, ok: false };
    }
  }

  // TODO: Refactor and/or documentation
  async getUserProfile(user): Promise<ResponseInterface> {
    // retrieving user with posts
    try {
      // this will retrieve an array, but due to the where condition
      const userWithPosts = await this.userRepository.find({
        relations: { posts: true }, // retrieve the posts
        where: { id: user.id }, // specified the user
      });
      return { ok: true, status: 200, data: userWithPosts.at(0) };
    } catch (error) {
      return { ok: false, status: 500, msg: error.detail };
    }
  }

  async savePost(user: any, postContent: string): Promise<ResponseInterface> {
    try {
      // creates a new post
      const userWithPosts = await this.userRepository.find({
        relations: { posts: true }, // retrieve the posts
        where: { id: user.id }, // specified the user
      });
      const userPosts = userWithPosts.at(0);
      const post = this.postRepository.create({
        content: postContent,
        owner: userPosts, // binds this post with this user
      });
      await this.postRepository.save(post); // save the post
      userPosts.posts.push(post); // bind this user with this post
      await this.userRepository.save(userPosts);
      return {
        status: 201,
        ok: true,
        data: {
          content: post.content,
          id: post.id,
          creation_date: post.creation_date,
        },
      };
    } catch (error) {
      return { ok: false, status: 500, msg: error.detail };
    }
  }
}
