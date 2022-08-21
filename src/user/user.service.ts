import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseInterface } from 'src/common/interfaces/response';
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
      const userWithPosts = await this.userRepository.find({
        relations: { posts: true }, // retrieve the posts
        where: { id: user.id }, // specified the user
      });
      return { ok: true, status: 200, data: userWithPosts.at(0) };
    } catch (error) {
      return { ok: false, status: 500, msg: error.detail };
    }
  }

  // TODO: Refactor and/or documentation
  async savePost(
    user: UserEntity,
    postContent: string,
  ): Promise<ResponseInterface> {
    try {
      // creates a new post
      const post = this.postRepository.create({
        content: postContent,
        owner: user, // this binds this post with the current user
      });
      await this.dataSource.manager.save(post); // save the post
      return { status: 201, ok: true, msg: 'Post created successfully' };
    } catch (error) {
      return { ok: false, status: 500, msg: error.detail };
    }
  }
}
