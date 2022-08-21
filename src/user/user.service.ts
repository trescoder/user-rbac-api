import { Injectable, Post } from '@nestjs/common';
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
    private dataSource: DataSource,
  ) {}

  // TODO: Refactor and/or documentation
  async createAccount(accountData: CreateAccount): Promise<ResponseInterface> {
    // encrypt password before store
    accountData.password = hashPassword(accountData.password);

    try {
      // creates the new account
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values([accountData])
        .execute();
      return { status: 200, ok: true, msg: 'User Account Created' };
    } catch (e) {
      return { status: 400, ok: false, msg: e.detail };
    }
  }

  // TODO: Refactor and/or documentation
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
  async getUserProfile(email: any): Promise<ResponseInterface> {
    let userInfo;
    // this part gets the user
    try {
      ({ user: userInfo } = await this.findUser(email));
    } catch (error) {
      return { ok: false, status: 500, msg: error.msg };
    }

    // this part gets the user's posts
    try {
      let userPosts = await this.dataSource
        .getRepository(UserEntity)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.posts', 'post')
        .getMany();
      userPosts = userPosts.filter((u) => u.id === userInfo.id);
      return { ok: true, status: 200, data: userPosts };
    } catch (error) {
      return { ok: false, status: 500, msg: error.msg };
    }
  }

  // TODO: Refactor and/or documentation
  async savePost(user: UserEntity, postContent: string) {
    try {
      const post = new PostEntity();
      post.content = postContent;
      post.owner = user;
      await this.dataSource.manager.save(post);
      user.posts.push(post);
      await this.dataSource.manager.save(user);
    } catch (error) {
      return { error, ok: false };
    }
  }
}
